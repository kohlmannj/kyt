module.exports = {
  presets: [
    [
      'babel-preset-kyt-react',
      {
        includeRuntime: true,
        typescript: true,
      },
    ],
  ],
  plugins: ['kyt-runtime/babel'],
  env: {
    production: {
      plugins: [['pretty-lights/babel', { hoist: true }]],
    },
    development: {
      plugins: [['pretty-lights/babel', { sourceMap: true, autoLabel: true }]],
    },
    test: {
      plugins: [['pretty-lights/babel', { hoist: true, autoLabel: true }]],
    },
  },
};
