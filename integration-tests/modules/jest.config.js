process.chdir(__dirname)
const defineJestConfig = require("../../define_jest_config")
module.exports = defineJestConfig({
  testEnvironment: `node`,
  rootDir: "./",
  testPathIgnorePatterns: [
    `/examples/`,
    `/www/`,
    `/dist/`,
    `/node_modules/`,
    `<rootDir>/node_modules/`,
    `__tests__/fixtures`,
    `__testfixtures__`,
    `.cache`,
    "__fixtures__",
  ],
  setupFiles: ["../setup-env.js"],
})
