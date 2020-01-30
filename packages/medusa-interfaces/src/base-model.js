import mongoose from "mongoose"

/**
 * Interface for data models. The default data layer uses an internal mongoose
 * model and is as such compatible with MongoDB.
 * @interface
 */
class BaseModel {
  constructor() {
    /** @const the underlying mongoose model used for queries */
    this.mongooseModel_ = this.createMongooseModel_(this.schema)
  }

  /**
   * Returns the model schema. The child class must implement the static schema
   * property.
   * @return {string} the models schema
   */
  getSchema() {
    if (!this.constructor.schema) {
      throw new Error("Schema not defined")
    }
    return this.constructor.schema
  }

  /**
   * Returns the model name. The child class must implement the static modelName
   * property.
   * @return {string} the name of the model
   */
  getModelName() {
    if (!this.constructor.modelName) {
      throw new Error("Every model must have a static modelName property")
    }
    return this.constructor.modelName
  }

  /**
   * @private
   * Creates a mongoose model based on schema and model name.
   * @return {Mongooose.Model} the mongoose model
   */
  createMongooseModel_() {
    return mongoose.model(this.getModelName(), this.getSchema())
  }

  /**
   * Queries the mongoose model via the mongoose's findOne.
   * @param query {object} a mongoose selector query
   * @param options {?object=} mongoose options
   * @return {?mongoose.Document} the retreived mongoose document or null.
   */
  findOne(query, options = {}) {
    return this.mongooseModel_.findOne(query, options)
  }

  /**
   * Queries the mongoose model via the mongoose's find.
   * @param query {object} a mongoose selector query
   * @param options {?object=} mongoose options
   * @return {Array<mongoose.Document>} the retreived mongoose documents or
   * an empty array
   */
  find(query, options) {
    return this.mongooseModel_.find(query, options)
  }

  /**
   * Update a model via the mongoose model's updateOne.
   * @param query {object} a mongoose selector query
   * @param update {object} mongoose update object
   * @param options {?object=} mongoose options
   * @return {object} mongoose result
   */
  updateOne(query, update, options) {
    return this.mongooseModel_.updateOne(query, update, options)
  }

  /**
   * Update a model via the mongoose model's update.
   * @param query {object} a mongoose selector query
   * @param update {object} mongoose update object
   * @param options {?object=} mongoose options
   * @return {object} mongoose result
   */
  update(query, update, options) {
    return this.mongooseModel_.update(query, update, options)
  }

  /**
   * Creates a document in the mongoose model's collection via create.
   * @param object {object} the value of the document to be created
   * @param options {?object=} mongoose options
   * @return {object} mongoose result
   */
  create(object, options) {
    return this.mongooseModel_.create(object, options)
  }

  /**
   * Deletes a document in the mongoose model's collection
   * @param query {object} the value of the document to be created
   * @param options {?object=} mongoose options
   * @return {object} mongoose result
   */
  deleteOne(query, options) {
    return this.mongooseModel_.deleteOne(query, options)
  }

  /**
   * Deletes many document in the mongoose model's collection
   * @param query {object} the value of the document to be created
   * @param options {?object=} mongoose options
   * @return {object} mongoose result
   */
  delete(query, options) {
    return this.mongooseModel_.deleteMany(query, options)
  }
}

export default BaseModel
