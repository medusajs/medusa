export function calculatePriceTaxInclusiveTaxAmount(
  price: number,
  taxRate: number
): number {
  return (taxRate * price) / (1 + taxRate)
}
