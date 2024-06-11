import { HttpTypes } from "@medusajs/types"
import { getRequest } from "./common"

async function listProductTypes(query?: Record<string, any>) {
  return getRequest<{ product_types: HttpTypes.AdminProductType[] }>(
    `/admin/product-types`,
    query
  )
}

async function retrieveProductType(id: string, query?: Record<string, any>) {
  return getRequest<{ product_type: HttpTypes.AdminProductType }>(
    `/admin/product-types/${id}`,
    query
  )
}

export const productTypes = {
  list: listProductTypes,
  retrieve: retrieveProductType,
}
