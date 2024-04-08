import {
  ProductCollectionListRes,
  ProductCollectionRes,
} from "../../types/api-responses"
import { getRequest } from "./common"

async function listProductTags(query?: Record<string, any>) {
  return getRequest<ProductCollectionListRes>(`/admin/tags`, query)
}

async function retrieveProductTag(id: string, query?: Record<string, any>) {
  return getRequest<ProductCollectionRes>(`/admin/tags/${id}`, query)
}

export const tags = {
  list: listProductTags,
  retrieve: retrieveProductTag,
}
