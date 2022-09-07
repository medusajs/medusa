module.exports = {
  root: true,
  parser: "@babel/eslint-parser",
  parserOptions: {
    requireConfigFile: false,
    ecmaFeatures: {
      experimentalDecorators: true,
    },
  },
  extends: [
    "eslint:recommended",
    "google",
  ],
  rules: {
    curly: [2, "all"],
    "new-cap": "off",
    "require-jsdoc": "off",
    "no-unused-expressions": "off",
    "no-unused-vars": "off",
    camelcase: "off",
    "no-invalid-this": "off",

    "max-len": ["error", {
      code: 80,
      ignoreStrings: true,
      ignoreRegExpLiterals: true,
      ignoreComments: true,
      ignoreTrailingComments: true,
      ignoreUrls: true,
      ignoreTemplateLiterals: true,
    }],
    indent: ["error", 2],
    semi: ["error", "never"],
    quotes: ["error", "double"],
    "comma-dangle": ["error", "never"],
    "object-curly-spacing": ["error", "always"],
    "arrow-parens": ["error", "always"],
    "linebreak-style": 0,
  },
  env: {
    es6: true,
    node: true,
    jest: true,
  },
  ignorePatterns: [
  ],
  overrides: [
    {
      files: [
        "packages/medusa/**/*.ts"
      ],
      plugins: ["@typescript-eslint/eslint-plugin"],
      extends: ["plugin:@typescript-eslint/recommended"],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        project: './packages/medusa/tsconfig.json'
      },
      rules: {
        "valid-jsdoc": ["off"],
        "@typescript-eslint/explicit-function-return-type": ["error"],
        "@typescript-eslint/no-non-null-assertion": ["off"],
        "@typescript-eslint/no-unused-vars": ["off"],
        "@typescript-eslint/no-explicit-any": ["off"],
        "@typescript-eslint/no-floating-promises": ["error"]
      },
    },
  ],
}
