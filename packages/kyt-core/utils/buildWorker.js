const buildConfigs = require('./buildConfigs');
const webpackCompiler = require('./webpackCompiler');
const config = require('./kytConfig');
const printAssets = require('./printAssets');

// todo: proper logging
const logger = console;
let building = false;

// todo, improve this api
function build(isServer) {
  // todo: just build the nescessary one here!
  const optionalConfig = {};

  let startT = new Date();
  const {
    clientConfig,
    serverConfig,
  } = buildConfigs(config(), 'production');
  console.log('done loading config', isServer, new Date() - startT);

  const webpackConfig = isServer ? serverConfig : clientConfig;

  startT = new Date();
  const compiler = webpackCompiler(webpackConfig, (stats) => {
    console.log('done compiling', isServer, new Date() - startT);
    if (!isServer) {
      printAssets(stats, clientConfig);
    }
    process.send({ blargh: 'yes' });
    // if (stats.hasErrors()) {
    //   process.exit(1);
    // }
    // printAssets(stats, clientConfig);
  });

  compiler.run(() => undefined);
}

process.on('message', (msg) => {
  console.log('Message from parent:', msg);
  if (!building) {
    build(msg);
  }

  building = true;
});
