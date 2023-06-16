/* eslint-disable @typescript-eslint/no-var-requires */
const palenightTheme = require("prism-react-renderer/themes/palenight")

const theme = {
  ...palenightTheme,
  plain: {
    color: "#ECEDEE",
    backgroundColor: "#151718",
  },
  styles: [
    ...palenightTheme.styles,
    {
      types: ["string", "inserted"],
      style: {
        color: "#4CC38A",
      },
    },
    {
      types: ["punctuation", "selector"],
      style: {
        color: "#9E8CFC",
      },
    },
    {
      types: ["doctype"],
      style: {
        color: "#9E8CFC",
        fontStyle: "italic",
      },
    },
    {
      types: ["builtin", "char", "constant", "function"],
      style: {
        color: "#52A9FF",
      },
    },
    {
      types: ["class-name", "attr-name"],
      style: {
        color: "#F1A10D",
      },
    },
    {
      types: ["tag", "deleted"],
      style: {
        color: "#FF6369",
      },
    },
    {
      types: ["boolean"],
      style: {
        color: "#FF6369",
      },
    },
  ],
}

module.exports = theme
