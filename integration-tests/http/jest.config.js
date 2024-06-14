process.chdir(__dirname)

module.exports = {
  testEnvironment: `node`,
  rootDir: "./",
  transformIgnorePatterns: ["/dist", "/node_modules/"],
  transform: {
    "^.+\\.[jt]s$": ["@swc/jest"],
  },
  setupFiles: ["../setup-env.js"],
}
