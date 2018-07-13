const exec = require('child_process').execSync;
const path = require('path');

const BEDROCK_REPO_GIT_URL = 'https://github.com/usebedrock/bedrock.git';
const BASES = {
  material: {
    branchName: 'materialdesignbase',
  },
  bootstrap4: {
    branchName: 'bootstrap4base',
  },
};

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

  if (base) {
    if (!Object.keys(BASES).includes(base)) {
      throw new Error(`The '${base}' base is not a valid Bedrock base. The following bases are supported: ${Object.keys(BASES).map(b => `'${b}'`).join(', ')}.`);
    }

    branchToClone = BASES[base].branchName;
  }

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
