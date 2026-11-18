import { BaseFilterable } from "../../../dal"
import { SelectParams } from "../../common"
import { BaseProductTypeListParams } from "../common"

export interface StoreProductTypeListParams
  extends
    BaseProductTypeListParams,
    BaseFilterable<StoreProductTypeListParams> {}

export interface StoreProductTypeParams extends SelectParams {}
