import { FindConfig } from "../common"
import { ModuleJoinerConfig } from "../modules-sdk"
import { Context } from "../shared-context"
import {
  CreateCurrencyDTO,
  CreateMoneyAmountDTO,
  CurrencyDTO,
  FilterableCurrencyProps,
  FilterableMoneyAmountProps,
  MoneyAmountDTO,
  UpdateCurrencyDTO,
  UpdateMoneyAmountDTO,
} from "./common"
import { CreateRuleTypeDTO, RuleTypeDTO, UpdateRuleTypeDTO } from "./price-sets"

export interface IPricingModuleService {
  __joinerConfig(): ModuleJoinerConfig

  retrieve(
     id: string,
    config?: FindConfig<MoneyAmountDTO>,
    sharedContext?: Context
  ): Promise<MoneyAmountDTO>

  list(
    filters?: FilterableMoneyAmountProps,
    config?: FindConfig<MoneyAmountDTO>,
    sharedContext?: Context
  ): Promise<MoneyAmountDTO[]>

  listAndCount(
    filters?: FilterableMoneyAmountProps,
    config?: FindConfig<MoneyAmountDTO>,
    sharedContext?: Context
  ): Promise<[MoneyAmountDTO[], number]>

  create(
    data: CreateMoneyAmountDTO[],
    sharedContext?: Context
  ): Promise<MoneyAmountDTO[]>

  update(
    data: UpdateMoneyAmountDTO[],
    sharedContext?: Context
  ): Promise<MoneyAmountDTO[]>

  delete(ids: string[], sharedContext?: Context): Promise<void>

  retrieveCurrency(
    code: string,
    config?: FindConfig<CurrencyDTO>,
    sharedContext?: Context
  ): Promise<CurrencyDTO>

  listCurrencies(
    filters?: FilterableCurrencyProps,
    config?: FindConfig<CurrencyDTO>,
    sharedContext?: Context
  ): Promise<CurrencyDTO[]>

  listAndCountCurrencies(
    filters?: FilterableCurrencyProps,
    config?: FindConfig<CurrencyDTO>,
    sharedContext?: Context
  ): Promise<[CurrencyDTO[], number]>

  createCurrencies(
    data: CreateCurrencyDTO[],
    sharedContext?: Context
  ): Promise<CurrencyDTO[]>

  updateCurrencies(
    data: UpdateCurrencyDTO[],
    sharedContext?: Context
  ): Promise<CurrencyDTO[]>

  deleteCurrencies(
    currencyCodes: string[],
    sharedContext?: Context
  ): Promise<void>
  
  retrieveRuleType(
    code: string,
    config?: FindConfig<RuleTypeDTO>,
    sharedContext?: Context
  ): Promise<RuleTypeDTO>

  listRuleTypes(
    filters?: FilterableCurrencyProps,
    config?: FindConfig<RuleTypeDTO>,
    sharedContext?: Context
  ): Promise<RuleTypeDTO[]>

  listAndCountRuleTypes(
    filters?: FilterableCurrencyProps,
    config?: FindConfig<RuleTypeDTO>,
    sharedContext?: Context
  ): Promise<[RuleTypeDTO[], number]>

  createRuleTypes(
    data: CreateRuleTypeDTO[],
    sharedContext?: Context
  ): Promise<RuleTypeDTO[]>

  updateRuleTypes(
    data: UpdateRuleTypeDTO[],
    sharedContext?: Context
  ): Promise<RuleTypeDTO[]>

  deleteRuleTypes(
    ruleTypes: string[],
    sharedContext?: Context
  ): Promise<void>
}
