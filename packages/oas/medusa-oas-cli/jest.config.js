module.exports = {
  transform: {
    "^.+\\.[jt]s?$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.json",
        isolatedModules: process.env.ISOLATED_MODULES,
      },
    ],
  },
  testEnvironment: `node`,
  moduleFileExtensions: [`js`, `ts`],
  testTimeout: 100000,
}
