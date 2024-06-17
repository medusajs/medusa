const path = require(`path`)
const glob = require(`glob`)
const fs = require(`fs`)

const pkgs = [
  glob.sync(`./packages/*`).map((p) => p.replace(/^\./, `<rootDir>`)),
  glob.sync(`./packages/cli/*`).map((p) => p.replace(/^\./, `<rootDir>`)),
  glob.sync(`./packages/core/*`).map((p) => p.replace(/^\./, `<rootDir>`)),
  glob.sync(`./packages/modules/*`).map((p) => p.replace(/^\./, `<rootDir>`)),
  glob
    .sync(`./packages/modules/providers/*`)
    .map((p) => p.replace(/^\./, `<rootDir>`)),
].flat(Infinity)

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
const projects = pkgs.map((pkg) => pkg.concat("/jest.config.js"))

module.exports = {
  notify: true,
  verbose: true,
  roots: ["<rootDir>"],
  projects: [
    "<rootDir>/packages/*/jest.config.js",
    "<rootDir>/packages/cli/*/jest.config.js",
    "<rootDir>/packages/core/*/jest.config.js",
    "<rootDir>/packages/modules/*/jest.config.js",
    "<rootDir>/packages/modules/providers/*/jest.config.js",
  ],
  modulePathIgnorePatterns: ignoreDirs,
  coveragePathIgnorePatterns: ignoreDirs,
  testPathIgnorePatterns: [
    `<rootDir>/examples/`,
    `<rootDir>/dist/`,
    `<rootDir>/node_modules/`,
    `__tests__/fixtures`,
  ],
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
  // setupFiles: [`<rootDir>/.jestSetup.js`],
}
