import mongoose from "mongoose"

/**
 * Interface for data models. The default data layer uses an internal mongoose
 * model and is as such compatible with MongoDB.
 * @interface
 */
class BaseModel {
  constructor() {
    /** @const the underlying mongoose model used for queries */
    this.mongooseModel_ = this.createMongooseModel_()
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
   * Returns the schema options defined in child class.
   * @return {object} the schema options
   */
  getSchemaOptions() {
    if (!this.constructor.schemaOptions) {
      return {}
    }

    return this.constructor.schemaOptions
  }

  /**
   * @private
   * Creates a mongoose model based on schema, schema options and model name.
   * @return {Mongooose.Model} the mongoose model
   */
  createMongooseModel_() {
    const schema = this.getSchema()
    const options = this.getSchemaOptions()

    const mongooseSchema = new mongoose.Schema(schema, options)

    return mongoose.model(this.getModelName(), mongooseSchema)
  }

  /**
   */
  startSession() {
    return this.mongooseModel_.startSession()
  }

  /**
   * Queries the mongoose model via the mongoose's findOne.
   * @param query {object} a mongoose selector query
   * @param options {?object=} mongoose options
   * @return {?mongoose.Document} the retreived mongoose document or null.
   */
  findOne(query, options = {}) {
    return this.mongooseModel_.findOne(query, options).lean()
  }

  /**
   * Queries the mongoose model via the mongoose's find.
   * @param query {object} a mongoose selector query
   * @param options {?object=} mongoose options
   * @return {Array<mongoose.Document>} the retreived mongoose documents or
   * an empty array
   */
  find(query, options, offset, limit) {
    return this.mongooseModel_
      .find(query, options)
      .skip(offset)
      .limit(limit)
      .lean()
  }

  count() {
    return this.mongooseModel_.count({})
  }

  /**
   * Update a model via the mongoose model's updateOne.
   * @param query {object} a mongoose selector query
   * @param update {object} mongoose update object
   * @param options {?object=} mongoose options
   * @return {object} mongoose result
   */
  updateOne(query, update, options = {}) {
    options.new = true
    return this.mongooseModel_.findOneAndUpdate(query, update, options).lean()
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
