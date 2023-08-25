const PricingImportCSV =
  "data:text/csv;charset=utf-8," +
  `Product Variant ID,SKU,Price EUR,Price NA [USD]
,MEDUSA-SWEAT-SMALL,15,13.5
variant_1234,,15,13.5
`

export function downloadPricingImportCSVTemplate() {
  const encodedUri = encodeURI(PricingImportCSV)
  const link = document.createElement("a")
  link.setAttribute("href", encodedUri)
  link.setAttribute("download", "product-import-template.csv")
  document.body.appendChild(link)

  link.click()
}
