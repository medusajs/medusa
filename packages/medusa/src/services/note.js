import { MedusaError } from "medusa-core-utils"
import { BaseService } from "medusa-interfaces"
import _ from "lodash"
import { TransactionManager } from "typeorm"

class NoteService extends BaseService {
  static Events = {
    CREATED: "note.created",
    UPDATED: "note.updated",
    DELETED: "note.deleted",
  }

  constructor({ manager, noteRepository, eventBusService, userService }) {
    super()

    /** @private @const {EntityManager} */
    this.manager_ = manager

    /** @private @const {NoteRepository} */
    this.noteRepository_ = noteRepository

    /** @private @const {EventBus} */
    this.eventBus_ = eventBusService
  }

  /**
   * Sets the service's manager to a given transaction manager
   * @param {EntityManager} transactionManager - the manager to use
   * @return {NoteService} a cloned note service
   */
  withTransaction(transactionManager) {
    if (!TransactionManager) {
      return this
    }

    const cloned = new NoteService({
      manager: transactionManager,
      noteRepository: this.noteRepository_,
      eventBus: this.eventBus_,
    })

    cloned.transactionManager_ = transactionManager
    return cloned
  }

  /**
   * Retrieves a specific note.
   * @param {*} id - the id of the note to retrieve.
   * @param {*} config - any options needed to query for the result.
   * @returns {Promise} which resolves to the requested note.
   */
  async retrieve(id, config = {}) {
    const noteRepo = this.manager_.getCustomRepository(this.noteRepository_)

    const validatedId = this.validateId_(id)
    const query = this.buildQuery_({ id: validatedId }, config)

    const note = await noteRepo.findOne(query)

    if (!note) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Note with id: ${id} was not found.`
      )
    }

    return note
  }

  /** Fetches all notes related to the given selector
   * @param {Object} selector - the query object for find
   * @param {Object} config - the configuration used to find the objects. contains relations, skip, and take.
   * @return {Promise<Note[]>} notes related to the given search.
   */
  async list(
    selector,
    config = {
      skip: 0,
      take: 50,
      relations: [],
    }
  ) {
    const noteRepo = this.manager_.getCustomRepository(this.noteRepository_)

    const query = this.buildQuery_(selector, config)

    return noteRepo.find(query)
  }

  /**
   * Creates a note associated with a given author
   * @param {object} data - the note to create
   * @param {*} config - any configurations if needed, including meta data
   * @returns {Promise} resolves to the creation result
   */
  async create(data, config = { metadata: {} }) {
    const { metadata } = config

    const { resource_id, resource_type, value, author_id } = data

    return this.atomicPhase_(async manager => {
      const noteRepo = manager.getCustomRepository(this.noteRepository_)

      const toCreate = {
        resource_id,
        resource_type,
        value,
        author_id,
        metadata,
      }

      const note = await noteRepo.create(toCreate)
      const result = await noteRepo.save(note)

      await this.eventBus_
        .withTransaction(manager)
        .emit(NoteService.Events.CREATED, { id: result.id })

      return result
    })
  }

  /**
   * Updates a given note with a new value
   * @param {*} noteId - the id of the note to update
   * @param {*} value - the new value
   * @returns {Promise} resolves to the updated element
   */
  async update(noteId, value) {
    return this.atomicPhase_(async manager => {
      const noteRepo = manager.getCustomRepository(this.noteRepository_)

      const note = await this.retrieve(noteId, { relations: ["author"] })

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
   * @param {*} noteId - id of the note to delete
   * @returns {Promise}
   */
  async delete(noteId) {
    return this.atomicPhase_(async manager => {
      const noteRepo = manager.getCustomRepository(this.noteRepository_)

      const note = await this.retrieve(noteId)

      await noteRepo.softRemove(note)

      await this.eventBus_
        .withTransaction(manager)
        .emit(NoteService.Events.DELETED, { id: noteId })

      return Promise.resolve()
    })
  }
}

export default NoteService
