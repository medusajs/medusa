export function trimZeros(value: string) {
  const [whole, fraction] = value.split(".")

  if (fraction) {
    const decimal = fraction.replace(/0+$/, "")

    if (!decimal) {
      return whole
    }

    return `${whole}.${decimal}`
  }

  return whole
}
