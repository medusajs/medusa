const REPO_ESM_DEPENDENCIES = [
  "until-async",
  "msw",
  "rettime",
  "@open-draft/deferred-promise",
  "@faker-js/faker",
  "@mswjs/interceptors",
  "@msw/url",
  "cookie",
  "@open-draft/until",
  "chalk",
  "commander",
  "auto-bind",
  "jose",
  "openid-client",
  "oauth4webapi",
]

function loadTestUtilsPreset() {
  try {
    return require("@medusajs/test-utils/dist/jest-preset")
  } catch (error) {
    if (error.code !== "MODULE_NOT_FOUND") {
      throw error
    }
    // `@medusajs/test-utils` isn't built yet, e.g. on a fresh checkout.
    return null
  }
}

const testUtilsPreset = loadTestUtilsPreset()

const transformIgnorePatterns = testUtilsPreset
  ? testUtilsPreset.buildTransformIgnorePatterns([
      ...REPO_ESM_DEPENDENCIES,
      ...testUtilsPreset.ESM_ONLY_DEPENDENCIES,
    ])
  : [`node_modules/(?!(${REPO_ESM_DEPENDENCIES.join("|")})/)`]

module.exports = function defineJestConfig(config) {
  return {
    transform: {
      "^.+\\.m?[jt]s$": [
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
    testPathIgnorePatterns: [`dist/`, `node_modules/`, `__fixtures__/`, `__mocks__/`],
    transformIgnorePatterns,
    resolver: testUtilsPreset?.jestPreset.resolver,
    testEnvironment: `node`,
    moduleFileExtensions: [`js`, `ts`],
    ...config,
  }
}
