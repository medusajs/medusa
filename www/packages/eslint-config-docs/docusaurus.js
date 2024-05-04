module.exports = {
  extends: [
    "plugin:@docusaurus/recommended",
    "google",
    "./base.js",
  ],
  ignorePatterns: [
    "**/node_modules/**",
    "**/.docusaurus/*",
    "**/build/*",
    ".eslintrc.js",
    "babel.config.js"
  ]
}