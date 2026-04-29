import { StoreLocale } from "./entities";

export interface StoreLocaleListResponse {
  /**
   * The list of locales.
   */
  locales: StoreLocale[]
}