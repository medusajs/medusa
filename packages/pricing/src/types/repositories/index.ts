import {
  Currency,
  MoneyAmount,
  PriceList,
  PriceListRule,
  PriceListRuleValue,
  PriceRule,
  PriceSet,
  PriceSetMoneyAmount,
  PriceSetMoneyAmountRules,
  PriceSetRuleType,
  RuleType,
} from "@models"
import { DAL } from "@medusajs/types"
import { CreateCurrencyDTO, UpdateCurrencyDTO } from "./currency"
import { CreateMoneyAmountDTO, UpdateMoneyAmountDTO } from "./money-amount"
import {
  CreatePriceListRuleValueDTO,
  UpdatePriceListRuleValueDTO,
} from "./price-list-rule-value"
import {
  CreatePriceListRuleDTO,
  UpdatePriceListRuleDTO,
} from "./price-list-rule"
import { CreatePriceListDTO, UpdatePriceListDTO } from "./price-list"
import { CreatePriceRuleDTO, UpdatePriceRuleDTO } from "./price-rule"
import {
  CreatePriceSetMoneyAmountRulesDTO,
  UpdatePriceSetMoneyAmountRulesDTO,
} from "./price-set-money-amount-rules"
import {
  CreatePriceSetMoneyAmountDTO,
  UpdatePriceSetMoneyAmountDTO,
} from "./price-set-money-amount"
import {
  CreatePriceSetRuleTypeDTO,
  UpdatePriceSetRuleTypeDTO,
} from "./price-set-rule-type"
import { CreatePriceSetDTO, UpdatePriceSetDTO } from "./price-set"
import { CreateRuleTypeDTO, UpdateRuleTypeDTO } from "./rule-type"

export * from "./currency"
export * from "./money-amount"
export * from "./price-list-rule-value"
export * from "./price-list-rule"
export * from "./price-list"
export * from "./price-rule"
export * from "./price-set-money-amount-rules"
export * from "./price-set-money-amount"
export * from "./price-set-rule-type"
export * from "./price-set"
export * from "./rule-type"

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ICurrencyRepository<TEntity extends Currency = Currency>
  extends DAL.RepositoryService<
    TEntity,
    {
      create: CreateCurrencyDTO
      update: UpdateCurrencyDTO
    }
  > {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IMoneyAmountRepository<
  TEntity extends MoneyAmount = MoneyAmount
> extends DAL.RepositoryService<
    TEntity,
    {
      create: CreateMoneyAmountDTO
      update: UpdateMoneyAmountDTO
    }
  > {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IPriceListRuleValueRepository<
  TEntity extends PriceListRuleValue = PriceListRuleValue
> extends DAL.RepositoryService<
    TEntity,
    {
      create: CreatePriceListRuleValueDTO
      update: UpdatePriceListRuleValueDTO
    }
  > {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IPriceListRuleRepository<
  TEntity extends PriceListRule = PriceListRule
> extends DAL.RepositoryService<
    TEntity,
    {
      create: CreatePriceListRuleDTO
      update: UpdatePriceListRuleDTO
    }
  > {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IPriceListRepository<TEntity extends PriceList = PriceList>
  extends DAL.RepositoryService<
    TEntity,
    {
      create: CreatePriceListDTO
      update: UpdatePriceListDTO
    }
  > {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IPriceRuleRepository<TEntity extends PriceRule = PriceRule>
  extends DAL.RepositoryService<
    TEntity,
    {
      create: CreatePriceRuleDTO
      update: UpdatePriceRuleDTO
    }
  > {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IPriceSetMoneyAmountRulesRepository<
  TEntity extends PriceSetMoneyAmountRules = PriceSetMoneyAmountRules
> extends DAL.RepositoryService<
    TEntity,
    {
      create: CreatePriceSetMoneyAmountRulesDTO
      update: UpdatePriceSetMoneyAmountRulesDTO
    }
  > {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IPriceSetMoneyAmountRepository<
  TEntity extends PriceSetMoneyAmount = PriceSetMoneyAmount
> extends DAL.RepositoryService<
    TEntity,
    {
      create: CreatePriceSetMoneyAmountDTO
      update: UpdatePriceSetMoneyAmountDTO
    }
  > {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IPriceSetRuleTypeRepository<
  TEntity extends PriceSetRuleType = PriceSetRuleType
> extends DAL.RepositoryService<
    TEntity,
    {
      create: CreatePriceSetRuleTypeDTO
      update: UpdatePriceSetRuleTypeDTO
    }
  > {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IPriceSetRepository<TEntity extends PriceSet = PriceSet>
  extends DAL.RepositoryService<
    TEntity,
    {
      create: CreatePriceSetDTO
      update: UpdatePriceSetDTO
    }
  > {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IRuleTypeRepository<TEntity extends RuleType = RuleType>
  extends DAL.RepositoryService<
    TEntity,
    {
      create: CreateRuleTypeDTO
      update: UpdateRuleTypeDTO
    }
  > {}
