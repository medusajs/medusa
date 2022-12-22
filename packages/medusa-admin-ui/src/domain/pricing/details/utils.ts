export const mergeExistingWithDefault = (
  variantPrices: any[] = [],
  defaultPrices
) => {
  return defaultPrices.map((pr) => {
    const price = variantPrices.find(
      (vpr) => vpr?.currency_code === pr.currency_code
    )
    return price || pr
  })
}
