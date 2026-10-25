import { FindConfig } from "../common"
import { RestoreReturn, SoftDeleteReturn } from "../dal"
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

  /**
   * This method soft deletes notes by their IDs.
   *
   * @param {string[]} ids - The IDs of the notes.
   * @param {SoftDeleteReturn<TReturnableLinkableKeys>} config - An object that is used to specify an entity's related entities that should be soft-deleted when the main entity is soft-deleted.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void | Record<string, string[]>>} An object that includes the IDs of related records that were also soft deleted, such as the ID of the associated items.
   * The object's keys are the ID attribute names of the note entity's relations, and its value is an array of strings, each being the ID of a record associated
   * with the note through this relation.
   *
   * If there are no related records, the promise resolves to `void`.
   *
   * @example
   * await noteModuleService.softDeleteNotes(["note_123"])
   */
  softDeleteNotes<TReturnableLinkableKeys extends string = string>(
    ids: string[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>

  /**
   * This method soft deletes a note by its ID.
   *
   * @param {string} id - The ID of the note.
   * @param {SoftDeleteReturn<TReturnableLinkableKeys>} config - An object that is used to specify an entity's related entities that should be soft-deleted when the main entity is soft-deleted.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void | Record<string, string[]>>} An object that includes the IDs of related records that were also soft deleted, such as the ID of the associated items.
   * The object's keys are the ID attribute names of the note entity's relations, and its value is an array of strings, each being the ID of a record associated
   * with the note through this relation.
   *
   * If there are no related records, the promise resolves to `void`.
   *
   * @example
   * await noteModuleService.softDeleteNotes("note_123")
   */
  softDeleteNotes<TReturnableLinkableKeys extends string = string>(
    id: string,
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>

  /**
   * This method restores soft deleted notes by their IDs.
   *
   * @param {string[]} ids - The IDs of the notes.
   * @param {RestoreReturn<TReturnableLinkableKeys>} config - Configurations determining which relations to restore along with each of the notes. You can pass to its `returnLinkableKeys`
   * property any of the note's relation attribute names.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void | Record<string, string[]>>} An object that includes the IDs of related records that were restored.
   * The object's keys are the ID attribute names of the note entity's relations,
   * and its value is an array of strings, each being the ID of the record associated with the note through this relation.
   *
   * If there are no related records restored, the promise resolves to `void`.
   *
   * @example
   * await noteModuleService.restoreNotes(["note_123"])
   */
  restoreNotes<TReturnableLinkableKeys extends string = string>(
    ids: string[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>

  /**
   * This method restores a soft deleted note by its ID.
   *
   * @param {string} id - The ID of the note.
   * @param {RestoreReturn<TReturnableLinkableKeys>} config - Configurations determining which relations to restore along with the note. You can pass to its `returnLinkableKeys`
   * property any of the note's relation attribute names.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void | Record<string, string[]>>} An object that includes the IDs of related records that were restored.
   * The object's keys are the ID attribute names of the note entity's relations,
   * and its value is an array of strings, each being the ID of the record associated with the note through this relation.
   *
   * If there are no related records restored, the promise resolves to `void`.
   *
   * @example
   * await noteModuleService.restoreNotes("note_123")
   */
  restoreNotes<TReturnableLinkableKeys extends string = string>(
    id: string,
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>
}
