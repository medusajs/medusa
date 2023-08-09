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
  transformIgnorePatterns: ["/node_modules/(?!(axios)/).*"],
  testEnvironment: `node`,
  moduleFileExtensions: [`js`, `jsx`, `ts`, `tsx`, `json`],
}
