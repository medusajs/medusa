import { NullableModifier } from "../modifiers/nullable"
import { RelationshipMetadata, RelationshipType } from "../types"

/**
 * The BaseRelationship encapsulates the repetitive parts of defining
 * a relationship
 */
export abstract class BaseRelationship<T> implements RelationshipType<T> {
  #referencedEntity: T
  #options: Record<string, any>

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
    this.#options = options
  }

  /**
   * Apply nullable modifier on the schema
   */
  nullable() {
    return new NullableModifier<T>(this)
  }

  /**
   * Returns the parsed copy of the relationship
   */
  parse(relationshipName: string): RelationshipMetadata {
    return {
      name: relationshipName,
      nullable: false,
      optional: false,
      entity: this.#referencedEntity,
      options: this.#options,
      type: this.relationshipType,
    }
  }
}
