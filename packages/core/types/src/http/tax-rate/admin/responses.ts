import {
  DeleteResponse,
  DeleteResponseWithParent,
  PaginatedResponse,
} from "../../common"
import { AdminTaxRate } from "./entities"

export interface AdminTaxRateResponse {
  tax_rate: AdminTaxRate
}

export type AdminTaxRateListResponse = PaginatedResponse<{
  tax_rates: AdminTaxRate[]
}>

export interface AdminTaxRateDeleteResponse
  extends DeleteResponse<"tax_rate"> {}

export type AdminTaxRateRuleDeleteResponse = DeleteResponseWithParent<
  "tax_rate_rule",
  AdminTaxRate
>
