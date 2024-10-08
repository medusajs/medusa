import { CalendarDate, CalendarDateTime } from "@internationalized/date"

import { Granularity } from "@/types"

function getDefaultCalendarDateTime(
  value: Date | null | undefined,
  defaultValue: Date | null | undefined
) {
  if (value) {
    return createCalendarDateTime(value)
  }

  if (defaultValue) {
    return createCalendarDateTime(defaultValue)
  }

  return null
}

function createCalendarDateTime(date: Date) {
  return new CalendarDateTime(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
    date.getMilliseconds()
  )
}

function updateCalendarDateTime(
  date: CalendarDateTime | null | undefined,
  value: Date
) {
  if (!date) {
    return createCalendarDateTime(value)
  }

  date.set({
    day: value.getDate(),
    month: value.getMonth() + 1,
    year: value.getFullYear(),
    hour: value.getHours(),
    minute: value.getMinutes(),
    second: value.getSeconds(),
    millisecond: value.getMilliseconds(),
  })

  return date
}

function getDefaultCalendarDate(
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

const USES_TIME = new Set<Granularity>(["hour", "minute", "second"])

function createCalendarDateFromDate(date: Date, granularity?: Granularity) {
  if (granularity && USES_TIME.has(granularity)) {
    return createCalendarDateTime(date)
  }

  return createCalendarDate(date)
}

function updateCalendarDateFromDate(
  date: CalendarDate | CalendarDateTime | null | undefined,
  value: Date,
  granularity?: Granularity
) {
  if (granularity && USES_TIME.has(granularity)) {
    return updateCalendarDateTime(date as CalendarDateTime, value)
  }

  return updateCalendarDate(date as CalendarDate, value)
}

function getDefaultCalendarDateFromDate(
  value: Date | null | undefined,
  defaultValue: Date | null | undefined,
  granularity?: Granularity
) {
  if (value) {
    return createCalendarDateFromDate(value, granularity)
  }

  if (defaultValue) {
    return createCalendarDateFromDate(defaultValue, granularity)
  }

  return null
}

export {
  createCalendarDate,
  createCalendarDateFromDate,
  getDefaultCalendarDate,
  getDefaultCalendarDateFromDate,
  updateCalendarDate,
  updateCalendarDateFromDate,
}
