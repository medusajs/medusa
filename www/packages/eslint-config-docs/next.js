const path = require("node:path")

const project = path.resolve(path.join(__filename, "..", "..", "tsconfig", "nextjs.json"))

module.exports = {
  extends: ["next/core-web-vitals", "google", "./base.js"],
  rules: {
    "react/react-in-jsx-scope": "off",
  },
  parserOptions: {
    project,
  },
}
