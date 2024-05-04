/**
 * The details of the products to remove their associated with the tax rate.
 */
export interface AdminDeleteTaxRatesTaxRateProductsReq {
    /**
     * The IDs of the products to remove their association with this tax rate.
     */
    products: Array<string>;
}
