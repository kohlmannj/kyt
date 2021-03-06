const shell = require('shelljs');
const path = require('path');
const rootDir = process.cwd();

shell.config.silent = true;

module.exports = {
  setupStageWithFixture: (stageName, fixtureName) => {
    const stagePath = path.join(rootDir, stageName);
    shell.mkdir(stagePath);
    shell.exec(`cp -a ${rootDir}/e2e_tests/fixtures/${fixtureName}/. ${stagePath}/`);
    shell.cd(stagePath);
  },

  teardownStage: (stageName) => {
    shell.cd(rootDir);
    shell.rm('-rf', path.join(rootDir, stageName));
  },

  rootDir,
};
