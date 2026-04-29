const defineJestConfig = require("../../../define_jest_config")

module.exports = defineJestConfig({
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  extensionsToTreatAsEsm: [".ts"],
  testPathIgnorePatterns: [
    "dist/",
    "node_modules/",
    "__fixtures__/",
    "__mocks__/",
  ],
})
