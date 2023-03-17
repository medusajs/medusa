/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

/**
 * Publishable API key defines scopes (i.e. resources) that are available within a request.
 */
export interface PublishableApiKey {
  /**
   * The key's ID
   */
  id: string
  /**
   * The unique identifier of the user that created the key.
   */
  created_by: string | null
  /**
   * The unique identifier of the user that revoked the key.
   */
  revoked_by: string | null
  /**
   * The date with timezone at which the key was revoked.
   */
  revoked_at: string | null
  /**
   * The key's title.
   */
  title: string
  /**
   * The date with timezone at which the resource was created.
   */
  created_at: string
  /**
   * The date with timezone at which the resource was updated.
   */
  updated_at: string
}
