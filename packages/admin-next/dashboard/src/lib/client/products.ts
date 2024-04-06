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

export const products = {
  retrieve: retrieveProduct,
  list: listProducts,
  create: createProduct,
  update: updateProduct,
  delete: deleteProduct,
}
