const logger = console;

/** @typedef {'task' | 'start' | 'end' | 'info' | 'warn' | 'error' | 'debug'} Status */

/**
 * @param {Status} status
 * @param {string} text
 * @param {Record<string, unknown> | string | Error} [data]
 */
const write = (status, text, data) => {
  let textToLog = '';
  let logObject = false;

  if (status === 'task') textToLog = '👍  ';
  else if (status === 'start') textToLog = '\n🔥  ';
  else if (status === 'end') textToLog = '\n✅  ';
  else if (status === 'info') textToLog = 'ℹ️  ';
  else if (status === 'warn') textToLog = '🙀  ';
  else if (status === 'error') textToLog = '\n❌  ';
  else if (status === 'debug') textToLog = '🐞  ';

  textToLog += text;

  // Adds optional verbose output
  if (data) {
    if (typeof data === 'object') {
      logObject = true;
    } else {
      textToLog += `\n${data}`;
    }
  }

  logger.log(textToLog);
  if (['start', 'end', 'error'].indexOf(status) > -1) {
    logger.log();
  }
  if (logObject) logger.dir(data, { depth: 15 });
};
/**
 * Printing any statements
 *
 * @param {string} text
 * @returns {void}
 */
const log = text => {
  logger.log(text);
};

/**
 * Starting a process
 *
 * @param {string} text
 * @returns {void}
 */
const start = text => {
  write('start', text);
};

/**
 * Ending a process
 *
 * @param {string} text
 * @returns {void}
 */
const end = text => {
  write('end', text);
};

/**
 * Tasks within a process
 *
 * @param {string} text
 * @returns {void}
 */
const task = text => {
  write('task', text);
};

/**
 * Info about a process task
 *
 * @param {string} text
 * @returns {void}
 */
const info = text => {
  write('info', text);
};

/**
 * Verbose output
 *
 * @param {string} text
 * @param {Record<string, unknown> | string} [data]
 * @returns {void}
 */
const debug = (text, data) => {
  write('debug', text, data);
};

/**
 * Warn output
 *
 * @param {string} text
 * @param {Record<string, unknown> | string} [data]
 * @returns {void}
 */
const warn = (text, data) => {
  write('warn', text, data);
};

/**
 * Error output
 *
 * @param {string} text
 * @param {Record<string, unknown> | string} [err]
 * @returns {void}
 */
const error = (text, err) => {
  write('error', text, err);
};

module.exports = {
  log,
  task,
  info,
  debug,
  warn,
  error,
  start,
  end,
};
