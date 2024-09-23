module.exports = {
  transform: {
    "^.+\\.[jt]s$": [
      "@swc/jest",
      {
        jsc: {
          parser: { syntax: "typescript", decorators: true },
          transform: { decoratorMetadata: true },
          target: "ES2021",
        },
      },
    ],
  },
  testPathIgnorePatterns: [`dist/`, `node_modules/`],
  testEnvironment: `node`,
  moduleFileExtensions: [`js`, `ts`],
}
