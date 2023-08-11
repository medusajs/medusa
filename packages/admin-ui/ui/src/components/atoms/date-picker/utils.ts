export const range = (start, end) => {
  const range: number[] = []
  for (let i = start; i <= end; i++) {
    range.push(i)
  }
  return range
}

export const getYearRange = (step = 20) =>
  range(new Date().getFullYear() - step, new Date().getFullYear() + step)

export const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]
