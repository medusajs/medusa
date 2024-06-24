module.exports = {
  transform: {
    "^.+\\.[jt]s$": [
      "@swc/jest",
      {
        jsc: {
          parser: { syntax: "typescript", decorators: true },
          transform: { decoratorMetadata: true },
        },
      },
    ],
  },
  testEnvironment: `node`,
  moduleFileExtensions: [`js`, `ts`],
}
