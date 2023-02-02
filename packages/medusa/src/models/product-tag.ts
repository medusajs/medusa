import { BeforeInsert, Column, Entity } from "typeorm"

import { DbAwareColumn } from "../utils/db-aware-column"
import { SoftDeletableEntity } from "../interfaces/models/soft-deletable-entity"
import { generateEntityId } from "../utils/generate-entity-id"

@Entity()
export class ProductTag extends SoftDeletableEntity {
  @Column()
  value: string

  @DbAwareColumn({ type: "jsonb", nullable: true })
  metadata: Record<string, unknown> | null

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "ptag")
  }
}

/**
 * @schema ProductTag
 * title: "Product Tag"
 * description: "Product Tags can be added to Products for easy filtering and grouping."
 * type: object
 * required:
 *   - value
 * properties:
 *   id:
 *     type: string
 *     description: The product tag's ID
 *     example: ptag_01G8K2MTMG9168F2B70S1TAVK3
 *   value:
 *     description: "The value that the Product Tag represents"
 *     type: string
 *     example: Pants
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
