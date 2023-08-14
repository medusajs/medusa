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
    "eslint:recommended",
    "google",
    "plugin:prettier/recommended",
    "plugin:markdown/recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
  ],
  settings: {
    react: {
      version: "detect",
    },
  },
  rules: {
    "no-undef": "off",
    "no-unused-expressions": "off",
    "no-unused-vars": "off",
    "no-unused-labels": "off",
    "no-console": "off",
    curly: ["error", "all"],
    "new-cap": "off",
    "require-jsdoc": "off",
    camelcase: "off",
    "no-invalid-this": "off",
    "max-len": [
      "error",
      {
        code: 64,
      },
    ],
    semi: ["error", "never"],
    quotes: [
      "error",
      "double",
      {
        allowTemplateLiterals: true,
      },
    ],
    "comma-dangle": [
      "error",
      {
        arrays: "always-multiline",
        objects: "always-multiline",
        imports: "always-multiline",
        exports: "always-multiline",
        functions: "never",
      },
    ],
    "object-curly-spacing": ["error", "always"],
    "arrow-parens": ["error", "always"],
    "linebreak-style": 0,
    "no-confusing-arrow": [
      "error",
      {
        allowParens: false,
      },
    ],
    "space-before-function-paren": [
      "error",
      {
        anonymous: "always",
        named: "never",
        asyncArrow: "always",
      },
    ],
    "space-infix-ops": "off",
    "eol-last": ["error", "always"],
    "react/prop-types": "off",
    "react/jsx-no-undef": "off",
  },
  env: {
    es6: true,
    node: true,
  },
  ignorePatterns: [],
  overrides: [
    {
      files: ["content/**/*.md", "content/**/*.mdx"],
      processor: "markdown/markdown",
    },
    {
      files: [
        "content/**/*.md/*.js",
        "content/**/*.mdx/*.js",
        "content/**/*.md/*.jsx",
        "content/**/*.mdx/*.jsx",
      ],
    },
    {
      files: [
        "content/**/*.md/*.ts",
        "content/**/*.mdx/*.ts",
        "content/**/*.md/*.tsx",
        "content/**/*.mdx/*.tsx",
      ],
      plugins: ["@typescript-eslint/eslint-plugin"],
      extends: ["plugin:@typescript-eslint/recommended"],
      parser: "@typescript-eslint/parser",
      rules: {
        "@typescript-eslint/no-unused-vars": "off",
        "@typescript-eslint/no-empty-function": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-non-null-assertion": "off",
      },
    },
  ],
}
