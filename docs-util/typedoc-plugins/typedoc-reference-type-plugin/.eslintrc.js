module.exports = {
  root: true,
  plugins: ["prettier"],
  extends: ["eslint:recommended", "google", "plugin:prettier/recommended"],
  env: {
    es6: true,
    node: true,
    jest: true,
  },
  overrides: [
    {
      files: ["*.ts"],
      plugins: ["@typescript-eslint/eslint-plugin"],
      extends: ["plugin:@typescript-eslint/recommended"],
      parser: "@typescript-eslint/parser",
      rules: {
        "valid-jsdoc": "off",
        "require-jsdoc": "off",
      },
    },
  ],
}
