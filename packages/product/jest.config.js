module.exports = {
  moduleNameMapper: {
    "^@models": "<rootDir>/src/models",
    "^@services": "<rootDir>/src/services",
  },
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
  moduleFileExtensions: [`js`, `ts`],
}
