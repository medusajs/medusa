const path = require(`path`)
const glob = require(`glob`)
const fs = require(`fs`)

const pkgs = glob.sync(`./packages/*`).map((p) => p.replace(/^\./, `<rootDir>`))

const reMedusa = /medusa$/
const medusaDir = pkgs.find((p) => reMedusa.exec(p))
const medusaBuildDirs = [`dist`].map((dir) => path.join(medusaDir, dir))
const builtTestsDirs = pkgs
  .filter((p) => fs.existsSync(path.join(p, `src`)))
  .map((p) => path.join(p, `__tests__`))
const distDirs = pkgs.map((p) => path.join(p, `dist`))
const ignoreDirs = [].concat(
  medusaBuildDirs,
  builtTestsDirs,
  distDirs,
  "<rootDir>/packages/medusa-react/*"
)

const coverageDirs = pkgs.map((p) => path.join(p, `src/**/*.js`))
const useCoverage = !!process.env.GENERATE_JEST_REPORT

module.exports = {
  notify: true,
  verbose: true,
  roots: pkgs,
  modulePathIgnorePatterns: ignoreDirs,
  coveragePathIgnorePatterns: ignoreDirs,
  testPathIgnorePatterns: [
    `<rootDir>/examples/`,
    `<rootDir>/dist/`,
    `<rootDir>/node_modules/`,
    `__tests__/fixtures`,
  ],
  transform: {
    "^.+\\.[jt]s?$": `<rootDir>/jest-transformer.js`,
  },
  //moduleNameMapper: {
  //  "^highlight.js$": `<rootDir>/node_modules/highlight.js/lib/index.js`,
  //},
  //snapshotSerializers: [`jest-serializer-path`],
  collectCoverageFrom: coverageDirs,
  //reporters: process.env.CI
  //  ? [[`jest-silent-reporter`, { useDots: true }]].concat(
  //      useCoverage ? `jest-junit` : []
  //    )
  //  : [`default`].concat(useCoverage ? `jest-junit` : []),
  testEnvironment: `node`,
  moduleFileExtensions: [`js`, `jsx`, `ts`, `tsx`, `json`],
  // setupFiles: [`<rootDir>/.jestSetup.js`],
}
