
// Command to run production code

const shell = require('shelljs');
const logger = require('./../logger');

module.exports = () => {
  logger.start('Starting production...');
  shell.exec('node build/server/main.js');
};