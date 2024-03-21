// API
process.chdir(__dirname)

module.exports = {
  name: "api",
  testEnvironment: `node`,
  rootDir: "./",
  testTimeout: 10000,
  testPathIgnorePatterns: [
    `/examples/`,
    `/www/`,
    `/dist/`,
    `/node_modules/`,
    `__tests__/fixtures`,
    `__testfixtures__`,
    `.cache`,
  ],
  transformIgnorePatterns: [`/dist`],
  transform: { "^.+\\.[jt]s$": `../../jest-transformer.js` },
  setupFiles: ["../setup-env.js"],
  setupFilesAfterEnv: ["../setup.js"],
  globalSetup: "../globalSetup.js",
  globalTeardown: "../globalTeardown.js",
}
