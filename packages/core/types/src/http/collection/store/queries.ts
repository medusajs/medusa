import { OperatorMap } from "../../../dal";
import { BaseCollectionListParams } from "../common";

export interface StoreCollectionFilters extends Omit<BaseCollectionListParams, "id"> {
  deleted_at?: OperatorMap<string>
}
