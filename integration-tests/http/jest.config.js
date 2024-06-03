process.chdir(__dirname)

module.exports = {
  name: "HTTP Integration Tests",
  testEnvironment: `node`,
  rootDir: "./",
  transformIgnorePatterns: ["/dist", "/node_modules/"],
  transform: {
    "^.+\\.[jt]s$": ["@swc/jest"],
  },
  setupFiles: ["../setup-env.js"],
}
