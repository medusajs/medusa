import { FindConfig } from "../common"
import { IModuleService } from "../modules-sdk"
import { Context } from "../shared-context"
import { FilterableNoteProps, NoteDTO } from "./common"
import { CreateNoteDTO } from "./mutations"

/**
 * The main service interface for the Note Module.
 */
export interface INoteModuleService extends IModuleService {
  /**
   * This method creates notes.
   *
   * @param {CreateNoteDTO[]} data - The notes to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<NoteDTO[]>} The created notes.
   *
   * @example
   * const notes = await noteModuleService.createNotes([{
   *   resource_type: "order",
   *   resource_id: "order_123",
   *   value: "Called customer",
   *   author_id: "user_123"
   * }])
   */
  createNotes(
    data: CreateNoteDTO[],
    sharedContext?: Context
  ): Promise<NoteDTO[]>

  /**
   * This method creates a note.
   *
   * @param {CreateNoteDTO} data - The note to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<NoteDTO>} The created note.
   *
   * @example
   * const note = await noteModuleService.createNotes({
   *   resource_type: "order",
   *   resource_id: "order_123",
   *   value: "Called customer",
   *   author_id: "user_123"
   * })
   */
  createNotes(data: CreateNoteDTO, sharedContext?: Context): Promise<NoteDTO>

  /**
   * This method retrieves a note by its ID.
   *
   * @param {string} id - The ID of the note.
   * @param {FindConfig<NoteDTO>} config - The configurations determining how the note is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a note.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<NoteDTO>} The retrieved note.
   *
   * @example
   * const note = await noteModuleService.retrieveNote("note_123")
   */
  retrieveNote(
    id: string,
    config?: FindConfig<NoteDTO>,
    sharedContext?: Context
  ): Promise<NoteDTO>

  /**
   * This method retrieves a paginated list of notes based on optional filters and configuration.
   *
   * @param {FilterableNoteProps} filters - The filters to apply on the retrieved notes.
   * @param {FindConfig<NoteDTO>} config - The configurations determining how the notes are retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a note.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<NoteDTO[]>} The list of notes.
   *
   * @example
   * const notes = await noteModuleService.listNotes({
   *   resource_type: "order",
   *   resource_id: ["order_123"],
   * })
   */
  listNotes(
    filters?: FilterableNoteProps,
    config?: FindConfig<NoteDTO>,
    sharedContext?: Context
  ): Promise<NoteDTO[]>

  /**
   * This method retrieves a paginated list of notes along with the total count of available notes satisfying the provided filters.
   *
   * @param {FilterableNoteProps} filters - The filters to apply on the retrieved notes.
   * @param {FindConfig<NoteDTO>} config - The configurations determining how the notes are retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a note.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<[NoteDTO[], number]>} The list of notes along with their total count.
   *
   * @example
   * const [notes, count] = await noteModuleService.listAndCountNotes({
   *   resource_type: "order",
   *   resource_id: ["order_123"],
   * })
   */
  listAndCountNotes(
    filters?: FilterableNoteProps,
    config?: FindConfig<NoteDTO>,
    sharedContext?: Context
  ): Promise<[NoteDTO[], number]>

  /**
   * This method deletes notes by their IDs.
   *
   * @param {string[]} ids - The IDs of the notes.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the notes are deleted successfully.
   *
   * @example
   * await noteModuleService.deleteNotes(["note_123"])
   */
  deleteNotes(ids: string[], sharedContext?: Context): Promise<void>

  /**
   * This method deletes a note by its ID.
   *
   * @param {string} id - The ID of the note.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the note is deleted successfully.
   *
   * @example
   * await noteModuleService.deleteNotes("note_123")
   */
  deleteNotes(id: string, sharedContext?: Context): Promise<void>
}
