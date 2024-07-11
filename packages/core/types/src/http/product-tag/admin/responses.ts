import { DeleteResponse, PaginatedResponse } from "../../common"
import { AdminProductTag } from "./entities"

export interface AdminProductTagResponse {
  product_tag: AdminProductTag
}

export interface AdminProductTagListResponse
  extends PaginatedResponse<{
    product_tags: AdminProductTag[]
  }> {}

export interface AdminProductTagDeleteResponse
  extends DeleteResponse<"product_tag"> {}
