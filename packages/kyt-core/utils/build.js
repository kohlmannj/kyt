const path = require('path');
const { fork } = require('child_process');

module.exports = (isServer = false) =>
  new Promise((resolve) => {
    const worker = fork(
      path.resolve(__dirname, 'buildWorker.js')
    );
    worker.on('message', () => {
      resolve();
      worker.disconnect();
    });
    worker.send(isServer);
  });
