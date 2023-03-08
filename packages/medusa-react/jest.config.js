module.exports = {
  transform: {
    ".(ts|tsx)$": ["ts-jest", { isolatedModules: true, diagnostics: false }],
  },
  setupFilesAfterEnv: ["./jest.setup.js"],
  testEnvironment: "jsdom",
  moduleNameMapper: {
    // Force module uuid and msgpackr to resolve with the CJS entry point, because Jest does not support package.json.exports.
    // See https://github.com/uuidjs/uuid/issues/451
    // Issue is fixed in newer versions of UUID, but since it's a transitive dependency, we need to force it here.
    "^uuid$": "uuid",
    "^msgpackr": "msgpackr",
  },
}
