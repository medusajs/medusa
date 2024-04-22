import { ProductTypeListRes, ProductTypeRes } from "../../types/api-responses"
import { getRequest } from "./common"

async function listProductTypes(query?: Record<string, any>) {
  return getRequest<ProductTypeListRes>(`/admin/product-types`, query)
}

async function retrieveProductType(id: string, query?: Record<string, any>) {
  return getRequest<ProductTypeRes>(`/admin/product-types/${id}`, query)
}

export const productTypes = {
  list: listProductTypes,
  retrieve: retrieveProductType,
}
