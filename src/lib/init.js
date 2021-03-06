const exec = require('child_process').execSync;
const path = require('path');

const BEDROCK_REPO_GIT_URL = 'https://github.com/usebedrock/bedrock.git';

const ROOT_FILES_TO_COPY = [
  '.editorconfig',
  '.gitignore',
  '.nvmrc',
];

const TMP_DIR = '.bedrock-tmp';

module.exports = function (opts) {
  console.log('Initializing your Bedrock project...');
  const base = opts.base;
  let branchToClone = 'master';

  // Clean up tmp directory
  exec(`rm -rf ${TMP_DIR}`);

  // Clone the bedrock repo to a tmp directory
  exec(`git clone --single-branch -b ${branchToClone} ${BEDROCK_REPO_GIT_URL} ${TMP_DIR}`);
  exec(`rm -rf ${path.join(TMP_DIR, '.git')}`);

  // If no base, copy bedrock repo verbatim to current directory
  exec(`cp -r ${TMP_DIR}/* .`);
  ROOT_FILES_TO_COPY.forEach(function (rootFileToCopy) {
    exec(`cp -r ${path.join(TMP_DIR, rootFileToCopy)} .`);
  });

  // Clean up tmp directory
  exec(`rm -rf ${TMP_DIR}`);
};
