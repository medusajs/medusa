module.exports = {
  extends: [
    "next/core-web-vitals",
    "google",
    "./base.js"
  ],
  rules: {
    "react/react-in-jsx-scope": "off",
  },
  ignorePatterns: [
    "next.config.js",
    "spec",
    "node_modules",
    "public",
    ".eslintrc.js"
  ],
}
