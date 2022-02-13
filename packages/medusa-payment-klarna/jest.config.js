module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+\\.[jt]s?$": `../../jest-transformer.js`,
  },
  setupFilesAfterEnv: ["<rootDit>/setupTests.js"],
}
