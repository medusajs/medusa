module.exports = {
  transform: {
    "^.+\\.[jt]s?$": [
      "ts-jest",
      {
        tsConfig: "tsconfig.spec.json",
        isolatedModules: true,
      },
    ],
  },
  testEnvironment: `node`,
  moduleFileExtensions: [`js`, `ts`],
}
