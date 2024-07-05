/**
 * Helper function to cast a z.union([z.number(), z.string()]) to a number
 */
export const castNumber = (number: number | string) => {
  return typeof number === "string" ? Number(number.replace(",", ".")) : number
}
