module.exports = {
  // [...]
  globals: {
    "ts-jest": {
      diagnostics: false,
      isolatedModules: true,
    },
  },
  transform: {
    ".(ts|tsx)$": require.resolve("ts-jest/dist/"),
  },
  setupFilesAfterEnv: ["./jest.setup.js"],
}
