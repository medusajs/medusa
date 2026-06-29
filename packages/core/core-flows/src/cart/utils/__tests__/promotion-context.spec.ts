import { getTimeContext } from "../promotion-context"

// 2024-01-01 is a Monday (UTC). 2023-12-31 is a Sunday.
describe("getTimeContext", () => {
  it("computes day-of-week and minutes in UTC", () => {
    const result = getTimeContext(new Date("2024-01-01T13:30:00Z"), "UTC")
    expect(result).toEqual({
      current_day_of_week: 1, // Monday
      current_minutes: 13 * 60 + 30, // 810
    })
  })

  it("shifts wall-clock time for a behind-UTC timezone", () => {
    // UTC-5 in January
    const result = getTimeContext(
      new Date("2024-01-01T13:30:00Z"),
      "America/New_York"
    )
    expect(result).toEqual({
      current_day_of_week: 1, // still Monday 08:30
      current_minutes: 8 * 60 + 30, // 510
    })
  })

  it("rolls back to the previous day when the timezone crosses midnight", () => {
    // 02:30 UTC -> 21:30 previous day in New York (Sunday)
    const result = getTimeContext(
      new Date("2024-01-01T02:30:00Z"),
      "America/New_York"
    )
    expect(result).toEqual({
      current_day_of_week: 0, // Sunday
      current_minutes: 21 * 60 + 30, // 1290
    })
  })

  it("rolls forward to the next day for an ahead-of-UTC timezone", () => {
    // 23:30 UTC -> 00:30 next day in Bratislava (Tuesday)
    const result = getTimeContext(
      new Date("2024-01-01T23:30:00Z"),
      "Europe/Bratislava"
    )
    expect(result).toEqual({
      current_day_of_week: 2, // Tuesday
      current_minutes: 30,
    })
  })

  it("falls back to UTC for an invalid timezone", () => {
    const result = getTimeContext(new Date("2024-01-01T13:30:00Z"), "Not/AZone")
    expect(result).toEqual({
      current_day_of_week: 1,
      current_minutes: 810,
    })
  })
})
