/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminPublishableApiKeyDeleteRes {
  /**
   * The ID of the deleted PublishableApiKey.
   */
  id: string
  /**
   * The type of the object that was deleted.
   */
  object: string
  /**
   * Whether the PublishableApiKeys was deleted.
   */
  deleted: boolean
}
