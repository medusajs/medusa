import { BeforeInsert, Column, Entity, JoinTable, ManyToMany } from "typeorm"

import { DbAwareColumn } from "../utils/db-aware-column"
import { SoftDeletableEntity } from "../interfaces/models/soft-deletable-entity"
import { generateEntityId } from "../utils/generate-entity-id"
import { Image } from "./image"

@Entity()
export class ProductType extends SoftDeletableEntity {
  @Column()
  value: string

  @ManyToMany(() => Image, { cascade: ["insert"] })
  @JoinTable({
    name: "product_type_images",
    joinColumn: {
      name: "product_type_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "image_id",
      referencedColumnName: "id",
    },
  })
  images: Image[]

  @Column({ type: "text", nullable: true })
  thumbnail: string | null

  @DbAwareColumn({ type: "jsonb", nullable: true })
  metadata: Record<string, unknown>

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
 *   - created_at
 *   - deleted_at
 *   - id
 *   - metadata
 *   - updated_at
 *   - value
 * properties:
 *   id:
 *     description: The product type's ID
 *     type: string
 *     example: ptyp_01G8X9A7ESKAJXG2H0E6F1MW7A
 *   value:
 *     description: The value that the Product Type represents.
 *     type: string
 *     example: Clothing
 *   images:
 *     description: "Images of the Product Type."
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/image"
 *   thumbnail:
 *     description: "A URL to an image file that can be used to identify the Product Type."
 *     type: string
 *   created_at:
 *     description: The date with timezone at which the resource was created.
 *     type: string
 *     format: date-time
 *   updated_at:
 *     description: The date with timezone at which the resource was updated.
 *     type: string
 *     format: date-time
 *   deleted_at:
 *     description: The date with timezone at which the resource was deleted.
 *     nullable: true
 *     type: string
 *     format: date-time
 *   metadata:
 *     description: An optional key-value map with additional details
 *     nullable: true
 *     type: object
 *     example: {car: "white"}
 */
