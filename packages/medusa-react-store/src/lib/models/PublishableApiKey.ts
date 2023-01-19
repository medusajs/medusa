/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Publishable API key defines scopes (i.e. resources) that are available within a request.
 */
export type PublishableApiKey = {
  /**
   * The key's ID
   */
  id?: string;
  /**
   * The unique identifier of the user that created the key.
   */
  created_by?: string;
  /**
   * A user object. Available if the relation `created_by_user` is expanded.
   */
  created_by_user?: Record<string, any>;
  /**
   * The date with timezone at which the resource was created.
   */
  created_at?: string;
  /**
   * The unique identifier of the user that revoked the key.
   */
  revoked_by?: string;
  /**
   * A user object. Available if the relation `revoked_by_user` is expanded.
   */
  revoked_by_user?: Record<string, any>;
  /**
   * The date with timezone at which the key was revoked.
   */
  revoked_at?: string;
  /**
   * The date with timezone at which the resource was updated.
   */
  updated_at?: string;
};

