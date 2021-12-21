module.exports = {
  parser: `@babel/eslint-parser`,
  parserOptions: {
    requireConfigFile: false,
    ecmaFeatures: {
      experimentalDecorators: true,
    },
  },
  plugins: [`eslint-plugin-prettier`],
  extends: [`eslint:recommended`, `google`, `eslint-config-prettier`],
  rules: {
    "prettier/prettier": `error`,
    curly: [2, `all`],
    "new-cap": `off`,
    "require-jsdoc": `off`,
    semi: `off`,
    "no-unused-expressions": `off`,
    camelcase: `off`,
    "no-invalid-this": `off`,
  },
  env: {
    es6: true,
    node: true,
    jest: true,
  },
  ignorePatterns: [`**/models`, `**/repositories`],
  overrides: [
    {
      files: [`*.ts`],
      parser: `@typescript-eslint/parser`,
      plugins: [`@typescript-eslint/eslint-plugin`],
      extends: [`plugin:@typescript-eslint/recommended`],
      rules: {
        "valid-jsdoc": [
          "error",
          {
            requireParamType: false,
            requireReturnType: false,
            prefer: {
              arg: "param",
              argument: "param",
              class: "constructor",
              return: "return",
              virtual: "abstract",
            },
          },
        ],
        "@typescript-eslint/explicit-function-return-type": ["error"],
        "@typescript-eslint/no-non-null-assertion": ["off"],
      },
    },
    {
      files: [
        "**/api/**/*.js",
        "**/api/**/*.ts",
        "**/medusa-js/**/resources/**/*.ts",
      ],
      rules: {
        "valid-jsdoc": ["off"],
      },
    },
    {
      // Medusa JS client
      files: ["**/medusa-js/**/resources/**/*.ts"],
      rules: {
        "valid-jsdoc": ["off"],
      },
    },
    {
      files: ["**/api/**/*.ts"],
      rules: {
        "valid-jsdoc": ["off"],
        "@typescript-eslint/explicit-function-return-type": ["off"],
        "@typescript-eslint/no-var-requires": ["off"],
      },
    },
  ],
}
