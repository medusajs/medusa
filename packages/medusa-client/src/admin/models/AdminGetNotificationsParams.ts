/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type AdminGetNotificationsParams = {
  /**
   * The number of notifications to skip before starting to collect the notifications set
   */
  offset?: number;
  /**
   * The number of notifications to return
   */
  limit?: number;
  /**
   * Comma separated fields to include in the result set
   */
  fields?: string;
  /**
   * Comma separated fields to populate
   */
  expand?: string;
  /**
   * The name of the event that the notification was sent for.
   */
  eventName?: string;
  /**
   * The type of resource that the Notification refers to.
   */
  resourceType?: string;
  /**
   * The ID of the resource that the Notification refers to.
   */
  resourceId?: string;
  /**
   * The address that the Notification was sent to. This will usually be an email address, but represent other addresses such as a chat bot user id
   */
  to?: string;
  /**
   * A boolean indicating whether the result set should include resent notifications or not
   */
  includeResends?: string;
};

