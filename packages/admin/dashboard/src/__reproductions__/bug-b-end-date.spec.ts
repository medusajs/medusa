import { describe, expect, it } from "vitest"

/**
 * Reproduction test for Bug B: End date excludes the selected day.
 *
 * Issue reported:
 * When setting both starting and ending dates to October 2, 2026,
 * $lte is incorrectly set to the beginning of the selected day (midnight 00:00:00)
 * instead of its end (23:59:59.999 local time).
 * As a result, matching orders created later on that day are excluded.
 */
describe("Bug B Reproduction — End date excludes the selected day", () => {
  it("demonstrates the bug in onCustomValueChange where $lte is set to midnight instead of end of day", () => {
    // Simulate what DatePicker passes when user selects October 2, 2026 in the local timezone
    // Local date: October 2, 2026 00:00:00.000
    const selectedDate = new Date(2026, 9, 2, 0, 0, 0, 0) // Month is 0-indexed: 9 = October

    // This is the current implementation in @medusajs/ui (packages/design-system/ui/src/blocks/data-table/components/data-table-filter.tsx:433-444):
    // const onCustomValueChange = (input: "$gte" | "$lte", value: Date | null) => {
    //   const newCurrentValue = { ...currentValue }
    //   newCurrentValue[input] = value ? value.toISOString() : undefined
    //   ...
    // }
    const actualCurrentValue: { $gte?: string; $lte?: string } = {}
    
    // User sets start date to October 2, 2026
    actualCurrentValue["$gte"] = selectedDate.toISOString()

    // User sets end date to October 2, 2026
    actualCurrentValue["$lte"] = selectedDate.toISOString()

    console.log("ACTUAL serialized filter:", actualCurrentValue)

    // Expected local-day boundaries:
    // Start: 00:00:00.000 local time
    const expectedStartDate = new Date(2026, 9, 2, 0, 0, 0, 0)
    // End: 23:59:59.999 local time
    const expectedEndDate = new Date(2026, 9, 2, 23, 59, 59, 999)

    console.log("EXPECTED $gte:", expectedStartDate.toISOString())
    console.log("EXPECTED $lte:", expectedEndDate.toISOString())

    // BUG VERIFICATION:
    // actualCurrentValue.$lte equals midnight (00:00:00.000), NOT end-of-day (23:59:59.999)
    expect(actualCurrentValue.$lte).toBe(selectedDate.toISOString())
    expect(actualCurrentValue.$lte).not.toBe(expectedEndDate.toISOString())

    // Simulate an order created at 10:30 AM on October 2, 2026 (local time)
    const orderCreatedAt = new Date(2026, 9, 2, 10, 30, 0, 0)

    // Query filter check: orderCreatedAt >= $gte && orderCreatedAt <= $lte
    const matchesActualFilter =
      orderCreatedAt >= new Date(actualCurrentValue.$gte!) &&
      orderCreatedAt <= new Date(actualCurrentValue.$lte!)

    const matchesExpectedFilter =
      orderCreatedAt >= expectedStartDate &&
      orderCreatedAt <= expectedEndDate

    console.log("Order created at 10:30 AM on Oct 2, 2026:")
    console.log("Matches actual filter?", matchesActualFilter) // FALSE! Excluded!
    console.log("Matches expected filter?", matchesExpectedFilter) // TRUE! Included!

    // The order from Oct 2 is INCORRECTLY EXCLUDED by the actual filter!
    expect(matchesActualFilter).toBe(false)
    expect(matchesExpectedFilter).toBe(true)
  })

  it("demonstrates the bug in a multi-day range (e.g. Oct 1 to Oct 2, 2026)", () => {
    const startDate = new Date(2026, 9, 1, 0, 0, 0, 0)
    const endDate = new Date(2026, 9, 2, 0, 0, 0, 0)

    const actualFilter = {
      $gte: startDate.toISOString(),
      $lte: endDate.toISOString(),
    }

    // An order placed on Oct 2 at 2:00 PM
    const orderOnLastDay = new Date(2026, 9, 2, 14, 0, 0, 0)

    const isIncludedInActual =
      orderOnLastDay >= new Date(actualFilter.$gte) &&
      orderOnLastDay <= new Date(actualFilter.$lte)

    console.log("Multi-day range Oct 1 - Oct 2:")
    console.log("Order at 2 PM on Oct 2 included in actual filter?", isIncludedInActual)

    // The last day's afternoon orders are EXCLUDED!
    expect(isIncludedInActual).toBe(false)
  })
})
