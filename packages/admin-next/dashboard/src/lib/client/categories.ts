import {
  ProductCollectionListRes,
  ProductCollectionRes,
} from "../../types/api-responses"
import { getRequest } from "./common"

async function listProductCategories(query?: Record<string, any>) {
  return getRequest<ProductCollectionListRes>(`/admin/categories`, query)
}

async function retrieveProductCategory(
  id: string,
  query?: Record<string, any>
) {
  return getRequest<ProductCollectionRes>(`/admin/categories/${id}`, query)
}

export const categories = {
  list: listProductCategories,
  retrieve: retrieveProductCategory,
}
