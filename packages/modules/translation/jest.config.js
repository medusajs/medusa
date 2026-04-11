const defineJestConfig = require("../../../define_jest_config")
module.exports = defineJestConfig({
  moduleNameMapper: {
    "^@models$": "<rootDir>/src/models",
    "^@models/(.*)$": "<rootDir>/src/models/$1",
    "^@services$": "<rootDir>/src/services",
    "^@services/(.*)$": "<rootDir>/src/services/$1",
    "^@repositories$": "<rootDir>/src/repositories",
    "^@repositories/(.*)$": "<rootDir>/src/repositories/$1",
    "^@types$": "<rootDir>/src/types",
    "^@types/(.*)$": "<rootDir>/src/types/$1",
    "^@utils$": "<rootDir>/src/utils",
    "^@utils/(.*)$": "<rootDir>/src/utils/$1",
  },
})
