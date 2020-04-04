let ignore = [`**/dist`]

// Jest needs to compile this code, but generally we don't want this copied
// to output folders
if (process.env.NODE_ENV !== `test`) {
  ignore.push(`**/__tests__`)
}

module.exports = {
  plugins: [
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-transform-instanceof",
  ],
  presets: ["@babel/preset-env"],
  env: {
    test: {
      plugins: ["@babel/plugin-transform-runtime"],
    },
  },
  ignore,
}
