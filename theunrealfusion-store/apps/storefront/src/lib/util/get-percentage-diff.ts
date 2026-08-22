export const getPercentageDiff = (original: number, calculated: number) => {
  const diff = original - calculated
  const decrease = (diff / original) * 100

  return decrease.toFixed()
}
