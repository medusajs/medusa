const glob = require(`glob`)

const pkgs = glob
  .sync(`${__dirname}/*/`)
  .map((p) => p.replace(__dirname, `<rootDir>/integration-tests`))

module.exports = {
  globals: {
    "ts-jest": {
      isolatedModules: process.env.ISOLATED_MODULES,
    },
  },
  testEnvironment: `node`,
  testTimeout: 10000,
  globalSetup: "<rootDir>/integration-tests/globalSetup.js",
  globalTeardown: "<rootDir>/integration-tests/globalTeardown.js",
  rootDir: `../`,
  roots: pkgs,
  projects: [
    "<rootDir>/integration-tests/api/jest.config.js",
    "<rootDir>/integration-tests/plugins/jest.config.js",
    "<rootDir>/integration-tests/repositories/jest.config.js",
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
  transformIgnorePatterns: [
    `/dist`,
    "src/",
    `/examples/`,
    `/www/`,
    `/dist/`,
    `/node_modules/`,
    `__tests__/fixtures`,
    `__testfixtures__`,
    "factories",
    "helpers",
    `.cache`,
  ],
  transform: { "^.+\\.[jt]s$": `ts-jest` },
  setupFiles: ["<rootDir>/integration-tests/setup-env.js"],
  setupFilesAfterEnv: ["<rootDir>/integration-tests/setup.js"],
}
