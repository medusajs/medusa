import { DeleteResponse, PaginatedResponse } from "../../common"
import { AdminProductTag } from "./entities"

export interface AdminProductTagResponse {
  /**
   * The tag's details.
   */
  product_tag: AdminProductTag
}

export interface AdminProductTagListResponse extends PaginatedResponse<{
  /**
   * The list of product tags.
   */
  product_tags: AdminProductTag[]
}> {}

export interface AdminProductTagDeleteResponse extends DeleteResponse<"product_tag"> {}
