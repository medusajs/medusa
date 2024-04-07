import {
  ProductDeleteRes,
  ProductListRes,
  ProductRes,
} from "../../types/api-responses"
import { deleteRequest, getRequest, postRequest } from "./common"

async function retrieveProduct(id: string, query?: Record<string, any>) {
  return getRequest<ProductRes>(`/admin/products/${id}`, query)
}

async function createProduct(payload: any) {
  return postRequest<ProductRes>(`/admin/products`, payload)
}

async function listProducts(query?: Record<string, any>) {
  return getRequest<ProductListRes>(`/admin/products`, query)
}

async function updateProduct(id: string, payload: any) {
  return postRequest<ProductRes>(`/admin/products/${id}`, payload)
}

async function deleteProduct(id: string) {
  return deleteRequest<ProductDeleteRes>(`/admin/products/${id}`)
}

async function retrieveVariant(
  productId: string,
  variantId: string,
  query?: Record<string, any>
) {
  return getRequest<any>(
    `/admin/products/${productId}/variants/${variantId}`,
    query
  )
}

async function listVariants(productId: string, query?: Record<string, any>) {
  return getRequest<any>(`/admin/products/${productId}/variants`, query)
}

async function deleteVariant(productId: string, variantId: string) {
  return deleteRequest<any>(
    `/admin/products/${productId}/variants/${variantId}`
  )
}

export const products = {
  retrieve: retrieveProduct,
  list: listProducts,
  create: createProduct,
  update: updateProduct,
  delete: deleteProduct,
  retrieveVariant,
  listVariants,
  deleteVariant,
}
