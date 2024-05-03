module.exports = {
  transform: {
    "^.+\\.[jt]s?$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.json",
        isolatedModules: false,
      },
    ],
  },
  testEnvironment: `node`,
  moduleFileExtensions: [`js`, `ts`],
  testTimeout: 100000,
}
