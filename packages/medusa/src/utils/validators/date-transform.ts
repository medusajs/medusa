export const transformDate = ({ value }): Date =>
  !isNaN(Date.parse(value)) ? new Date(value) : new Date(Number(value) * 1000)
