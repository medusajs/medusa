import {
  AdminProductCategoryListResponse,
  AdminProductCategoryResponse,
} from "@medusajs/types"
import { getRequest } from "./common"

async function listProductCategories(query?: Record<string, any>) {
  return getRequest<AdminProductCategoryListResponse>(
    `/admin/product-categories`,
    query
  )
}

async function retrieveProductCategory(
  id: string,
  query?: Record<string, any>
) {
  return getRequest<AdminProductCategoryResponse>(
    `/admin/product-categories/${id}`,
    query
  )
}

export const categories = {
  list: listProductCategories,
  retrieve: retrieveProductCategory,
}
