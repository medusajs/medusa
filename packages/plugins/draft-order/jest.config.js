const defineJestConfig = require("../../../define_jest_config")
module.exports = defineJestConfig({
  modulePathIgnorePatterns: [`dist/`, `\\.medusa/`],
  testPathIgnorePatterns: [
    `dist/`,
    `\\.medusa/`,
    `node_modules/`,
    `__fixtures__/`,
    `__mocks__/`,
  ],
})
