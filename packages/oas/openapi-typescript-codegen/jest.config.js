module.exports = {
  globals: {
    "ts-jest": {
      tsConfig: "tsconfig.json",
      isolatedModules: process.env.ISOLATED_MODULES,
    },
  },
  transform: {
    "^.+\\.[jt]s?$": "@swc/jest",
  },
  testEnvironment: `node`,
  moduleFileExtensions: [`js`, `ts`],
  testTimeout: 30000,
}
