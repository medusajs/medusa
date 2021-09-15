import { MedusaError } from "medusa-core-utils"
import { BaseService } from "medusa-interfaces"
import _ from "lodash"
import { Transaction, TransactionManager } from "typeorm"

class NoteService extends BaseService {
  static Events = {
    CREATED: "note.created",
    UPDATED: "note.updated",
    DELETED: "note.deleted",
  }

  constructor({ manager, noteRepository, eventBusService }) {
    super()

    /** @private @const {EntityManager} */
    this.manager_ = manager

    /** @private @const {noteRepository} */
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
    })

    cloned.transactionManager_ = transactionManager
    return cloned
  }

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
   *
   * @param {string} resourceId - the id of the resource to retrieve
   * notes related to.
   * @return {Promise<Note[]>} related notes.
   */
  async listByResource(
    resourceId,
    config = { skip: 0, take: 50, order: { created_at: "DESC" } }
  ) {
    const noteRepo = this.manager_.getCustomRepository(this.noteRepository_)
    return noteRepo.find({ where: { resource_id: resourceId } })
  }

  async create(resourceId, resourceType, value, config = { metadata: {} }) {
    const { metadata } = config

    return this.atomicPhase_(async manager => {
      const noteRepo = manager.getCustomRepository(this.noteRepository_)

      const toCreate = {
        resource_id: resourceId,
        resource_type: resourceType,
        value,
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

  async update(noteId, value) {
    return this.atomicPhase_(async manager => {
      const noteRepo = manager.getCustomRepository(this.noteRepository_)

      const note = await this.retrieve(noteId)

      note.value = value

      const result = await noteRepo.save(note)

      await this.eventBus_
        .withTransaction(manager)
        .emit(NoteService.Events.UPDATED, { id: result.id })

      return result
    })
  }

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
