module.exports = {
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.spec.json",
      isolatedModules: false,
    },
  },
  transform: {
    "^.+\\.[jt]s?$": "@swc/jest",
  },
  testEnvironment: `node`,
  moduleFileExtensions: [`js`, `ts`, `json`],
  modulePathIgnorePatterns: ["dist", "node_modules"],
}
