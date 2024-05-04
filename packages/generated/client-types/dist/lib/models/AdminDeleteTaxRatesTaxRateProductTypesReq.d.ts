/**
 * Product types to remove from the tax rates.
 */
export interface AdminDeleteTaxRatesTaxRateProductTypesReq {
    /**
     * The IDs of the product types to remove their association with this tax rate.
     */
    product_types: Array<string>;
}
