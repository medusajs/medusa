import { NoteResourceType } from "./common"

/**
 * @interface
 *
 * The note to be created.
 */
export interface CreateNoteDTO {
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
   * The ID of the author creating the note.
   */
  author_id: string
}
