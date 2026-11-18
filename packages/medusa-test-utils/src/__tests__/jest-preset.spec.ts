import { buildTransformIgnorePatterns, jestPreset } from "../jest-preset"

const isIgnored = (patterns: string[], path: string) =>
  new RegExp(patterns.join("|")).test(path)

describe("jest preset", () => {
  it("matches Jest's default transformIgnorePatterns when no package is listed", () => {
    expect(buildTransformIgnorePatterns([])).toEqual([
      "/node_modules/",
      "\\.pnp\\.[^\\/]+$",
    ])
  })

  it("uses the ESM-only dependency list in the preset", () => {
    expect(jestPreset).toEqual({
      testEnvironment: "node",
      transformIgnorePatterns: expect.any(Array),
    })
  })

  describe("with packages to transform", () => {
    const patterns = buildTransformIgnorePatterns([
      "path-to-regexp",
      "@scope/esm-pkg",
      "lodash.esm",
    ])

    it.each([
      "/app/node_modules/path-to-regexp/dist/index.js",
      "/app/node_modules/@scope/esm-pkg/index.js",
      "/app/node_modules/lodash.esm/index.js",
      "/app/node_modules/@medusajs/framework/node_modules/path-to-regexp/dist/index.js",
      "/app/node_modules/.pnpm/path-to-regexp@9.0.0/node_modules/path-to-regexp/dist/index.js",
      "/app/src/api/route.ts",
    ])("transforms %s", (path) => {
      expect(isIgnored(patterns, path)).toBe(false)
    })

    it.each([
      "/app/node_modules/express/index.js",
      "/app/node_modules/path-to-regexp-extra/index.js",
      "/app/node_modules/lodashxesm/index.js",
      "/app/node_modules/path-to-regexp/node_modules/other/index.js",
      "/app/.pnp.cjs",
    ])("ignores %s", (path) => {
      expect(isIgnored(patterns, path)).toBe(true)
    })
  })
})
