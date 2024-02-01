/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminPublishableApiKeyDeleteRes {
  /**
   * The ID of the deleted publishable API key.
   */
  id: string
  /**
   * The type of the object that was deleted.
   */
  object: string
  /**
   * Whether the publishable API key was deleted.
   */
  deleted: boolean
}
