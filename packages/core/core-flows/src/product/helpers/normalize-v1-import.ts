import { ProductTypes, SalesChannelTypes } from "@medusajs/types"
import { MedusaError } from "@medusajs/utils"

const basicFieldsToOmit = [
  // Fields with slightly different naming
  "Product MID Code",
  "Product HS Code",
  "Variant MID Code",
  "Variant HS Code",
  "Variant EAN",
  "Variant UPC",
  "Variant SKU",

  // Fields no longer present in v2
  "Variant Inventory Quantity",
  "Product Profile Name",
  "Product Profile Type",

  // Fields that are remapped
  "Product Collection Handle",
  "Product Collection Title",
  "Product Type",
  "Product Tags",
]

// This is primarily to have backwards compatibility with v1 exports
// Although it also makes v2 import template more dynamic
// it's better to not expose eg. "Product MID Code" as an available public API  so we can remove this code at some point.
export const normalizeV1Products = (
  rawProducts: object[],
  supportingData: {
    productTypes: ProductTypes.ProductTypeDTO[]
    productCollections: ProductTypes.ProductCollectionDTO[]
    salesChannels: SalesChannelTypes.SalesChannelDTO[]
  }
): object[] => {
  const productTypesMap = new Map(
    supportingData.productTypes.map((pt) => [pt.value, pt.id])
  )
  const productCollectionsMap = new Map(
    supportingData.productCollections.map((pc) => [pc.handle, pc.id])
  )
  const salesChannelsMap = new Map(
    supportingData.salesChannels.map((sc) => [sc.name, sc.id])
  )

  return rawProducts.map((product) => {
    let finalRes = {
      ...product,
      "Product Mid Code":
        product["Product MID Code"] ?? product["Product Mid Code"],
      "Product Hs Code":
        product["Product HS Code"] ?? product["Product Hs Code"],
      "Variant MID Code":
        product["Variant MID Code"] ?? product["Variant Mid Code"],
      "Variant Hs Code":
        product["Variant HS Code"] ?? product["Variant Hs Code"],
      "Variant Ean": product["Variant EAN"] ?? product["Variant Ean"],
      "Variant Upc": product["Variant UPC"] ?? product["Variant Upc"],
      "Variant Sku": product["Variant SKU"] ?? product["Variant Sku"],
    }

    basicFieldsToOmit.forEach((field) => {
      delete finalRes[field]
    })

    // You can either pass "Product Tags" or "Product Tag <IDX>", but not both
    const tags = product["Product Tags"]?.toString()?.split(",")
    if (tags) {
      finalRes = {
        ...finalRes,
        ...tags.reduce((agg, tag, i) => {
          agg[`Product Tag ${i + 1}`] = tag
          return agg
        }, {}),
      }
    }

    const productTypeValue = product["Product Type"]
    if (productTypeValue) {
      if (!productTypesMap.has(productTypeValue)) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Product type with value '${productTypeValue}' does not exist`
        )
      }

      finalRes["Product Type Id"] = productTypesMap.get(productTypeValue)
    }

    const productCollectionHandle = product["Product Collection Handle"]
    if (productCollectionHandle) {
      if (!productCollectionsMap.has(productCollectionHandle)) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Product collection with handle '${productCollectionHandle}' does not exist`
        )
      }

      finalRes["Product Collection Id"] = productCollectionsMap.get(
        productCollectionHandle
      )
    }

    // We have to iterate over all fields for the ones that are index-based
    Object.entries(finalRes).forEach(([key, value]) => {
      if (key.startsWith("Price")) {
        delete finalRes[key]
        finalRes[`Variant ${key}`] = value
      }

      if (key.startsWith("Option")) {
        delete finalRes[key]
        finalRes[`Variant ${key}`] = value
      }

      if (key.startsWith("Image")) {
        delete finalRes[key]
        finalRes[`Product Image ${key.split(" ")[1]}`] = value
      }

      if (key.startsWith("Sales Channel")) {
        delete finalRes[key]
        if (key.endsWith("Id")) {
          if (!salesChannelsMap.has(value)) {
            throw new MedusaError(
              MedusaError.Types.INVALID_DATA,
              `Sales channel with name '${value}' does not exist`
            )
          }

          finalRes[`Product Sales Channel ${key.split(" ")[2]}`] =
            salesChannelsMap.get(value)
        }
      }

      // Note: Product categories from v1 are not imported to v2
    })

    return finalRes
  })
}
