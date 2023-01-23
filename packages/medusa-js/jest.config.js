module.exports = {
  globals: {
    "ts-jest": {
      diagnostics: false,
      isolatedModules: true,
    },
  },
  transform: {
    ".(ts|tsx)$": require.resolve("ts-jest/dist/"),
  },
  testEnvironment: "jsdom",
}
