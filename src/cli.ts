#!/usr/bin/env node

import { Command } from 'commander';
import * as pkg from '../package.json';

import SetCommand, { ISetCommandArgs } from './commands/set.command';

const program = new Command();

program
    .command('set <value>')
    .description('Sets a property value.')
    .option('-f, --file [file]', '*.ini file to set the property to.')
    .option('-o, --out [file]', '*.ini file to write to.', undefined)
    .option('-s, --section [section]', 'Section where to change the property.', undefined)
    .option('-k, --key [key]', 'Key where to change the property.')
    .option('-e, --eval', 'Indecates that the value given is a expression that needs to be evaluated.')
    .action((value, args) => {
        const commandArgs: ISetCommandArgs = {
            value: value,
            fileIn: args.file,
            fileOut: args.out !== undefined ? args.out : args.file,
            section: args.section,
            key: args.key,
            eval: args.eval,
        };

        const command = new SetCommand();
        const result = command.execute(commandArgs);

        console.log(result.message);
        return result.code;
    });

program
    .version(pkg.version)
    .description(pkg.description)
    .parse(process.argv);

if (process.argv.length <= 2) {
    program.help();
}