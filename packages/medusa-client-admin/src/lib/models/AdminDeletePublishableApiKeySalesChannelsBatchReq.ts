/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type AdminDeletePublishableApiKeySalesChannelsBatchReq = {
  /**
   * The IDs of the sales channels to delete from the publishable api key
   */
  sales_channel_ids: Array<{
    /**
     * The ID of the sales channel
     */
    id: string;
  }>;
};

