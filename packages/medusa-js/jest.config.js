module.exports = {
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.spec.json",
      diagnostics: false,
      isolatedModules: true,
    },
  },
  transform: {
    ".(ts|tsx)$": require.resolve("ts-jest/dist/"),
  },
  testEnvironment: "jsdom",
}
