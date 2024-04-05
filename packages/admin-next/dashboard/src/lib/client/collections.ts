import {
  CreateProductCollectionReq,
  UpdateProductCollectionReq,
} from "../../types/api-payloads"
import {
  ProductCollectionDeleteRes,
  ProductCollectionListRes,
  ProductCollectionRes,
} from "../../types/api-responses"
import { deleteRequest, getRequest, postRequest } from "./common"

async function listProductCollections(query?: Record<string, any>) {
  return getRequest<ProductCollectionListRes>(`/admin/collections`, query)
}

async function retrieveProductCollection(
  id: string,
  query?: Record<string, any>
) {
  return getRequest<ProductCollectionRes>(`/admin/collections/${id}`, query)
}

async function updateProductCollection(
  id: string,
  payload: UpdateProductCollectionReq
) {
  return postRequest<ProductCollectionRes>(`/admin/collections/${id}`, payload)
}

async function createProductCollection(payload: CreateProductCollectionReq) {
  return postRequest<ProductCollectionRes>(`/admin/collections`, payload)
}

async function deleteProductCollection(id: string) {
  return deleteRequest<ProductCollectionDeleteRes>(`/admin/collections/${id}`)
}

export const collections = {
  list: listProductCollections,
  retrieve: retrieveProductCollection,
  update: updateProductCollection,
  create: createProductCollection,
  delete: deleteProductCollection,
}
