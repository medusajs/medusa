import { describe, expect, it } from "vitest"
import { toVisualArrowKey } from "../visual-arrow-key"

describe("toVisualArrowKey", () => {
  it("leaves the horizontal arrows alone in ltr", () => {
    expect(toVisualArrowKey("ArrowLeft", "ltr")).toBe("ArrowLeft")
    expect(toVisualArrowKey("ArrowRight", "ltr")).toBe("ArrowRight")
  })

  it("leaves them alone when the direction is not known yet", () => {
    // useDocumentDirection returns undefined until the dir attribute is read,
    // and an unset direction must behave as ltr rather than swap.
    expect(toVisualArrowKey("ArrowLeft", undefined)).toBe("ArrowLeft")
    expect(toVisualArrowKey("ArrowRight")).toBe("ArrowRight")
  })

  it("exchanges the horizontal arrows in rtl", () => {
    expect(toVisualArrowKey("ArrowLeft", "rtl")).toBe("ArrowRight")
    expect(toVisualArrowKey("ArrowRight", "rtl")).toBe("ArrowLeft")
  })

  it("leaves the vertical arrows alone in rtl", () => {
    expect(toVisualArrowKey("ArrowUp", "rtl")).toBe("ArrowUp")
    expect(toVisualArrowKey("ArrowDown", "rtl")).toBe("ArrowDown")
  })

  it("leaves every other key alone in rtl", () => {
    for (const key of ["Tab", "Enter", "Escape", " ", "z", "Home", "End"]) {
      expect(toVisualArrowKey(key, "rtl")).toBe(key)
    }
  })

  it("is its own inverse in rtl, so a round trip is a no-op", () => {
    for (const key of ["ArrowLeft", "ArrowRight", "ArrowUp", "Tab"]) {
      expect(toVisualArrowKey(toVisualArrowKey(key, "rtl"), "rtl")).toBe(key)
    }
  })
})
