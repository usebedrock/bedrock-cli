const fs = require('fs');
const path = require('path');
const glob = require('glob');
const chalk = require('chalk');

const paths = {
  config: path.join(process.cwd(), './bedrock.config.js'),
  templates: {
    content: path.join(process.cwd(), './content/**/*.jade'),
    core: path.join(process.cwd(), './core/**/*.jade'),
  },
};

const bedrockConfig = require(paths.config);

function changeExtensionForAllJadeFiles() {
  const allFilePaths = [
    ...glob.sync(paths.templates.content),
    ...glob.sync(paths.templates.core),
  ];

  console.log(`Renaming ${allFilePaths.length} .jade files to .pug`);

  return Promise.all(allFilePaths.map(function (filePath) {
    return new Promise(function (resolve, reject) {
      fs.rename(filePath, filePath.replace('.jade', '.pug'), function (err) {
        if (err) return reject(err);
        resolve();
      })
    });
  }));
}

function replaceJadeInConfigFile() {
  return new Promise(function (resolve, reject) {
    fs.readFile(paths.config, 'utf8', function (err, configContents) {
      if (err) return reject(err);
      fs.writeFile(paths.config, configContents.replace(/jade/g, 'pug'), function (err) {
        if (err) return reject(err);
        resolve();
      })
    });
  });
}

module.exports = function () {
  changeExtensionForAllJadeFiles()
    .then(replaceJadeInConfigFile())
    .then(function () {
      console.log(chalk.green('Successfully migrated your project from Jade to Pug files!'));
    });
};
