import { BaseFilterable } from "../dal"

/**
 * The type of resource a note is attached to.
 */
export type NoteResourceType = "order" | "customer" | "order_line_item"

/**
 * @interface
 *
 * A note's data.
 */
export interface NoteDTO {
  /**
   * The ID of the note.
   */
  id: string
  /**
   * The type of the resource this note is attached to.
   */
  resource_type: NoteResourceType
  /**
   * The ID of the resource this note is attached to.
   */
  resource_id: string
  /**
   * The content of the note.
   */
  value: string
  /**
   * The ID of the author that created the note.
   */
  author_id: string
  /**
   * The date the note was created.
   */
  created_at: Date
  /**
   * The date the note was updated.
   */
  updated_at: Date
}

/**
 * @interface
 *
 * The filters to apply on the retrieved notes.
 */
export interface FilterableNoteProps extends BaseFilterable<FilterableNoteProps> {
  /**
   * The IDs to filter the notes by.
   */
  id?: string | string[]
  /**
   * Filter the notes by the type of resource they're attached to.
   */
  resource_type?: string | string[]
  /**
   * Filter the notes by the ID of the resource they're attached to.
   */
  resource_id?: string | string[]
}
