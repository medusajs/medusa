module.exports = {
  globals: {
    "ts-jest": {
      tsConfig: "tsconfig.json",
      isolatedModules: process.env.ISOLATED_MODULES,
    },
  },
  transform: {
    "^.+\\.[jt]s?$": "ts-jest",
  },
  testEnvironment: `node`,
  moduleFileExtensions: [`js`, `ts`],
}
