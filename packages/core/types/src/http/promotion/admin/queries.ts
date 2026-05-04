import { BaseFilterable, OperatorMap } from "../../../dal"
import {
  ApplicationMethodTargetTypeValues,
  ApplicationMethodTypeValues,
  PromotionTypeValues,
} from "../../../promotion"
import { FindParams, SelectParams } from "../../common"

export interface AdminGetPromotionParams extends SelectParams {}

export interface AdminGetPromotionsParams
  extends FindParams,
    BaseFilterable<AdminGetPromotionsParams> {
  /**
   * Search for a promotion by its searchable
   */
  q?: string
  /**
   * Filter by promotion code.
   */
  code?: string | string[] | OperatorMap<string>
  /**
   * Filter by promotion ID.
   */
  id?: string[] | string | OperatorMap<string>
  /**
   * Filter by campaign ID to retrieve promotions by campaign.
   */
  campaign_id?: string | string[]
  /**
   * Filter by the promotion's application method.
   */
  application_method?: {
    /**
     * Filter by the promotion's application method currency code.
     */
    currency_code?: string | string[]
  }
  /**
   * Filter by the promotion's created date.
   */
  created_at?: OperatorMap<string>
  /**
   * Filter by the promotion's updated date.
   */
  updated_at?: OperatorMap<string>
  /**
   * Filter by the promotion's deleted date.
   */
  deleted_at?: OperatorMap<string>
  /**
   * An array of filters to apply on the entity, where each item in the array is joined with an "and" condition.
   */
  $and?: AdminGetPromotionsParams[]
  /**
   * An array of filters to apply on the entity, where each item in the array is joined with an "or" condition.
   */
  $or?: AdminGetPromotionsParams[]
}

export interface AdminGetPromotionRuleParams {
  /**
   * The type of promotion to retrieve the attributes for.
   */
  promotion_type?: PromotionTypeValues
  /**
   * The type of application method to retrieve the attributes for.
   */
  application_method_type?: ApplicationMethodTypeValues
  /**
   * The target type of application method to retrieve the attributes for.
   */
  application_method_target_type?: ApplicationMethodTargetTypeValues
}

export interface AdminGetPromotionRuleTypeParams extends SelectParams {
  /**
   * The type of promotion to retrieve the attributes for.
   */
  promotion_type?: PromotionTypeValues
  /**
   * The type of application method to retrieve the attributes for.
   */
  application_method_type?: ApplicationMethodTypeValues
  /**
   * The target type of application method to retrieve the attributes for.
   */
  application_method_target_type?: ApplicationMethodTargetTypeValues
}

export interface AdminGetPromotionsRuleValueParams extends FindParams {
  /**
   * Search for a rule value by its searchable
   */
  q?: string
  /**
   * Filter by rule value.
   */
  value?: string | string[]
  /**
   * The target type of application method to retrieve the attributes for.
   */
  application_method_target_type?: ApplicationMethodTargetTypeValues
}
