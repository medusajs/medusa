import { BaseCollectionListParams, BaseCollectionParams } from "../common"

export interface StoreCollectionListParams extends Omit<
  BaseCollectionListParams,
  "deleted_at"
> {}

export interface StoreCollectionParams extends BaseCollectionParams {}
