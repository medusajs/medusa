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

    /** @private @const {noteRepository} */
    this.noteRepository_ = noteRepository

    /** @private @const {userService} */
    this.userService_ = userService

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
      userRepository: this.userRepository_,
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

  /**
   * Lists notes related to a given resource
   * @param {string} resourceId - the id of the resource to retrieve
   * notes related to.
   * @return {Promise<Note[]>} related notes.
   */
  async listByResource(
    resourceId,
    config = {
      skip: 0,
      take: 50,
      order: { created_at: "DESC" },
    }
  ) {
    const noteRepo = this.manager_.getCustomRepository(this.noteRepository_)

    const query = this.buildQuery_({ resource_id: resourceId }, config)

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

    const { resourceId, resourceType, value, author } = data

    return this.atomicPhase_(async manager => {
      const noteRepo = manager.getCustomRepository(this.noteRepository_)

      const user = await this.userService_
        .withTransaction(manager)
        .retrieve(author)

      const toCreate = {
        resource_id: resourceId,
        resource_type: resourceType,
        value,
        author: user,
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
