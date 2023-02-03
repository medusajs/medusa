const palenightTheme = require("prism-react-renderer/themes/palenight")

const theme = {
  ...palenightTheme,
  plain: {
    color: palenightTheme.plain.color,
    backgroundColor: '#1C1C1F'
  }
}

module.exports = theme;