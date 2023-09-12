module.exports = {
  root: true,
  extends: [
    "docs/next"
  ],
  overrides: [
    {
      files: ["src/examples/*.tsx"],
      rules: {
        "@typescript-eslint/no-empty-function": "off",
        "no-console": "off"
      }
    }
  ],
  parserOptions: {
    project: true,
    tsconfigRootDir: __dirname,
  },
}
