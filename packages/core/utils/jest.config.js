const defineJestConfig = require("../../../define_jest_config")
module.exports = defineJestConfig({
  testPathIgnorePatterns: [
    `dist/`,
    `node_modules/`,
    `__fixtures__/`,
    `__mocks__/`,
    `\\.test-output/`,
  ],
  modulePathIgnorePatterns: [`dist/`, `\\.test-output/`],
})
