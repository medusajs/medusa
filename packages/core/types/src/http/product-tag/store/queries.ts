import { BaseFilterable } from "../../../dal"
import { SelectParams } from "../../common"
import { BaseProductTagListParams } from "../common"

export interface StoreProductTagListParams
  extends BaseProductTagListParams,
    BaseFilterable<StoreProductTagListParams> {}

export interface StoreProductTagParams extends SelectParams {}
