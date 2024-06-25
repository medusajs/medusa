process.chdir(__dirname)

module.exports = {
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
  ],
  transformIgnorePatterns: ["/dist", "/node_modules/"],
  transform: {
    "^.+\\.[jt]s$": [
      "@swc/jest",
      {
        jsc: {
          parser: { syntax: "typescript", decorators: true },
          transform: { decoratorMetadata: true },
        },
      },
    ],
  },
  setupFiles: ["../setup-env.js"],
  /*setupFilesAfterEnv: ["../setup.js"],
  globalSetup: "../globalSetup.js",
  globalTeardown: "../globalTeardown.js",*/
}
