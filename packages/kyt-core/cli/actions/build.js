// Command to build production code

const shell = require('shelljs');
const logger = require('kyt-utils/logger');
const { buildPath, publicBuildPath, publicSrcPath } = require('kyt-utils/paths')();
const build = require('../../utils/build');

module.exports = config => {
  logger.start('Starting production build...');

  // Clean the build directory.
  if (shell.rm('-rf', buildPath).code === 0) {
    shell.mkdir(buildPath);
    logger.task('Cleaned ./build');
  }

  // Copy public folder into build
  if (shell.test('-d', publicSrcPath)) {
    // Create build folder if it doesnt exist
    if (!shell.test('-d', buildPath)) {
      shell.mkdir(buildPath);
    }
    shell.cp('-r', publicSrcPath, publicBuildPath);
    logger.task('Copied /src/public to /build/public');
  } else {
    shell.mkdir('-p', `${buildPath}/public`);
  }

  Promise.all(build(), build(true)).then(res => {
    console.log('YASSSSSSSSS!');
  });
};
