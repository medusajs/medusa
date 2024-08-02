process.chdir(__dirname)

module.exports = {
  testEnvironment: `node`,
  rootDir: "./",
  transformIgnorePatterns: ["/dist", "/node_modules/"],
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
  transform: {
    "^.+\\.[jt]s$": [
      "@swc/jest",
      {
        jsc: {
          parser: { syntax: "typescript", decorators: true },
          transform: { decoratorMetadata: true },
          target: "es2021",
        },
      },
    ],
  },
  setupFiles: ["../setup-env.js"],
}
