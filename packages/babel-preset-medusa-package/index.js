const r = require(`./resolver`);

function preset(context, options = {}) {
  const { debug = false, nodeVersion = `10.14.0` } = options;
  const { NODE_ENV, BABEL_ENV } = process.env;

  const nodeConfig = {
    corejs: 3,
    useBuiltIns: `entry`,
    targets: {
      node: nodeVersion,
    },
  };

  return {
    presets: [r(`@babel/preset-env`)],
    plugins: [
      r(`@babel/plugin-proposal-optional-chaining`),
      r(`babel-plugin-transform-typescript-metadata`),
      r(`@babel/plugin-proposal-optional-chaining`),
      [r(`@babel/plugin-proposal-decorators`), { legacy: true }],
      [r(`@babel/plugin-proposal-class-properties`), { loose: true }],
      r(`@babel/plugin-transform-classes`),
      r(`@babel/plugin-transform-instanceof`),
      r(`@babel/plugin-transform-runtime`),
    ].filter(Boolean),
  };
}

module.exports = preset;
