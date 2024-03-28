module.exports = {
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json",
      isolatedModules: false,
    },
  },
  transform: {
    "^.+\\.[jt]s?$": "ts-jest",
  },
  testEnvironment: `node`,
  moduleFileExtensions: [`js`, `ts`],
  testTimeout: 30000,
}
