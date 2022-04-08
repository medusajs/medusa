import { BeforeInsert, Column, Entity } from "typeorm"
import { BaseEntity } from "./_base"

@Entity()
export class ProductType extends BaseEntity {
  @Column()
  value: string

  @BeforeInsert()
  private beforeInsert(): void {
    this.generateId('ptyp')
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
