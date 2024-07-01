import { CalendarDate } from "@internationalized/date"

function getDefaultValue(
  value: Date | null | undefined,
  defaultValue: Date | null | undefined
) {
  if (value) {
    return createCalendarDate(value)
  }

  if (defaultValue) {
    return createCalendarDate(defaultValue)
  }

  return null
}

/**
 * Create a CalendarDate object from a Date object. The month is using a 1-based index in CalendarDate,
 * while Date object uses a 0-based index.
 * @returns The created CalendarDate object.
 */
function createCalendarDate(date: Date) {
  return new CalendarDate(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate()
  )
}

function updateCalendarDate(
  date: CalendarDate | null | undefined,
  value: Date
) {
  if (!date) {
    return createCalendarDate(value)
  }

  date.set({
    day: value.getDate(),
    month: value.getMonth() + 1,
    year: value.getFullYear(),
  })

  return date
}

export { createCalendarDate, getDefaultValue, updateCalendarDate }
