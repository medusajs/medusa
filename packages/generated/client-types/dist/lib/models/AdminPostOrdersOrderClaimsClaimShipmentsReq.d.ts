export interface AdminPostOrdersOrderClaimsClaimShipmentsReq {
    /**
     * The ID of the Fulfillment.
     */
    fulfillment_id: string;
    /**
     * An array of tracking numbers for the shipment.
     */
    tracking_numbers?: Array<string>;
}
