const palenightTheme = require("prism-react-renderer/themes/palenight")

const theme = {
  ...palenightTheme,
  plain: {
    color: palenightTheme.plain.color,
    backgroundColor: '#262626'
  }
}

module.exports = theme;