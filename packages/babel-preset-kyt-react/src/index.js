const babelPresetReact = require('@babel/preset-react');
const addReactDisplayName = require('babel-plugin-add-react-displayname');
const reactRemovePropTypes = require('babel-plugin-transform-react-remove-prop-types');
const reactTransformConstant = require('@babel/plugin-transform-react-constant-elements');
const reactTransformInline = require('@babel/plugin-transform-react-inline-elements');
const babelPresetKytCore = require('babel-preset-kyt-core');

/**
 * @typedef {Object} OwnOptions
 * @property {boolean} [useProductionTransforms] Add production-only React plugins that remove
 *   `propTypes`, transform constant elements, transform inline elements
 */

/** @typedef {import('babel-preset-kyt-core').Options & OwnOptions} Options */

/**
 * @param {import('@babel/core').ConfigAPI | {}} [_context]
 * @param {Options} [opts]
 */
module.exports = function getPresetReact(
  _context,
  { useProductionTransforms = true, ...babelPresetKytCoreOptions } = {}
) {
  const productionTransforms = [reactRemovePropTypes];

  if (useProductionTransforms === true) {
    productionTransforms.push(reactTransformConstant);
    productionTransforms.push(reactTransformInline);
  }

  return {
    plugins: [addReactDisplayName],
    env: {
      development: {
        presets: [
          [babelPresetReact, { development: true }],
          // pass options through to core preset
          [babelPresetKytCore, babelPresetKytCoreOptions],
        ],
      },
      test: {
        presets: [
          babelPresetReact,
          // pass options through to core preset
          [babelPresetKytCore, babelPresetKytCoreOptions],
        ],
      },
      production: {
        presets: [
          babelPresetReact,
          // pass options through to core preset
          [babelPresetKytCore, babelPresetKytCoreOptions],
        ],
        plugins: productionTransforms,
      },
    },
  };
};
