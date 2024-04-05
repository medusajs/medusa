import { ProductListRes, ProductRes } from "../../types/api-responses"
import { getRequest } from "./common"

async function retrieveProduct(id: string, query?: Record<string, any>) {
  return getRequest<ProductRes>(`/admin/products/${id}`, query)
}

async function listProducts(query?: Record<string, any>) {
  return getRequest<ProductListRes>(`/admin/products`, query)
}

export const products = {
  retrieve: retrieveProduct,
  list: listProducts,
}
