module.exports = {
  parser: "@babel/eslint-parser",
  parserOptions: {
    requireConfigFile: false,
    ecmaFeatures: {
      experimentalDecorators: true,
    },
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  env: {
    es6: true,
    node: true,
  },
  plugins: ["prettier", "markdown"],
  ignorePatterns: [
    "**/references/**",
    "**/events-reference/**"
  ],
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
      // TODO change back to error once we figure out
      // a way to use HTML comments in new MDX
      "warn",
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
  overrides: [
    {
      files: ["**/*.md", "**/*.mdx"],
      processor: "markdown/markdown",
    },
    {
      files: [
        "**/*.md/*.js",
        "**/*.mdx/*.js",
        "**/*.md/*.jsx",
        "**/*.mdx/*.jsx",
      ],
    },
    {
      files: [
        "**/*.md/*.ts",
        "**/*.mdx/*.ts",
        "**/*.md/*.tsx",
        "**/*.mdx/*.tsx",
      ],
      plugins: ["@typescript-eslint/eslint-plugin"],
      extends: ["plugin:@typescript-eslint/recommended"],
      parser: "@typescript-eslint/parser",
      rules: {
        "@typescript-eslint/no-unused-vars": "off",
        "@typescript-eslint/no-empty-function": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-non-null-assertion": "off",
        "@typescript-eslint/no-var-requires": "off",
        "prefer-rest-params": "off",
        "@typescript-eslint/ban-ts-comment": "off",
        "@typescript-eslint/no-non-null-asserted-optional-chain": "off",
        "@typescript-eslint/ban-types": "off"
      },
    },
  ],
}
