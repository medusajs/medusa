import { BaseProductTag } from "../common"
import { AdminTranslation } from "../../translation"

export interface AdminProductTag extends BaseProductTag {
  /**
   * The tag's translations.
   */
  translations?: AdminTranslation[] | null
}
