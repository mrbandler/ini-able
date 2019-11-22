import * as fs from 'fs-extra';
import * as ini from 'ini';

import ICommand from "../types/commands/ICommand";
import ICommandResult from "../types/commands/ICommandResult";
import IIniObject from '../types/commands/IIniObject';
import { isNumber } from 'util';

/**
 * 
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
};

interface ISectionInfo {
    line: number;
    section: string;
}

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
        let result = this.createCommandResult(42, "Unexpected error occurred.");
        
        if (this.isFileValid(args.fileIn)) {
            let iniObj = this.parse(args.fileIn) as IIniObject;
            let section = this.extractSection(iniObj, args.section);
            
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
                result = this.createCommandResult(0, `Wrote (${args.fileOut}) key '${args.key}' in section '${args.section}' to '${args.value}'.`);
            } else {
                result = this.createCommandResult(0, `Wrote (${args.fileOut}) key '${args.key}' to '${args.value}'.`);
            }
        } else {
            result = this.createCommandResult(1, `${args.fileIn + ': could not be found.'}`);
        }

        return result;
    }

    private isFileValid(path: string): boolean {
        return fs.existsSync(path);
    }

    private parse(path: string): Object {
        let contents = fs.readFileSync(path, 'utf-8');

        [this.alterations, contents] = this.parseAlterations(contents);
        return ini.parse(contents);
    }

    private parseAlterations(contents: string): [Map<ILineInfo, string>, string] {
        let result: [Map<ILineInfo, string>, string] = [new Map<ILineInfo, string>(), contents];
        
        let lastSection: ISectionInfo | undefined = undefined;
        let lines = contents.split('\n');
        for(let i = 0; i < lines.length; i++) {
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

    private extractSection(iniObj: IIniObject, section: string): IIniObject {
        let result = iniObj;

        if (section !== undefined) {
            if (section.includes('.')) {
                const split = section.split('.');
                for (let s of split) {
                    result = result[s];
                }
            } else {
                result = result[section];
            }
        }

        return result;
    }

    private writeFile(iniObj: IIniObject, path: string): void {
        let iniContents = ini.stringify(iniObj);
        
        if (this.alterations.size > 0) {
            let lines = iniContents.split('\n');
            this.alterations.forEach((v, k) => {
                lines[k.line] = k.originalKey + '=' + k.originalValue; 
            });

            iniContents = lines.join('\n');
        }

        fs.writeFileSync(path, iniContents);
    }

    private createCommandResult(code: number, message: string): ICommandResult {
        return { code, message };
    }
}