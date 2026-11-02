import { PaginatedResponse } from "../../common"
import { StoreProductTag } from "./entities"

export interface StoreProductTagResponse {
  /**
   * The tag's details.
   */
  product_tag: StoreProductTag
}

export interface StoreProductTagListResponse extends PaginatedResponse<{
  /**
   * The paginated list of tags.
   */
  product_tags: StoreProductTag[]
}> {}
