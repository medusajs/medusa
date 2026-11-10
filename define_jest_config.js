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

function getTransformIgnorePatterns() {
  try {
    const {
      buildTransformIgnorePatterns,
      ESM_ONLY_DEPENDENCIES,
    } = require("@medusajs/test-utils/dist/jest-preset")
    return buildTransformIgnorePatterns([
      ...REPO_ESM_DEPENDENCIES,
      ...ESM_ONLY_DEPENDENCIES,
    ])
  } catch (error) {
    if (error.code !== "MODULE_NOT_FOUND") {
      throw error
    }
    // `@medusajs/test-utils` isn't built yet, e.g. on a fresh checkout.
    return [`node_modules/(?!(${REPO_ESM_DEPENDENCIES.join("|")})/)`]
  }
}

const transformIgnorePatterns = getTransformIgnorePatterns()

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
    testEnvironment: `node`,
    moduleFileExtensions: [`js`, `ts`],
    ...config,
  }
}
