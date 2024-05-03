import format from "date-fns/format"

export function formatDate(date: string | Date) {
  const value = new Date(date)
  value.setMinutes(value.getMinutes() - value.getTimezoneOffset())

  const hour12 = Intl.DateTimeFormat().resolvedOptions().hour12
  const timestampFormat = hour12 ? "dd MMM yyyy hh:MM a" : "dd MMM yyyy HH:MM"

  return format(value, timestampFormat)
}
