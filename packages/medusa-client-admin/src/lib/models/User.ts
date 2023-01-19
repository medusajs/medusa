/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Represents a User who can manage store settings.
 */
export type User = {
  /**
   * The user's ID
   */
  id?: string;
  /**
   * The email of the User
   */
  email: string;
  /**
   * The first name of the User
   */
  first_name?: string;
  /**
   * The last name of the User
   */
  last_name?: string;
  /**
   * An API token associated with the user.
   */
  api_token?: string;
  /**
   * The date with timezone at which the resource was created.
   */
  created_at?: string;
  /**
   * The date with timezone at which the resource was updated.
   */
  updated_at?: string;
  /**
   * The date with timezone at which the resource was deleted.
   */
  deleted_at?: string;
  /**
   * An optional key-value map with additional details
   */
  metadata?: Record<string, any>;
};

