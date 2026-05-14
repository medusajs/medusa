import { BaseCustomerAddressFilters, BaseCustomerFilters } from "../common"
import { FindParams, SelectParams } from "../../common"

export interface StoreCustomerFilters extends BaseCustomerFilters {}
export interface StoreCustomerAddressFilters
  extends Omit<BaseCustomerAddressFilters, "company" | "province">,
    FindParams {}

export interface StoreGetCustomerParams extends SelectParams {}

export interface StoreGetCustomerAddressParams extends SelectParams {}
