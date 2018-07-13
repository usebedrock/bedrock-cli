#!/usr/bin/env node --harmony
'use strict';


const program = require('commander');
const init = require('./lib/init');
const upgrade = require('./lib/upgrade');
const migrateToPug = require('./lib/migrate-to-pug');
const cliVersion = require('../package.json').version;

program
  .version(cliVersion);

program
  .command('init [base]')
  .description('Initialize Bedrock with an optional base')
  .action(function (base) {
    init({
      base
    });
  });

program
  .command('upgrade')
  .description('Upgrade Bedrock install')
  .action(upgrade);

program
  .command('migrate-to-pug')
  .description('Migrates all Jade files and code to Pug.')
  .action(migrateToPug);

program
  .parse(process.argv);
