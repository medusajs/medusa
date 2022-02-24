const glob = require(`glob`)

const pkgs = glob
  .sync(`${__dirname}/*/`)
  .map((p) => p.replace(__dirname, `<rootDir>/integration-tests`))

module.exports = {
  testEnvironment: `node`,
  globalSetup: "<rootDir>/integration-tests/globalSetup.js",
  globalTeardown: "<rootDir>/integration-tests/globalTeardown.js",
  rootDir: `../`,
  roots: pkgs,
  projects: [
    "<rootDir>/integration-tests/api/jest.config.js",
    "<rootDir>/integration-tests/plugins/jest.config.js",
  ],
  testPathIgnorePatterns: [
    `/examples/`,
    `/www/`,
    `/dist/`,
    `/node_modules/`,
    `__tests__/fixtures`,
    `__testfixtures__`,
    `.cache`,
  ],
  transform: { "^.+\\.[jt]s$": `<rootDir>/jest-transformer.js` },
  setupFilesAfterEnv: ["<rootDir>/integration-tests/setup.js"],
}
