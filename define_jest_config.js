module.exports = function defineJestConfig(config) {
  return {
    transform: {
      "^.+\\.[jt]s$": [
        "@swc/jest",
        {
          jsc: {
            parser: {
              syntax: "typescript",
              decorators: true,
            },
            transform: {
              useDefineForClassFields: false,
              legacyDecorator: true,
              decoratorMetadata: true,
            },
            target: "ES2021",
          },
          sourceMaps: "inline",
        },
      ],
    },
    modulePathIgnorePatterns: [`dist/`],
    testPathIgnorePatterns: [`dist/`, `node_modules/`],
    transformIgnorePatterns: ["node_modules/"],
    testEnvironment: `node`,
    moduleFileExtensions: [`js`, `ts`],
    ...config,
  }
}
