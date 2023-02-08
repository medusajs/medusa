/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Images holds a reference to a URL at which the image file can be found.
 */
export type Image = {
  /**
   * The image's ID
   */
  id: string;
  /**
   * The URL at which the image file can be found.
   */
  url: string;
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
  /**
   * An optional key-value map with additional details
   */
  metadata: Record<string, any> | null;
};

