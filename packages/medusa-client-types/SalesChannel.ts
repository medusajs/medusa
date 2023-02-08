/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * A Sales Channel
 */
export type SalesChannel = {
  /**
   * The sales channel's ID
   */
  id: string;
  /**
   * The name of the sales channel.
   */
  name: string;
  /**
   * The description of the sales channel.
   */
  description: string | null;
  /**
   * Specify if the sales channel is enabled or disabled.
   */
  is_disabled: boolean;
  /**
   * The date with timezone at which the resource was created.
   */
  created_at: string;
  /**
   * The date with timezone at which the resource was updated.
   */
  updated_at: string;
  /**
   * The date with timezone at which the resource was deleted.
   */
  deleted_at: string | null;
};

