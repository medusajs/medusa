import { RelationshipMetadata, RelationshipType } from "../types"

/**
 * The BaseRelationship encapsulates the repetitive parts of defining
 * a relationship
 */
export abstract class BaseRelationship<T> implements RelationshipType<T> {
  #referencedEntity: T
  #mappedBy?: string

  protected options: Record<string, any>

  /**
   * The relationship type.
   */
  protected abstract relationshipType: RelationshipMetadata["type"]

  /**
   * A type-only property to infer the JavScript data-type
   * of the relationship property
   */
  declare $dataType: T

  constructor(referencedEntity: T, options: Record<string, any>) {
    this.#referencedEntity = referencedEntity
    this.options = options
  }

  /**
   * Define the property name on the related entity that
   * defines the inverse of this relationship.
   */
  mappedBy(property: string): this {
    this.#mappedBy = property
    return this
  }

  /**
   * Returns the parsed copy of the relationship
   */
  parse(relationshipName: string): RelationshipMetadata {
    return {
      name: relationshipName,
      nullable: false,
      mappedBy: this.#mappedBy,
      entity: this.#referencedEntity,
      options: this.options,
      type: this.relationshipType,
    }
  }
}
