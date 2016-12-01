const exec = require('child_process').execSync;
const path = require('path');
const fs = require('fs');
const merge = require('lodash/merge');

const BEDROCK_REPO = {
  ssh: 'git@github.com:mono-company/bedrock.git'
};

const TEMPLATE_REPOS = {
  'bootstrap': {
    'ssh': 'git@github.com:mono-company/bedrock-bootstrap-starter.git'
  }
};

const TMP_DIR = '.bedrock-tmp';
const BEDROCK_BASE_DIR = path.join(TMP_DIR, 'base');
const TEMPLATE_DIR = path.join(TMP_DIR, 'template');

module.exports = function (opts) {
  console.log('Initializing new project with template:', opts.template);

  if (opts.template && !TEMPLATE_REPOS[opts.template]) {
    const supportedTemplates = Object.keys(TEMPLATE_REPOS).map(t => `'${t}'`).join(', ');
    throw new Error(`The '${opts.template}' template is not a Bedrock registered template. The following templates are supported: ${supportedTemplates}.`);
  }

  // Clone the bedrock repo to a tmp directory
  exec(`git clone ${BEDROCK_REPO.ssh} ${BEDROCK_BASE_DIR}`);
  exec(`rm -rf ${path.join(BEDROCK_BASE_DIR, '.git')}`);

  // If no template, copy bedrock repo verbatim to current directory
  exec(`cp -r ${BEDROCK_BASE_DIR}/* .`);

  if (opts.template) {
    exec(`git clone ${TEMPLATE_REPOS[opts.template].ssh} ${TEMPLATE_DIR}`);
    exec(`rm -rf content/`);
    exec(`cp -r ${TEMPLATE_DIR}/content .`);

    const bedrockPackageJson = JSON.parse(fs.readFileSync(path.join(BEDROCK_BASE_DIR, 'package.json'), 'utf8'));
    const templatePackageJson = JSON.parse(fs.readFileSync(path.join(TEMPLATE_DIR, 'package.json'), 'utf8'));

    const generatedPackageJson = merge(bedrockPackageJson, templatePackageJson);

    delete generatedPackageJson.repository;
    delete generatedPackageJson.bugs;
    delete generatedPackageJson.homepage;

    fs.writeFileSync('./package.json', JSON.stringify(generatedPackageJson, null, 2));
  }

  // Clean up tmp directory
  exec(`rm -rf ${TMP_DIR}`);
};
