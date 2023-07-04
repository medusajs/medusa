/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminGetNotesParams {
  /**
   * The number of notes to get
   */
  limit?: number
  /**
   * The offset at which to get notes
   */
  offset?: number
  /**
   * The ID which the notes belongs to
   */
  resource_id?: string
}
