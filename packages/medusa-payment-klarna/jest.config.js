module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+\\.[jt]s?$": `../../jest-transformer.js`,
  },
  setupFilesAfterEnv: ["./setupTests.js"],
}
