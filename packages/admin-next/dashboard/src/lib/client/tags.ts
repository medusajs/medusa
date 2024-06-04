import { getRequest } from "./common"

async function listProductTags(query?: Record<string, any>) {
  return getRequest<any>(`/admin/product_tags`, query)
}

async function retrieveProductTag(id: string, query?: Record<string, any>) {
  return getRequest<any>(`/admin/product_tags/${id}`, query)
}

export const tags = {
  list: listProductTags,
  retrieve: retrieveProductTag,
}
