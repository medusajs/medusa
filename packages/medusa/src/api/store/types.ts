import { MedusaStoreRequest } from "@medusajs/framework/http"
import {
  MedusaPricingContext,
  TaxCalculationContext,
} from "@medusajs/framework/types"

export type StoreRequestWithContext<
  Body,
  QueryFields = Record<string, unknown>,
> = MedusaStoreRequest<Body, QueryFields> & {
  pricingContext?: MedusaPricingContext
  taxContext?: {
    taxLineContext?: TaxCalculationContext
    taxInclusivityContext?: {
      automaticTaxes: boolean
    }
  }
}
