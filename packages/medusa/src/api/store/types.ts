import { MedusaStoreRequest } from "@zjedene-medusa/framework/http"
import {
  MedusaPricingContext,
  TaxCalculationContext,
} from "@zjedene-medusa/framework/types"

export type StoreRequestWithContext<
  Body,
  QueryFields = Record<string, unknown>
> = MedusaStoreRequest<Body, QueryFields> & {
  pricingContext?: MedusaPricingContext
  taxContext?: {
    taxLineContext?: TaxCalculationContext
    taxInclusivityContext?: {
      automaticTaxes: boolean
    }
  }
}
