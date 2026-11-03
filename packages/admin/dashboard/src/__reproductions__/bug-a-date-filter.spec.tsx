// @vitest-environment jsdom
import { describe, expect, it } from "vitest"
import { isDateComparisonOperator } from "../../../../design-system/ui/src/blocks/data-table/utils/is-date-comparison-operator"

/**
 * Reproduction test for Bug A: Custom date selection disappears / filter becomes un-reopenable.
 *
 * Issue reported:
 * Select Created at -> Custom -> Pick starting date (e.g. Oct 1, 2026).
 * Observe whether the URL briefly contains a value such as o_created_at={"$gte":"2026-10-01..."}
 * and then changes to o_created_at={}.
 * Observe whether the selected date disappears, the editor closes, or the filter becomes impossible to reopen.
 */
describe("Bug A Reproduction — Custom date filter state, serialization and popover behavior", () => {
  it("demonstrates that isDateComparisonOperator({}) returns false for empty object", () => {
    // When a filter param has an empty object {}
    const emptyFilter = {}
    const isDateOp = isDateComparisonOperator(emptyFilter)
    console.log("isDateComparisonOperator({}):", isDateOp) // false
    expect(isDateOp).toBe(false)
  })

  it("demonstrates that an empty filter object {} causes hasValue to be false and removes Popover.Trigger", () => {
    // In packages/design-system/ui/src/blocks/data-table/components/data-table-filter.tsx:59-73:
    // const hasValue = () => {
    //   if (isDateComparisonOperator(filter)) return !!(filter.$gte || filter.$lte || ...)
    //   if (typeof filter === "object" && filter !== null) {
    //     const keys = Object.keys(filter)
    //     return keys.length > 0 && ...
    //   }
    //   return true
    // }
    const filter = {}
    const hasValue = (() => {
      if (filter === null || filter === undefined) return false
      if (isDateComparisonOperator(filter)) {
        return !!((filter as any).$gte || (filter as any).$lte)
      }
      if (typeof filter === "object" && filter !== null) {
        const keys = Object.keys(filter)
        return keys.length > 0 && (filter as any)[keys[0]] !== null && (filter as any)[keys[0]] !== undefined
      }
      return true
    })()

    console.log("hasValue for filter={}:", hasValue) // false
    expect(hasValue).toBe(false)

    // When hasValue is false and isNew is false (after initial filter addition):
    // In data-table-filter.tsx:204-245:
    // {!hasValue && isNew && <Popover.Anchor />}
    // {hasValue && (<Popover.Trigger>...</Popover.Trigger>)}
    // RESULT: Neither Popover.Anchor nor Popover.Trigger is rendered!
    // The filter chip only renders the label in a plain <div>, rendering it impossible to reopen!
    const isNew = false
    const rendersAnchor = !hasValue && isNew
    const rendersTrigger = hasValue

    console.log("Renders Popover.Anchor?", rendersAnchor) // false
    console.log("Renders Popover.Trigger?", rendersTrigger) // false

    expect(rendersAnchor).toBe(false)
    expect(rendersTrigger).toBe(false)
  })

  it("demonstrates the date serialization behavior when DatePicker triggers onCustomValueChange with null/undefined", () => {
    // In data-table-filter.tsx:433-444:
    // const onCustomValueChange = (input: "$gte" | "$lte", value: Date | null) => {
    //   const newCurrentValue = { ...currentValue }
    //   newCurrentValue[input] = value ? value.toISOString() : undefined
    //   ...
    // }
    const currentValue: { $gte?: string; $lte?: string } = {
      $gte: "2026-10-01T18:30:00.000Z",
    }

    // If starting date is cleared or if DatePicker provides null:
    const newCurrentValue = { ...currentValue }
    newCurrentValue["$gte"] = undefined

    // Serializing to JSON (which is what setSearchParams in data-table.tsx does):
    const serialized = JSON.stringify(newCurrentValue)
    console.log("Serialized value when date is undefined:", serialized)
    
    // JSON.stringify drops undefined properties, resulting in "{}"!
    expect(serialized).toBe("{}")

    // When parsed back from the URL by JSON.parse("{}"):
    const parsedFromUrl = JSON.parse(serialized)
    expect(parsedFromUrl).toEqual({})
    expect(isDateComparisonOperator(parsedFromUrl)).toBe(false)
  })
})
