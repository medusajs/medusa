import { BaseFilterable, OperatorMap } from "../../dal"
import { CreateCampaignDTO } from "../mutations"
import {
  ApplicationMethodDTO,
  CreateApplicationMethodDTO,
  UpdateApplicationMethodDTO,
} from "./application-method"
import { CampaignDTO } from "./campaign"
import { CreatePromotionRuleDTO, PromotionRuleDTO } from "./promotion-rule"

/**
 * The promotion's possible types.
 */
export type PromotionTypeValues = "standard" | "buyget"

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
   * Whether the promotion is applied automatically.
   */
  is_automatic?: boolean

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
   * Whether the promotion is applied automatically.
   */
  is_automatic?: boolean

  /**
   * The associated application method.
   */
  application_method?: CreateApplicationMethodDTO

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
   * The associated application method.
   */
  application_method?: UpdateApplicationMethodDTO

  /**
   * The associated campaign's ID.
   */
  campaign_id?: string
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
}
