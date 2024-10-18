import { BaseCollectionListParams } from "../common"

export interface StoreCollectionFilters
  extends Omit<BaseCollectionListParams, "id"> {
}
