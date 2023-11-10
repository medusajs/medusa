import { themes } from "prism-react-renderer"

const theme = {
  ...themes.vsDark,
  plain: {
    ...themes.vsDark.plain,
    backgroundColor: "#111827",
  },
}

export default theme
