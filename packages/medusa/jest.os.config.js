module.exports = {
  globals: {
    "ts-jest": {
      tsConfig: "tsconfig.spec.json",
      isolatedModules: false,
    },
  },
  transform: {
    "^.+\\.[jt]s?$": "ts-jest",
  },
  testMatch: ["**/*.os.spec.js", "**/*.os.spec.ts"],
  modulePathIgnorePatterns: ["__fixtures__"],
  testEnvironment: `node`,
  moduleFileExtensions: [`js`, `jsx`, `ts`, `tsx`, `json`],
  setupFilesAfterEnv: ["<rootDir>/setupTests.js"],
}
