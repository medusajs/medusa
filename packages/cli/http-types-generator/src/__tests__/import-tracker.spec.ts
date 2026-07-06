import { ImportTracker } from "../core/import-tracker"

describe("ImportTracker", () => {
  it("initializes with all flags set to false", () => {
    const tracker = new ImportTracker()
    expect(tracker.needsFindParams).toBe(false)
    expect(tracker.needsSelectParams).toBe(false)
    expect(tracker.needsBaseFilterable).toBe(false)
    expect(tracker.needsOperatorMap).toBe(false)
  })

  it("allows mutation of individual flags", () => {
    const tracker = new ImportTracker()
    tracker.needsFindParams = true
    expect(tracker.needsFindParams).toBe(true)
    expect(tracker.needsSelectParams).toBe(false)
  })

  it("each instance is independent", () => {
    const t1 = new ImportTracker()
    const t2 = new ImportTracker()
    t1.needsOperatorMap = true
    expect(t2.needsOperatorMap).toBe(false)
  })
})
