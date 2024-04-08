import { ProductDeleteRes, ProductListRes } from "../../types/api-responses"
import { deleteRequest, getRequest, postRequest } from "./common"

async function retrieveProduct(id: string, query?: Record<string, any>) {
  return getRequest<any>(`/admin/products/${id}`, query)
}

async function createProduct(payload: any) {
  return postRequest<any>(`/admin/products`, payload)
}

async function listProducts(query?: Record<string, any>) {
  return getRequest<ProductListRes>(`/admin/products`, query)
}

async function updateProduct(id: string, payload: any) {
  return postRequest<any>(`/admin/products/${id}`, payload)
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

async function createVariant(productId: string, payload: any) {
  return postRequest<any>(`/admin/products/${productId}/variants`, payload)
}

async function updateVariant(
  productId: string,
  variantId: string,
  payload: any
) {
  return postRequest<any>(
    `/admin/products/${productId}/variants/${variantId}`,
    payload
  )
}

async function deleteVariant(productId: string, variantId: string) {
  return deleteRequest<any>(
    `/admin/products/${productId}/variants/${variantId}`
  )
}

async function createOption(productId: string, payload: any) {
  return postRequest<any>(`/admin/products/${productId}/options`, payload)
}

async function updateOption(productId: string, optionId: string, payload: any) {
  return postRequest<any>(
    `/admin/products/${productId}/options/${optionId}`,
    payload
  )
}

async function deleteOption(productId: string, optionId: string) {
  return deleteRequest<any>(`/admin/products/${productId}/options/${optionId}`)
}

export const products = {
  retrieve: retrieveProduct,
  list: listProducts,
  create: createProduct,
  update: updateProduct,
  delete: deleteProduct,
  retrieveVariant,
  listVariants,
  createVariant,
  updateVariant,
  deleteVariant,
  createOption,
  updateOption,
  deleteOption,
}
