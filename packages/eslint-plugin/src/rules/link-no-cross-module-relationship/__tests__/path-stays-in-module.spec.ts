import { pathStaysInModule } from "../rule"

// `getModuleRoot` always normalizes the module root to forward slashes. The
// `resolved` argument, however, comes from `path.resolve`, which returns
// backslash-separated paths on Windows. These unit tests pin down the
// separator handling directly, since an end-to-end ESLint RuleTester run on a
// POSIX CI can never reproduce the Windows-only path output.
describe("pathStaysInModule", () => {
  const moduleRoot = "C:/repo/src/modules/widget"

  it("treats a forward-slash path inside the module root as in-module", () => {
    expect(
      pathStaysInModule("C:/repo/src/modules/widget/models/part", moduleRoot)
    ).toBe(true)
  })

  it("treats the module root itself as in-module", () => {
    expect(pathStaysInModule(moduleRoot, moduleRoot)).toBe(true)
  })

  it("flags a forward-slash path outside the module root as cross-module", () => {
    expect(
      pathStaysInModule("C:/repo/src/modules/other/models/part", moduleRoot)
    ).toBe(false)
  })

  // Regression for the Windows false positive: a backslash-separated resolved
  // path that is genuinely inside the module must not be flagged.
  it("treats a backslash (Windows) path inside the module root as in-module", () => {
    expect(
      pathStaysInModule(
        "C:\\repo\\src\\modules\\widget\\models\\part",
        moduleRoot
      )
    ).toBe(true)
  })

  it("still flags a backslash (Windows) path that escapes the module root", () => {
    expect(
      pathStaysInModule(
        "C:\\repo\\src\\modules\\other\\models\\part",
        moduleRoot
      )
    ).toBe(false)
  })

  // A path whose name merely starts with the module root string but is a
  // sibling directory must not be considered in-module.
  it("does not treat a sibling directory sharing the root prefix as in-module", () => {
    expect(
      pathStaysInModule(
        "C:/repo/src/modules/widget-extra/models/part",
        moduleRoot
      )
    ).toBe(false)
  })

  it("returns true when the module root is unknown (null)", () => {
    expect(pathStaysInModule("C:\\anything\\at\\all", null)).toBe(true)
  })
})
