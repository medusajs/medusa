module.exports = {
  extends: [
    "next/core-web-vitals",
    "google",
    "./base.js"
  ],
  "rules": {
    "react/react-in-jsx-scope": "off",
    "@typescript-eslint/prefer-ts-expect-error": "off",
    "valid-jsdoc": "off"
  },
  ignorePatterns: [
    "next.config.js",
    "spec",
    "node_modules",
    "public",
    ".eslintrc.js"
  ],
  parserOptions: {
    project: true,
  },
}
