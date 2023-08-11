/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

/**
 * A Publishable API key defines scopes that resources are available in. Then, it can be used in request to infer the resources without having to directly pass them. For example, a publishable API key can be associated with one or more sales channels. Then, when the publishable API key is passed in the header of a request, it is inferred what sales channel is being used without having to pass the sales channel as a query or body parameter of the request. Publishable API keys can only be used with sales channels, at the moment.
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
