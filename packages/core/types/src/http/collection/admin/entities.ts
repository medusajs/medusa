import { BaseCollection } from "../common"
import { AdminTranslation } from "../../translations"

export interface AdminCollection extends BaseCollection {
  /**
   * The collection's translations.
   */
  translations?: AdminTranslation[] | null
}
