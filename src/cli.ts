#!/usr/bin/env node

import * as commander from 'commander';
import * as pkg from '../package.json';

commander
    .version(pkg.version)
    .description(pkg.description)
    .parse(process.argv);
