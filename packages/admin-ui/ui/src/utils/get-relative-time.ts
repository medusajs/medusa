import RelativeTimeFormatUnit = Intl.RelativeTimeFormatUnit

const units: [RelativeTimeFormatUnit, string, number][] = [
  ["day", "d", 86400000],
  ["hour", "h", 3600000],
  ["minute", "m", 60000],
];

const getRelativeTime = (dates: { from: Date | string; to: Date | string }) => {
  const elapsed = new Date(dates.to).getTime() - new Date(dates.from).getTime()

  for (const [unit, displayedUnit, amount] of units) {
    if (Math.abs(elapsed) >= amount || unit === "minute") {
      const isLessThan1Min = Math.abs(elapsed) <= amount && unit === "minute"
      const suffix = elapsed <= 0 ? "ago" : ""
      const prefix = elapsed > 0 ? "in" : ""
      const indicator = Math.abs(elapsed) < 1 ? "<" : ""
      const timeToShow = Math.max(
        1,
        Math.abs(Math.round(elapsed / amount))
      )

      return {
        raw: elapsed,
        rtf: `
          ${indicator}${prefix ? prefix + " " : ""}
          ${(isLessThan1Min ? "< " : "")} 
          ${timeToShow}${displayedUnit} 
          ${suffix}
        `
      };
    }
  }

  return { raw: 0, rtf: "" }
};

export default getRelativeTime
