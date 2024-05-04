/**
 * The details of the payment sessions to authorize.
 */
export interface StorePostPaymentCollectionsBatchSessionsAuthorizeReq {
    /**
     * List of Payment Session IDs to authorize.
     */
    session_ids: Array<string>;
}
