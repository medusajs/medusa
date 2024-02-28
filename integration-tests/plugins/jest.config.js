process.chdir(__dirname)

module.exports = {
  name: "Plugins",
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
    // TODO: Add back when inventory and stock-location modules have been migrated
    "__tests__/inventory",
  ],
  transformIgnorePatterns: [`/dist`],
  transform: { "^.+\\.[jt]s$": `../../jest-transformer.js` },
  setupFiles: ["../setup-env.js"],
  setupFilesAfterEnv: ["../setup.js"],
  globalSetup: "../globalSetup.js",
  globalTeardown: "../globalTeardown.js",
}
