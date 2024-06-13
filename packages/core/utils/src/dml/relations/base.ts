import {
  RelationshipMetadata,
  RelationshipOptions,
  RelationshipType,
} from "../types"

/**
 * The BaseRelationship encapsulates the repetitive parts of defining
 * a relationship
 */
export abstract class BaseRelationship<T> implements RelationshipType<T> {
  #referencedEntity: T

  protected options: RelationshipOptions

  /**
   * The relationship type.
   */
  protected abstract relationshipType: RelationshipMetadata["type"]

  /**
   * A type-only property to infer the JavScript data-type
   * of the relationship property
   */
  declare $dataType: T

  constructor(referencedEntity: T, options: RelationshipOptions) {
    this.#referencedEntity = referencedEntity
    this.options = options
  }

  /**
   * Returns the parsed copy of the relationship
   */
  parse(relationshipName: string): RelationshipMetadata {
    return {
      name: relationshipName,
      nullable: false,
      mappedBy: this.options.mappedBy,
      entity: this.#referencedEntity,
      type: this.relationshipType,
    }
  }
}
