import {
  ApplicationMethod,
  Campaign,
  CampaignBudget,
  Promotion,
  PromotionRule,
  PromotionRuleValue,
} from "@models"
import { DAL } from "@medusajs/types"
import {
  CreateApplicationMethodDTO,
  UpdateApplicationMethodDTO,
} from "./application-method"
import { CreateCampaignDTO, UpdateCampaignDTO } from "./campaign"
import {
  CreateCampaignBudgetDTO,
  UpdateCampaignBudgetDTO,
} from "./campaign-budget"
import { CreatePromotionDTO, UpdatePromotionDTO } from "./promotion"
import {
  CreatePromotionRuleDTO,
  UpdatePromotionRuleDTO,
} from "./promotion-rule"
import {
  CreatePromotionRuleValueDTO,
  UpdatePromotionRuleValueDTO,
} from "./promotion-rule-value"

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IApplicationMethodRepository<
  TEntity extends ApplicationMethod = ApplicationMethod
> extends DAL.RepositoryService<
    TEntity,
    {
      create: CreateApplicationMethodDTO
      update: UpdateApplicationMethodDTO
    }
  > {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ICampaignRepository<TEntity extends Campaign = Campaign>
  extends DAL.RepositoryService<
    TEntity,
    {
      create: CreateCampaignDTO
      update: UpdateCampaignDTO
    }
  > {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ICampaignBudgetRepository<
  TEntity extends CampaignBudget = CampaignBudget
> extends DAL.RepositoryService<
    TEntity,
    {
      create: CreateCampaignBudgetDTO
      update: UpdateCampaignBudgetDTO
    }
  > {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IPromotionRepository<TEntity extends Promotion = Promotion>
  extends DAL.RepositoryService<
    TEntity,
    {
      create: CreatePromotionDTO
      Update: UpdatePromotionDTO
    }
  > {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IPromotionRuleRepository<
  TEntity extends PromotionRule = PromotionRule
> extends DAL.RepositoryService<
    TEntity,
    {
      create: CreatePromotionRuleDTO
      update: UpdatePromotionRuleDTO
    }
  > {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IPromotionRuleValueRepository<
  TEntity extends PromotionRuleValue = PromotionRuleValue
> extends DAL.RepositoryService<
    TEntity,
    {
      create: CreatePromotionRuleValueDTO
      update: UpdatePromotionRuleValueDTO
    }
  > {}
