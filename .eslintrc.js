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
    curly: [1, "all"],
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
    quotes: ["error", "double", {
      "allowTemplateLiterals": true
    }],
    "comma-dangle": ["error", {
      arrays: "never",
      objects: "always-multiline",
      imports: "always-multiline",
      exports: "always-multiline",
      functions: "never"
    }],
    "object-curly-spacing": ["error", "always"],
    "arrow-parens": ["error", "always"],
    "linebreak-style": 0,
    "no-confusing-arrow":  ["error", {
      allowParens: false
    }],
    "no-mixed-operators": ["error"],
    "no-use-before-define": "error",
    "space-before-function-paren": ["error", "never"],
    "space-infix-ops": "error",
    "eol-last": ["error", "always"],
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
      files: ["*.ts"],
      plugins: ["@typescript-eslint/eslint-plugin"],
      extends: ["plugin:@typescript-eslint/recommended"],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        project: './packages/medusa/tsconfig.json'
      },
      rules: {
        "valid-jsdoc": "off",
        "brace-style": "off",
        "keyword-spacing": "off",
        "no-use-before-define": "off",
        "space-before-function-paren": "off",
        "space-infix-ops": "off",

        "@typescript-eslint/no-non-null-assertion": "off",
        "@typescript-eslint/no-floating-promises": "error",
        "@typescript-eslint/await-thenable": "error",
        "@typescript-eslint/promise-function-async": "error",
        "@typescript-eslint/brace-style": ["error", "1tbs", {
          "allowSingleLine": false
        }],
        "@typescript-eslint/keyword-spacing": "error",
        "@typescript-eslint/no-use-before-define": "error",
        "@typescript-eslint/space-before-function-paren": ["error", "never"],
        "@typescript-eslint/space-infix-ops": "error",

        // --- Rules to be fixed
        "@typescript-eslint/ban-ts-comment": "off",
        "@typescript-eslint/no-unused-vars": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/ban-types": "off",
      },
    },
  ],
}
