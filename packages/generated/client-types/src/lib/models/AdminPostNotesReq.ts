/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminPostNotesReq {
  /**
   * The ID of the resource which the Note relates to.
   */
  resource_id: string
  /**
   * The type of resource which the Note relates to.
   */
  resource_type: string
  /**
   * The content of the Note to create.
   */
  value: string
}
