import { BaseFilterable, OperatorMap } from "../../dal"
import { CreateCampaignDTO } from "../mutations"
import {
  ApplicationMethodDTO,
  CreateApplicationMethodDTO,
  UpdateApplicationMethodDTO,
} from "./application-method"
import { CampaignDTO, FilterableCampaignProps } from "./campaign"
import { CreatePromotionRuleDTO, PromotionRuleDTO } from "./promotion-rule"

/**
 * The promotion's possible types.
 */
export type PromotionTypeValues = "standard" | "buyget"

/**
 * The promotion's possible types.
 */
export type PromotionStatusValues = "draft" | "active" | "inactive"

/**
 * The promotion's possible rule types.
 */
export type RuleTypeValues = "rules" | "buy-rules" | "target-rules"

/**
 * The promotion details.
 */
export interface PromotionDTO {
  /**
   * The ID of the promotion.
   */
  id: string

  /**
   * The code of the promotion.
   */
  code?: string

  /**
   * The type of the promotion:
   *
   * - `standard` indicates that a promotion is a standard one applied with conditions.
   * - `buyget` indicates that a promotion is a "Buy X get Y" promotion.
   *
   */
  type?: PromotionTypeValues

  /**
   * The status of the promotion:
   *
   * - `active` promotion is available for user to consume
   * - `inactive` promotion is no longer available to the user
   * - `draft` promotion is currently being prepared
   */
  status?: PromotionStatusValues

  /**
   * Whether the promotion is applied automatically.
   */
  is_automatic?: boolean

  /**
   * Whether the promotion is tax inclusive.
   */
  is_tax_inclusive?: boolean

  /**
   * The maximum number of times this promotion can be used across all orders.
   */
  limit?: number | null

  /**
   * The number of times this promotion has been used in completed orders.
   */
  used?: number

  /**
   * The associated application method.
   */
  application_method?: ApplicationMethodDTO

  /**
   * The rules of the promotion.
   */
  rules?: PromotionRuleDTO[]

  /**
   * The associated campaign.
   */
  campaign_id?: string | null

  /**
   * The associated campaign.
   */
  campaign?: CampaignDTO
}

/**
 * The promotion to be created.
 */
export interface CreatePromotionDTO {
  /**
   * The code of the promotion.
   */
  code: string

  /**
   * The type of the promotion:
   *
   * - `standard` indicates that a promotion is a standard one applied with conditions.
   * - `buyget` indicates that a promotion is a "Buy X get Y" promotion.
   *
   */
  type: PromotionTypeValues

  /**
   * The status of the promotion:
   *
   * - `draft` indicates that a promotion is currently being prepared
   * - `active` indicates that a promotion is active
   * - `inactive` indicates that a promotion is no longer active
   */
  status: PromotionStatusValues

  /**
   * Whether the promotion is applied automatically.
   */
  is_automatic?: boolean

  /**
   * Whether the promotion is tax inclusive.
   */
  is_tax_inclusive?: boolean

  /**
   * The maximum number of times this promotion can be used.
   */
  limit?: number | null

  /**
   * The associated application method.
   */
  application_method: CreateApplicationMethodDTO

  /**
   * The rules of the promotion.
   */
  rules?: CreatePromotionRuleDTO[]

  /**
   * The associated campaign.
   */
  campaign?: CreateCampaignDTO

  /**
   * The associated campaign's ID.
   */
  campaign_id?: string
}

/**
 * The attributes to update in the promotion.
 */
export interface UpdatePromotionDTO {
  /**
   * The ID of the promotion.
   */
  id: string

  /**
   * Whether the promotion is applied automatically.
   */
  is_automatic?: boolean

  /**
   * The code of the promotion.
   */
  code?: string

  /**
   * The type of the promotion.
   */
  type?: PromotionTypeValues

  /**
   * Whether the promotion is tax inclusive.
   */
  is_tax_inclusive?: boolean

  /**
   * The maximum number of times this promotion can be used.
   */
  limit?: number | null

  /**
   * The status of the promotion:
   *
   * - `draft` indicates that a promotion is currently being prepared
   * - `active` indicates that a promotion is active
   * - `inactive` indicates that a promotion is no longer active
   */
  status?: PromotionStatusValues

  /**
   * The associated application method.
   */
  application_method?: Omit<UpdateApplicationMethodDTO, "id">

  /**
   * The associated campaign's ID.
   */
  campaign_id?: string | null
}

/**
 * The filters to apply on the retrieved promotions.
 */
export interface FilterablePromotionProps
  extends BaseFilterable<FilterablePromotionProps> {
  /**
   * The IDs to filter the promotions by.
   */
  q?: string

  /**
   * The IDs to filter the promotions by.
   */
  id?: string | string[]

  /**
   * Filter promotions by their code.
   */
  code?: string | string[] | OperatorMap<string>

  /**
   * Filter promotions by the ID of their associated campaign budget.
   */
  budget_id?: string[] | OperatorMap<string>

  /**
   * Filter promotions by whether they're applied automatically.
   */
  is_automatic?: boolean

  /**
   * Filter promotions by their type.
   */
  type?: PromotionTypeValues[]

  /**
   * Filter promotions by their status.
   */
  status?: PromotionStatusValues[]

  /**
   * Filter promotions by their campaign
   */
  campaign?: FilterableCampaignProps
}
