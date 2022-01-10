module.exports = {
  // [...]
  globals: {
    "ts-jest": {
      diagnostics: false,
      isolatedModules: true,
    },
  },
  setupFilesAfterEnv: ["./jest.setup.js"],
}
