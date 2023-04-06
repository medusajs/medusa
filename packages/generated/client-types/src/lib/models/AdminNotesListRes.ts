/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { Note } from "./Note"

export interface AdminNotesListRes {
  notes: Array<Note>
  /**
   * The total number of items available
   */
  count: number
  /**
   * The number of items skipped before these items
   */
  offset: number
  /**
   * The number of items per page
   */
  limit: number
}
