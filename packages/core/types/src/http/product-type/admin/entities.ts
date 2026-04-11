import { AdminTranslation } from "../../translations"
import { BaseProductType } from "../common"

export interface AdminProductType extends BaseProductType {
  /**
   * The product type's translations.
   */
  translations?: AdminTranslation[] | null
}
