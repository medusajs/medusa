const defineJestConfig = require("../../../../define_jest_config")
module.exports = defineJestConfig({
  moduleNameMapper: {
    "^@models": "<rootDir>/src/models",
    "^@services": "<rootDir>/src/services",
    "^@repositories": "<rootDir>/src/repositories",
    "^@types": "<rootDir>/src/types",
    "^@utils": "<rootDir>/src/utils",
  },
  // Mitigates this sandbox's documented network flakiness connecting to
  // api.easypost.com over IPv6 -- see jest.setup-network.js.
  setupFiles: ["<rootDir>/jest.setup-network.js"],
})
