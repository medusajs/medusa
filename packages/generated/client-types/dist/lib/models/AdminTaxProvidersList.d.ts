import type { TaxProvider } from "./TaxProvider";
/**
 * The list of tax providers in a store.
 */
export interface AdminTaxProvidersList {
    /**
     * An array of tax providers details.
     */
    tax_providers: Array<TaxProvider>;
}
