const defineJestConfig = require("../../../define_jest_config")
module.exports = defineJestConfig({
  // the plugin builds into `.medusa/server`, which mirrors `src` and would
  // otherwise be picked up as a duplicate (and partly broken) set of suites.
  // the dot must be escaped: these are regexes, and the repo root path itself
  // contains `medusa/`.
  modulePathIgnorePatterns: [`dist/`, `\\.medusa/`],
  testPathIgnorePatterns: [
    `dist/`,
    `\\.medusa/`,
    `node_modules/`,
    `__fixtures__/`,
    `__mocks__/`,
  ],
})
