module.exports = {
  root: true,
  parser: "@babel/eslint-parser",
  parserOptions: {
    requireConfigFile: false,
    ecmaFeatures: {
      experimentalDecorators: true,
    },
  },
  plugins: ["prettier", "markdown"],
  extends: [
    "docs/content"
  ],
  settings: {
    react: {
      version: "detect",
    },
  },
  env: {
    es6: true,
    node: true,
  },
  ignorePatterns: [
    "**/content/references/**",
    "**/content/**/events-list.md"
  ],
}
