module.exports = {
  globals: {
    "ts-jest": {
      tsConfig: "tsconfig.json",
      isolatedModules: false,
    },
  },
  transform: {
    "^.+\\.[jt]s?$": "ts-jest",
  },
  testEnvironment: `node`,
  moduleFileExtensions: [`js`, `ts`],
  testTimeout: 60000,
}
