/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminGetGiftCardsParams {
  /**
   * The number of gift cards to skip when retrieving the gift cards.
   */
  offset?: number
  /**
   * Limit the number of gift cards returned.
   */
  limit?: number
  /**
   * a term to search gift cards' code or display ID
   */
  q?: string
  /**
   * A gift card field to sort-order the retrieved gift cards by.
   */
  order?: string
}
