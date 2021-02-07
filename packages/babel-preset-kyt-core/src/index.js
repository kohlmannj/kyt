const babelPresetEnv = require('@babel/preset-env');
const babelPluginClassProperties = require('@babel/plugin-proposal-class-properties');
const babelPluginDecorators = require('@babel/plugin-proposal-decorators');
const babelPluginOptionalChaining = require('@babel/plugin-proposal-optional-chaining');
const babelTransformRuntime = require('@babel/plugin-transform-runtime');
const babelSyntaxDynamicImport = require('@babel/plugin-syntax-dynamic-import');
const babelDynamicImportNode = require('babel-plugin-dynamic-import-node');
const merge = require('lodash.merge');

/** @typedef {'client' | 'server' | 'test'} KytEnvType */

/**
 * @typedef {Object} Options
 * @property {boolean} [includeRuntime] Enable `@babel/plugin-transform-runtime`
 *   ([docs](https://babeljs.io/docs/en/babel-plugin-transform-runtime))
 * @property {{
 *   [P in KytEnvType]?: import('@babel/preset-env').Options;
 * }} [envOptions] `server`,
 *   `client` and `test`-specific options for `@babel/preset-env`
 *   ([docs](https://babeljs.io/docs/en/babel-preset-env))
 * @property {boolean} [typescript] Enable `@babel/preset-typescript`
 *   ([docs](https://babeljs.io/docs/en/babel-preset-typescript))
 */

/**
 * @param {import('@babel/core').ConfigAPI | {}} [_context]
 * @param {Options} [opts]
 */
module.exports = function getPresetCore(
  _context,
  { envOptions: userEnvOptions = {}, includeRuntime, typescript } = {}
) {
  /** @type {import('@babel/preset-env').Options} */
  let envOptions = {};

  /** @type {import('@babel/preset-env').Options} */
  const clientEnvOptions = {
    // modules are handled by webpack, don't transform them
    // however, scripts outside of Jest/Webpack will want these
    // transformed by default
    modules: process.env.KYT_ENV_TYPE ? false : 'commonjs',
    useBuiltIns: 'entry',
    corejs: 3,
    forceAllTransforms: true,
    targets: {
      browsers: ['>1%', 'last 4 versions', 'not ie < 11'],
    },
  };

  /** @type {import('@babel/preset-env').Options} */
  const serverEnvOptions = {
    // modules are handled by webpack, don't transform them
    // however, scripts outside of Jest/Webpack will want these
    // transformed by default
    modules: process.env.KYT_ENV_TYPE ? false : 'commonjs',
    useBuiltIns: 'entry',
    corejs: 3,
    forceAllTransforms: true,
    targets: {
      node: 'current',
    },
  };

  // Derive the babel-preset-env options based on the type of environment
  // we are in, client, server or test. Give the ability to users to override
  // the default environments in their own configurations, for example:
  //
  //  "presets": [["kyt-core", {
  //    "envOptions": {
  //      "client": { ... },
  //      "server": { ... },
  //      "test": { ... }
  //    }
  //  }]]
  //
  if (process.env.KYT_ENV_TYPE === 'server') {
    envOptions = merge({}, serverEnvOptions, userEnvOptions.server ? userEnvOptions.server : {});
  } else if (process.env.KYT_ENV_TYPE === 'test') {
    envOptions = merge({}, userEnvOptions.test ? userEnvOptions.test : {});
    // Unless the user wants to define the transform-runtime plugin,
    // we needs to make sure it's true/added for tests.
    if (includeRuntime === undefined) includeRuntime = true;
  } else {
    envOptions = merge({}, clientEnvOptions, userEnvOptions.client ? userEnvOptions.client : {});
  }

  return {
    presets: [[babelPresetEnv, envOptions], typescript && '@babel/preset-typescript'].filter(
      Boolean
    ),

    plugins: [
      [babelPluginDecorators, { legacy: true }],
      [babelPluginClassProperties, { loose: true }],
      babelPluginOptionalChaining,
      // provide the ability to opt into babel-plugin-transform-runtime inclusion
      includeRuntime === true && babelTransformRuntime,
      process.env.KYT_ENV_TYPE === 'test' ? babelDynamicImportNode : babelSyntaxDynamicImport,
    ].filter(Boolean),
  };
};
