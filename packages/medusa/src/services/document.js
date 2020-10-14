import { Validator, MedusaError } from "medusa-core-utils"
import { BaseService } from "medusa-interfaces"

/**
 * Provides layer to manipulate documents.
 * @implements BaseService
 */
class DocumentService extends BaseService {
  constructor({ documentModel, eventBusService }) {
    super()

    /** @private @const {DocumentModel} */
    this.documentModel_ = documentModel

    /** @private @const {EventBus} */
    this.eventBus_ = eventBusService
  }

  /**
   * Used to validate document ids. Throws an error if the cast fails
   * @param {string} rawId - the raw document id to validate.
   * @return {string} the validated id
   */
  validateId_(rawId) {
    const schema = Validator.objectId()
    const { value, error } = schema.validate(rawId.toString())
    if (error) {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        "The documentId could not be casted to an ObjectId"
      )
    }

    return value
  }

  /**
   * Creates a document.
   * @return {Promise<Document>} the newly created document.
   */
  async create(doc) {
    return this.documentModel_.create(doc)
  }

  /**
   * Retrieve a document.
   * @return {Promise<Document>} the document.
   */
  async retrieve(id) {
    const validatedId = this.validateId_(id)
    return this.documentModel_.findOne({ _id: validatedId }).catch(err => {
      throw new MedusaError(MedusaError.Types.DB_ERROR, err.message)
    })
  }

  /**
   * Updates a customer. Metadata updates and address updates should
   * use dedicated methods, e.g. `setMetadata`, etc. The function
   * will throw errors if metadata updates and address updates are attempted.
   * @param {string} variantId - the id of the variant. Must be a string that
   *   can be casted to an ObjectId
   * @param {object} update - an object with the update values.
   * @return {Promise} resolves to the update result.
   */
  async update(id, update) {
    const doc = await this.retrieve(id)

    if (update.metadata) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Use setMetadata to update metadata fields"
      )
    }

    return this.documentModel_
      .updateOne({ _id: doc._id }, { $set: update }, { runValidators: true })
      .catch(err => {
        throw new MedusaError(MedusaError.Types.DB_ERROR, err.message)
      })
  }

  /**
   * Deletes a document
   * @param {string} id - the id of the document to delete.
   * @return {Promise} the result of the delete operation.
   */
  async delete(id) {
    let doc
    try {
      doc = await this.retrieve(id)
    } catch (error) {
      return Promise.resolve()
    }

    return this.documentModel_.deleteOne({ _id: doc._id }).catch(err => {
      throw new MedusaError(MedusaError.Types.DB_ERROR, err.message)
    })
  }

  /**
   * Decorates a document object.
   * @param {Document} doc - the document to decorate.
   * @param {string[]} fields - the fields to include.
   * @param {string[]} expandFields - fields to expand.
   * @return {Document} return the decorated doc.
   */
  async decorate(doc, fields, expandFields = []) {
    return doc
  }

  /**
   * Dedicated method to set metadata for a document.
   * To ensure that plugins does not overwrite each
   * others metadata fields, setMetadata is provided.
   * @param {string} id - the document id
   * @param {string} key - key for metadata field
   * @param {string} value - value for metadata field.
   * @return {Promise} resolves to the updated result.
   */
  async setMetadata(id, key, value) {
    const doc = await this.retrieve(id)
    if (typeof key !== "string") {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        "Key type is invalid. Metadata keys must be strings"
      )
    }

    const keyPath = `metadata.${key}`
    return this.documentModel_
      .updateOne({ _id: doc._id }, { $set: { [keyPath]: value } })
      .catch(err => {
        throw new MedusaError(MedusaError.Types.DB_ERROR, err.message)
      })
  }
}

export default DocumentService
