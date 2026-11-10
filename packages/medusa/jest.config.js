const defineJestConfig = require("../../define_jest_config")

module.exports = {
  //moduleNameMapper: {
  //  "^highlight.js$": `<rootDir>/node_modules/highlight.js/lib/index.js`,
  //},
  //snapshotSerializers: [`jest-serializer-path`],
  // collectCoverageFrom: coverageDirs,
  //reporters: process.env.CI
  //  ? [[`jest-silent-reporter`, { useDots: true }]].concat(
  //      useCoverage ? `jest-junit` : []
  //    )
  //  : [`default`].concat(useCoverage ? `jest-junit` : []),
  transform: { "^.+\\.[jt]s?$": "@swc/jest" },
  modulePathIgnorePatterns: ["__fixtures__", "node_modules", "dist"],
  transformIgnorePatterns: defineJestConfig().transformIgnorePatterns,
  testEnvironment: `node`,
  moduleFileExtensions: [`js`, `ts`],
  setupFilesAfterEnv: ["<rootDir>/setupTests.js"],
}
