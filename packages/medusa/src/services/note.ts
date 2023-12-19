import { FindConfig, Selector } from "../types/common"
import { MedusaError, isDefined } from "medusa-core-utils"

import { CreateNoteInput } from "../types/note"
import { EntityManager } from "typeorm"
import EventBusService from "./event-bus"
import { Note } from "../models"
import { NoteRepository } from "../repositories/note"
import { TransactionBaseService } from "../interfaces"
import { buildQuery } from "../utils"

type InjectedDependencies = {
  manager: EntityManager
  noteRepository: typeof NoteRepository
  eventBusService: EventBusService
}

class NoteService extends TransactionBaseService {
  static readonly Events = {
    CREATED: "note.created",
    UPDATED: "note.updated",
    DELETED: "note.deleted",
  }

  protected readonly noteRepository_: typeof NoteRepository
  protected readonly eventBus_: EventBusService

  constructor({ noteRepository, eventBusService }: InjectedDependencies) {
    // eslint-disable-next-line prefer-rest-params
    super(arguments[0])

    this.noteRepository_ = noteRepository
    this.eventBus_ = eventBusService
  }

  /**
   * Retrieves a specific note.
   * @param noteId - the id of the note to retrieve.
   * @param config - any options needed to query for the result.
   * @return which resolves to the requested note.
   */
  async retrieve(
    noteId: string,
    config: FindConfig<Note> = {}
  ): Promise<Note | never> {
    if (!isDefined(noteId)) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `"noteId" must be defined`
      )
    }

    const noteRepo = this.activeManager_.withRepository(this.noteRepository_)

    const query = buildQuery({ id: noteId }, config)

    const note = await noteRepo.findOne(query)

    if (!note) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Note with id: ${noteId} was not found.`
      )
    }

    return note
  }

  /** Fetches all notes related to the given selector
   * @param selector - the query object for find
   * @param config - the configuration used to find the objects. contains relations, skip, and take.
   * @param config.relations - Which relations to include in the resulting list of Notes.
   * @param config.take - How many Notes to take in the resulting list of Notes.
   * @param config.skip - How many Notes to skip in the resulting list of Notes.
   * @return notes related to the given search.
   */
  async list(
    selector: Selector<Note>,
    config: FindConfig<Note> = {
      skip: 0,
      take: 50,
      relations: [],
    }
  ): Promise<Note[]> {
    const [result] = await this.listAndCount(selector, config)

    return result
  }

  /** Fetches all notes related to the given selector
   * @param selector - the query object for find
   * @param config - the configuration used to find the objects. contains relations, skip, and take.
   * @param config.relations - Which relations to include in the resulting list of Notes.
   * @param config.take - How many Notes to take in the resulting list of Notes.
   * @param config.skip - How many Notes to skip in the resulting list of Notes.
   * @return notes related to the given search.
   */
  async listAndCount(
    selector: Selector<Note>,
    config: FindConfig<Note> = {
      skip: 0,
      take: 50,
      relations: [],
    }
  ): Promise<[Note[], number]> {
    const noteRepo = this.activeManager_.withRepository(this.noteRepository_)

    const query = buildQuery(selector, config)

    return noteRepo.findAndCount(query)
  }

  /**
   * Creates a note associated with a given author
   * @param data - the note to create
   * @param config - any configurations if needed, including meta data
   * @return resolves to the creation result
   */
  async create(
    data: CreateNoteInput,
    config: { metadata: Record<string, unknown> } = { metadata: {} }
  ): Promise<Note> {
    const { metadata } = config

    const { resource_id, resource_type, value, author_id } = data

    return await this.atomicPhase_(async (manager) => {
      const noteRepo = manager.withRepository(this.noteRepository_)

      const toCreate = {
        resource_id,
        resource_type,
        value,
        author_id,
        metadata,
      }

      const note = noteRepo.create(toCreate)
      const result = await noteRepo.save(note)

      await this.eventBus_
        .withTransaction(manager)
        .emit(NoteService.Events.CREATED, { id: result.id })

      return result
    })
  }

  /**
   * Updates a given note with a new value
   * @param noteId - the id of the note to update
   * @param value - the new value
   * @return resolves to the updated element
   */
  async update(noteId: string, value: string): Promise<Note> {
    return await this.atomicPhase_(async (manager) => {
      const noteRepo = manager.withRepository(this.noteRepository_)

      const note = await this.retrieve(noteId)

      note.value = value

      const result = await noteRepo.save(note)

      await this.eventBus_
        .withTransaction(manager)
        .emit(NoteService.Events.UPDATED, { id: result.id })

      return result
    })
  }

  /**
   * Deletes a given note
   * @param noteId - id of the note to delete
   */
  async delete(noteId: string): Promise<void> {
    return await this.atomicPhase_(async (manager) => {
      const noteRepo = manager.withRepository(this.noteRepository_)

      const note = await this.retrieve(noteId)

      await noteRepo.softRemove(note)

      await this.eventBus_
        .withTransaction(manager)
        .emit(NoteService.Events.DELETED, { id: noteId })
    })
  }
}

export default NoteService
