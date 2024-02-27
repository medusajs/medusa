/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { Note } from "./Note"

/**
 * The list of notes with pagination fields.
 */
export interface AdminNotesListRes {
  /**
   * An array of notes
   */
  notes: Array<Note>
  /**
   * The total number of items available
   */
  count: number
  /**
   * The number of notes skipped when retrieving the notes.
   */
  offset: number
  /**
   * The number of items per page
   */
  limit: number
}
