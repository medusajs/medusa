/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

/**
 * The access token details.
 */
export interface StoreBearerAuthRes {
  /**
   * Access token that can be used to send authenticated requests.
   */
  access_token?: string
}
