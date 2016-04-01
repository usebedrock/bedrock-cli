#!/usr/bin/env node --harmony
'use strict';


const program = require('commander');
const init = require('./lib/init');
const upgrade = require('./lib/upgrade');

program
  .version('0.0.1');

program
  .command('init [template]')
  .description('Initialize Bedrock')
  .action(template => {
    init({
      template
    });
  });

program
  .command('upgrade')
  .description('Upgrade Bedrock install')
  .action(() => {
    upgrade();
  });

program
  .parse(process.argv);
