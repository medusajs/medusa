import { BeforeInsert, Column, Entity } from "typeorm"
import { SoftDeletableEntity } from "../interfaces/models/soft-deletable-entity"
import { DbAwareColumn } from "../utils/db-aware-column"
import { generateEntityId } from "../utils/generate-entity-id"

@Entity()
export class ProductType extends SoftDeletableEntity {
  @Column()
  value: string

  @DbAwareColumn({ type: "jsonb", nullable: true })
  metadata: Record<string, unknown>

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "ptyp")
  }
}

/**
 * @schema product_type
 * title: "Product Type"
 * description: "Product Type can be added to Products for filtering and reporting purposes."
 * x-resourceId: product_type
 * properties:
 *   id:
 *     description: "The id of the Product Type. This value will be prefixed with `ptyp_`."
 *     type: string
 *   value:
 *     description: "The value that the Product Type represents (e.g. \"Clothing\")."
 *     type: string
 *   created_at:
 *     description: "The date with timezone at which the resource was created."
 *     type: string
 *     format: date-time
 *   updated_at:
 *     description: "The date with timezone at which the resource was last updated."
 *     type: string
 *     format: date-time
 *   deleted_at:
 *     description: "The date with timezone at which the resource was deleted."
 *     type: string
 *     format: date-time
 *   metadata:
 *     description: "An optional key-value map with additional information."
 *     type: object
 */
