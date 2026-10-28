import { CalendarDate, CalendarDateTime } from "@internationalized/date"

import { updateCalendarDate, updateCalendarDateFromDate } from "./calendar"

describe("updateCalendarDate", () => {
  it("preserves the previous object when the date is unchanged", () => {
    const previous = new CalendarDate(2026, 10, 1)

    expect(updateCalendarDate(previous, new Date(2026, 9, 1))).toBe(previous)
  })

  it.each([
    [new CalendarDate(2026, 10, 1), new Date(2026, 10, 3), "2026-11-03"],
    [new CalendarDate(2026, 12, 31), new Date(2027, 0, 1), "2027-01-01"],
    [new CalendarDate(2024, 1, 31), new Date(2024, 1, 29), "2024-02-29"],
  ])("updates %s to the incoming date", (previous, incoming, expected) => {
    const original = previous.toString()

    const result = updateCalendarDate(previous, incoming)

    expect(result.toString()).toBe(expected)
    expect(result).not.toBe(previous)
    expect(previous.toString()).toBe(original)
  })

  it.each([null, undefined])(
    "creates a date when the previous value is %s",
    (previous) => {
      const result = updateCalendarDate(previous, new Date(2026, 10, 3))

      expect(result).toEqual(new CalendarDate(2026, 11, 3))
    }
  )
})

describe("updateCalendarDateFromDate", () => {
  it.each(["hour", "minute", "second"] as const)(
    "preserves the previous object when the %s value is unchanged",
    (granularity) => {
      const previous = new CalendarDateTime(2026, 10, 1, 9, 10, 11, 12)

      expect(
        updateCalendarDateFromDate(
          previous,
          new Date(2026, 9, 1, 9, 10, 11, 12),
          granularity
        )
      ).toBe(previous)
    }
  )

  it.each(["hour", "minute", "second"] as const)(
    "updates every date and time field with %s granularity",
    (granularity) => {
      const previous = new CalendarDateTime(2026, 10, 1, 9, 10, 11, 12)
      const incoming = new Date(2027, 1, 3, 14, 15, 16, 17)

      const result = updateCalendarDateFromDate(previous, incoming, granularity)

      expect(result).toEqual(new CalendarDateTime(2027, 2, 3, 14, 15, 16, 17))
      expect(result).not.toBe(previous)
      expect(previous).toEqual(new CalendarDateTime(2026, 10, 1, 9, 10, 11, 12))
    }
  )

  it("updates the time when the date stays the same", () => {
    const previous = new CalendarDateTime(2026, 10, 1, 9, 10)

    const result = updateCalendarDateFromDate(
      previous,
      new Date(2026, 9, 1, 14, 15),
      "minute"
    )

    expect(result).toEqual(new CalendarDateTime(2026, 10, 1, 14, 15))
  })

  it.each([null, undefined])(
    "creates a date and time when the previous value is %s",
    (previous) => {
      const result = updateCalendarDateFromDate(
        previous,
        new Date(2026, 10, 3, 14, 15, 16, 17),
        "second"
      )

      expect(result).toEqual(new CalendarDateTime(2026, 11, 3, 14, 15, 16, 17))
    }
  )

  it("updates a date without time granularity", () => {
    const result = updateCalendarDateFromDate(
      new CalendarDate(2026, 10, 1),
      new Date(2027, 1, 3)
    )

    expect(result).toEqual(new CalendarDate(2027, 2, 3))
  })
})
