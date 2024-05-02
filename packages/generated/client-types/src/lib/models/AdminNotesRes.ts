/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { Note } from "./Note"

/**
 * The note's details.
 */
export interface AdminNotesRes {
  /**
   * Note details.
   */
  note: Note
}
