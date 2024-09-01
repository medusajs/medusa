import { BaseFilterable, OperatorMap } from "../../../dal"
import { FindParams, SelectParams } from "../../common"

export interface AdminCustomerInGroupFilters {
  id?: string | string[]
  email?: string | string[] | OperatorMap<string>
  default_billing_address_id?: string | string[]
  default_shipping_address_id?: string | string[]
  company_name?: string | string[]
  first_name?: string | string[]
  last_name?: string | string[]
  created_by?: string | string[]
  created_at?: OperatorMap<string>
  updated_at?: OperatorMap<string>
  deleted_at?: OperatorMap<string>
}

export interface AdminGetCustomerGroupsParams
  extends FindParams,
    BaseFilterable<AdminGetCustomerGroupsParams> {
  limit?: number
  offset?: number
  q?: string
  id?: string | string[]
  name?: string | string[]
  customers?: string | string[] | AdminCustomerInGroupFilters
  created_by?: string | string[]
  created_at?: OperatorMap<string>
  updated_at?: OperatorMap<string>
  deleted_at?: OperatorMap<string>
  $and?: AdminGetCustomerGroupsParams[]
  $or?: AdminGetCustomerGroupsParams[]
}

export interface AdminGetCustomerGroupParams extends SelectParams {}
