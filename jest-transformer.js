const babelPreset = require(`babel-preset-medusa-package`)()
module.exports = require(`babel-jest`).createTransformer({
  ...babelPreset,
})
