/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { User } from "./User"

/**
 * Notes are elements which we can use in association with different resources to allow users to describe additional information in relation to these.
 */
export interface Note {
  /**
   * The note's ID
   */
  id: string
  /**
   * The type of resource that the Note refers to.
   */
  resource_type: string
  /**
   * The ID of the resource that the Note refers to.
   */
  resource_id: string
  /**
   * The contents of the note.
   */
  value: string
  /**
   * The ID of the author (user)
   */
  author_id: string | null
  /**
   * Available if the relation `author` is expanded.
   */
  author?: User | null
  /**
   * The date with timezone at which the resource was created.
   */
  created_at: string
  /**
   * The date with timezone at which the resource was updated.
   */
  updated_at: string
  /**
   * The date with timezone at which the resource was deleted.
   */
  deleted_at: string | null
  /**
   * An optional key-value map with additional details
   */
  metadata: Record<string, any> | null
}
