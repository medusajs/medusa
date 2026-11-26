const defineJestConfig = require("../../../define_jest_config")
module.exports = defineJestConfig({
  transform: {
    "^.+\\.m?[jt]sx?$": [
      "@swc/jest",
      {
        jsc: {
          parser: { syntax: "typescript", tsx: true },
          transform: { react: { runtime: "automatic" } },
          target: "ES2021",
        },
      },
    ],
  },
  moduleFileExtensions: [`js`, `ts`, `tsx`],
  transformIgnorePatterns: [`node_modules/(?!(@tanstack)/)`],
  modulePathIgnorePatterns: [`dist/`, `\\.medusa/`],
  testPathIgnorePatterns: [
    `dist/`,
    `\\.medusa/`,
    `node_modules/`,
    `__fixtures__/`,
    `__mocks__/`,
  ],
})
