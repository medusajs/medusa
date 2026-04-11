import { BaseProductTag } from "../common"
import { AdminTranslation } from "../../translations"

export interface AdminProductTag extends BaseProductTag {
  /**
   * The tag's translations.
   */
  translations?: AdminTranslation[] | null
}
