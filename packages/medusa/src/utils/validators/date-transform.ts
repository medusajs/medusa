export const transformDate = ({ value }): Date => {
  return !isNaN(Date.parse(value))
    ? new Date(value)
    : new Date(Number(value) * 1000)
}

export const transformOptionalDate = (input) =>
  !input.value && !Number.isInteger(input.value)
    ? input.value
    : transformDate(input)
