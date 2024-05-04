/**
 * The details of the shipping options to associate with the tax rate.
 */
export interface AdminPostTaxRatesTaxRateShippingOptionsReq {
    /**
     * The IDs of the shipping options to associate with this tax rate
     */
    shipping_options: Array<string>;
}
