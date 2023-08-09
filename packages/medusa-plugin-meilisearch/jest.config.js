module.exports = {
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.spec.json",
      isolatedModules: process.env.ISOLATED_MODULES,
    },
  },
  transform: {
    "^.+\\.[jt]s?$": "ts-jest",
  },
  testEnvironment: `node`,
  moduleFileExtensions: [`js`, `jsx`, `ts`, `tsx`, `json`],
}
