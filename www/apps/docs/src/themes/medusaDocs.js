/* eslint-disable @typescript-eslint/no-var-requires */
const vsCodeTheme = require("prism-react-renderer/themes/vsDark")

const theme = {
  ...vsCodeTheme,
  plain: {
    ...vsCodeTheme.plain,
    backgroundColor: "#111827",
  },
}

module.exports = theme
