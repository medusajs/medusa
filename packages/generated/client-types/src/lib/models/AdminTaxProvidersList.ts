/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { TaxProvider } from "./TaxProvider"

export interface AdminTaxProvidersList {
  /**
   * An array of tax providers details.
   */
  tax_providers: Array<TaxProvider>
}
