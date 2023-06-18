module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
    sourceType: "module", // Allows for the use of imports
    project: "./tsconfig.admin.json",
  },
  files: ["./src/admin/**/*.ts", "./src/admin/**/*.tsx"],
  plugins: ["unused-imports"],
  extends: [
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
    "@medusajs/eslint-config",
  ],
  env: {
    browser: true,
  },
  rules: [
    {
      "prettier/prettier": "error",
      "react/prop-types": "off",
      "new-cap": "off",
      "require-jsdoc": "off",
      "valid-jsdoc": "off",
      "no-unused-expressions": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],
    },
  ],
}
