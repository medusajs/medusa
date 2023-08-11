/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { User } from "./User"

/**
 * A Note is an element that can be used in association with different resources to allow admin users to describe additional information. For example, they can be used to add additional information about orders.
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
   * The ID of the user that created the note.
   */
  author_id: string | null
  /**
   * The details of the user that created the note.
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
