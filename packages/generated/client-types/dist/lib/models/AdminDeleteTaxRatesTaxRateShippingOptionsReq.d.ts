/**
 * The details of the shipping options to remove their associate with the tax rate.
 */
export interface AdminDeleteTaxRatesTaxRateShippingOptionsReq {
    /**
     * The IDs of the shipping options to remove their association with this tax rate.
     */
    shipping_options: Array<string>;
}
