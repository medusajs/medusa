module.exports = {
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.spec.json",
      isolatedModules: false,
    },
  },
  transform: {
    "^.+\\.[jt]s?$": "ts-jest",
  },
  testEnvironment: `node`,
  moduleNameMapper: {
    "^axios$": "axios/dist/node/axios.cjs",
  },
  moduleFileExtensions: [`js`, `jsx`, `ts`, `tsx`, `json`],
}
