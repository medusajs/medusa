module.exports = {
  transform: {
    "^.+\\.[jt]s?$": ["@swc/jest"],
  },
  modulePathIgnorePatterns: ["__fixtures__", "dist", "node_modules"],
  testEnvironment: `node`,
  moduleFileExtensions: [`js`, `ts`],
  setupFilesAfterEnv: ["<rootDir>/setupTests.js"],
}
