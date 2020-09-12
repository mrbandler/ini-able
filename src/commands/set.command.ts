import * as fs from 'fs-extra';
import * as ini from 'ini';

import ICommand from '../types/commands/ICommand';
import ICommandResult from '../types/commands/ICommandResult';
import IIniObject from '../types/commands/IIniObject';

/**
 * Set command arguments.
 *
 * @export
 * @interface SetCommandArgs
 */
export interface ISetCommandArgs {
    value: string;
    fileIn: string;
    fileOut: string;
    section: string;
    key: string;
    eval: boolean;
}

/**
 * Section info for parsed alternations.
 *
 * @interface ISectionInfo
 */
interface ISectionInfo {
    line: number;
    section: string;
}

/**
 * Line info for parsed alternations.
 *
 * @interface ILineInfo
 */
interface ILineInfo {
    line: number;
    originalKey: string;
    originalValue: string;
    section: ISectionInfo | undefined;
}

/**
 * Set property command.
 *
 * @export
 * @class SetCommand
 * @implements {ICommand<SetCommandArgs>}
 */
export default class SetCommand implements ICommand<ISetCommandArgs> {
    private alterations: Map<ILineInfo, string> = new Map<ILineInfo, string>();

    /**
     * Executes the command.
     *
     * @param {SetCommandArgs} args Command arguments.
     * @returns {ICommandResult} Command result.
     * @memberof SetCommand
     */
    public execute(args: ISetCommandArgs): ICommandResult {
        let result = this.createCommandResult(42, 'Unexpected error occurred.');

        if (this.isFileValid(args.fileIn)) {
            const iniObj = this.parse(args.fileIn) as IIniObject;
            const section = this.extractSection(iniObj, args.section);

            if (section !== undefined) {
                if (args.eval) {
                    let v = section[args.key];
                    if (isNaN(v) === false) {
                        v = parseFloat(v);
                    }

                    section[args.key] = eval(args.value);
                } else {
                    section[args.key] = args.value;
                }

                this.writeFile(iniObj, args.fileOut);

                if (args.section !== undefined) {
                    result = this.createCommandResult(
                        0,
                        `Wrote (${args.fileOut}) key '${args.key}' in section '${args.section}' to '${args.value}'.`,
                    );
                } else {
                    result = this.createCommandResult(
                        0,
                        `Wrote (${args.fileOut}) key '${args.key}' to '${args.value}'.`,
                    );
                }
            } else {
                result = this.createCommandResult(2, `${args.section} could not be found.`);
            }
        } else {
            result = this.createCommandResult(1, `${args.fileIn}: could not be found.`);
        }

        return result;
    }

    /**
     * Checks whether a given file path leads to a valid file on disk.
     *
     * @private
     * @param {string} path File path to check
     * @returns {boolean} Flag, whether the file is valid
     * @memberof SetCommand
     */
    private isFileValid(path: string): boolean {
        return fs.existsSync(path);
    }

    /**
     * Parses a ini files content with a given file path.
     *
     * @private
     * @param {string} path File path for the *.ini file to parse
     * @returns {IIniObject} Parsed *.ini values as a JS object
     * @memberof SetCommand
     */
    private parse(path: string): IIniObject {
        let contents = fs.readFileSync(path, 'utf-8');

        [this.alterations, contents] = this.parseAlterations(contents);
        return ini.parse(contents);
    }

    /**
     * Parses alternation the default *.ini parser can't handle.
     *
     * @private
     * @param {string} contents *.ini file contents to parse
     * @returns {[Map<ILineInfo, string>, string]} Tuple of a map of alternations and the given the modified *.ini contents for further parsing
     * @memberof SetCommand
     */
    private parseAlterations(contents: string): [Map<ILineInfo, string>, string] {
        const result: [Map<ILineInfo, string>, string] = [new Map<ILineInfo, string>(), contents];

        let lastSection: ISectionInfo | undefined = undefined;
        const lines = contents.split('\n');
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            lines[i] = line;

            if (line.includes('[') && line.includes(']')) {
                lastSection = { line: i, section: line };

                continue;
            }

            if (line.substr(0, 1) === '+') {
                const split = line.split(/=(.+)/, 2);
                const originalKey = split[0];
                const originalValue = split[1];
                const newKey = i.toString() + '-' + originalKey.replace('+', '');

                const lineInfo: ILineInfo = {
                    section: lastSection,
                    line: i,
                    originalKey: originalKey,
                    originalValue: originalValue,
                };

                result[0].set(lineInfo, newKey);
                lines[i] = line.replace(originalKey, newKey);
            }
        }

        result[1] = lines.join('\n');
        return result;
    }

    /**
     * Extracts a section from a given *.ini object.
     *
     * @private
     * @param {IIniObject} iniObj *.ini object to extract the section from
     * @param {string} section Name of the section to extract
     * @returns {IIniObject} Sub *.ini object representing the extracted section, if section is not found or section is undefined input object is returned
     * @memberof SetCommand
     */
    private extractSection(iniObj: IIniObject, section: string): IIniObject {
        let result = iniObj;

        if (section !== undefined) {
            if (section.includes('.')) {
                const split = section.split('.');
                for (const s of split) {
                    result = result[s];
                    if (result === undefined) {
                        break;
                    }
                }
            } else {
                result = result[section];
            }
        }

        return result;
    }

    /**
     * Writes a given *.ini object back to a file.
     *
     * @private
     * @param {IIniObject} iniObj *.ini object to write
     * @param {string} path File path of the file to write to
     * @memberof SetCommand
     */
    private writeFile(iniObj: IIniObject, path: string): void {
        let iniContents = ini.stringify(iniObj);

        if (this.alterations.size > 0) {
            const lines = iniContents.split('\n');
            this.alterations.forEach((_, k) => {
                lines[k.line] = k.originalKey + '=' + k.originalValue;
            });

            iniContents = lines.join('\n');
        }

        fs.writeFileSync(path, iniContents);
    }

    /**
     * Creates a command result with a given code and a message.
     *
     * @private
     * @param {number} code Result code (success: 0, error: anything else then 0)
     * @param {string} message Result message
     * @returns {ICommandResult} Created command result
     * @memberof SetCommand
     */
    private createCommandResult(code: number, message: string): ICommandResult {
        return { code, message };
    }
}
