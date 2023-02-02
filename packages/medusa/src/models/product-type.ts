import { BeforeInsert, Column, Entity } from "typeorm"

import { DbAwareColumn } from "../utils/db-aware-column"
import { SoftDeletableEntity } from "../interfaces/models/soft-deletable-entity"
import { generateEntityId } from "../utils/generate-entity-id"

@Entity()
export class ProductType extends SoftDeletableEntity {
  @Column()
  value: string

  @DbAwareColumn({ type: "jsonb", nullable: true })
  metadata: Record<string, unknown> | null

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "ptyp")
  }
}

/**
 * @schema ProductType
 * title: "Product Type"
 * description: "Product Type can be added to Products for filtering and reporting purposes."
 * type: object
 * required:
 *   - value
 * properties:
 *   id:
 *     type: string
 *     description: The product type's ID
 *     example: ptyp_01G8X9A7ESKAJXG2H0E6F1MW7A
 *   value:
 *     description: "The value that the Product Type represents."
 *     type: string
 *     example: Clothing
 *   created_at:
 *     type: string
 *     description: "The date with timezone at which the resource was created."
 *     format: date-time
 *   updated_at:
 *     type: string
 *     description: "The date with timezone at which the resource was updated."
 *     format: date-time
 *   deleted_at:
 *     type: string
 *     description: "The date with timezone at which the resource was deleted."
 *     format: date-time
 *   metadata:
 *     type: object
 *     description: An optional key-value map with additional details
 *     example: {car: "white"}
 */
