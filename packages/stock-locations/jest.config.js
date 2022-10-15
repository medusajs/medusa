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
  globals: {
    "ts-jest": {
      tsConfig: "tsconfig.spec.json",
      isolatedModules: false,
    },
  },
  transform: {
    "^.+\\.[jt]s?$": "ts-jest",
  },
  testEnvironment: `node`,
  moduleFileExtensions: [`js`, `jsx`, `ts`, `tsx`, `json`],
  setupFilesAfterEnv: ["<rootDir>/setupTests.js"],
}
