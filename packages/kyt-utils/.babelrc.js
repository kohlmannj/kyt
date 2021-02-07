const babelTransformRuntime = require('@babel/plugin-transform-runtime');

module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: '10',
        },
      },
    ],
  ],
  plugins: [babelTransformRuntime],
};
