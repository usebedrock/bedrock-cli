const exec = require('child_process').execSync;
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const semver = require('semver');
const merge = require('lodash/merge');

const migrateToPug = require('./migrate-to-pug');

const BEDROCK_REPO = {
  ssh: 'git@github.com:mono-company/bedrock.git'
};

const TMP_DIR = '.bedrock-tmp';
const BEDROCK_BASE_DIR = path.join(TMP_DIR, 'base');
const ROOT_FILES_TO_COPY = [
  'gulpfile.js',
  '.nvmrc',
];

module.exports = function (opts) {
  console.log('Upgrading your Bedrock install!');
  const branchToClone = opts.dev ? 'develop' : 'master';

  // Clean up tmp directory
  exec(`rm -rf ${TMP_DIR}`);

  const projectPackageJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8'));

  function migrateToPugIfNecessary() {
    if (!projectPackageJson.bedrockVersion || (projectPackageJson.bedrockVersion && semver.lt(projectPackageJson.bedrockVersion, '1.2.0'))) {
      console.log('It looks like this Bedrock project still uses Jade. Migrating to Pug.');
      console.log(chalk.dim('If your project already uses Pug, nothing should change.'));
      return migrateToPug();
    } else {
      return Promise.resolve();
    }
  }

  migrateToPugIfNecessary().then(function () {
    // Clone the bedrock repo to a tmp directory
    exec(`git clone --single-branch -b ${branchToClone} ${BEDROCK_REPO.ssh} ${BEDROCK_BASE_DIR}`);
    exec(`rm -rf ${path.join(BEDROCK_BASE_DIR, '.git')}`);

    const bedrockPackageJson = JSON.parse(fs.readFileSync(path.join(BEDROCK_BASE_DIR, 'package.json'), 'utf8'));

    if (projectPackageJson.bedrockVersion) {
      console.log(`Upgrading from version ${projectPackageJson.bedrockVersion} to ${bedrockPackageJson.version}`);
    } else {
      console.log(`Upgrading to version ${bedrockPackageJson.version}.`);
    }

    exec(`cp -r ${BEDROCK_BASE_DIR}/core .`);

    ROOT_FILES_TO_COPY.forEach(function (rootFileToCopy) {
      exec(`cp -r ${path.join(BEDROCK_BASE_DIR, rootFileToCopy)} .`);
    });

    const generatedPackageJson = merge({}, bedrockPackageJson, projectPackageJson);

    if (!projectPackageJson.repository) {
      delete generatedPackageJson.repository;
    }

    if (!projectPackageJson.bugs) {
      delete generatedPackageJson.bugs;
    }

    if (!projectPackageJson.homepage) {
      delete generatedPackageJson.homepage;
    }

    generatedPackageJson.bedrockVersion = bedrockPackageJson.version;

    // Clean up tmp directory
    exec(`rm -rf ${TMP_DIR}`);

    fs.writeFileSync('./package.json', JSON.stringify(generatedPackageJson, null, 2) + '\n');

    console.log(chalk.green('Your Bedrock project has been upgraded!'));
    console.log(chalk.yellow('Keep in mind that you may need to run `npm install` to install any new or updated dependencies.'));
  });
};
