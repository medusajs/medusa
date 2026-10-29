import {
  DeleteResponse,
  DeleteResponseWithParent,
  PaginatedResponse,
} from "../../common"
import { AdminTaxRate } from "./entities"

export interface AdminTaxRateResponse {
  /**
   * The tax rate's details.
   */
  tax_rate: AdminTaxRate
}

export type AdminTaxRateListResponse = PaginatedResponse<{
  /**
   * The list of tax rates.
   */
  tax_rates: AdminTaxRate[]
}>

export interface AdminTaxRateDeleteResponse extends DeleteResponse<"tax_rate"> {}

export type AdminTaxRateRuleDeleteResponse = DeleteResponseWithParent<
  "tax_rate_rule",
  AdminTaxRate
>
