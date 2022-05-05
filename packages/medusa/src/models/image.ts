import { BeforeInsert, Column, Entity } from "typeorm"
import { SoftDeletableEntity } from "../interfaces/models/soft-deletable-entity"
import { DbAwareColumn } from "../utils/db-aware-column"
import { generateEntityId } from "../utils/generate-entity-id"

@Entity()
export class Image extends SoftDeletableEntity {
  @Column()
  url: string

  @DbAwareColumn({ type: "jsonb", nullable: true })
  metadata: Record<string, unknown>

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "img")
  }
}

/**
 * @schema image
 * title: "Image"
 * description: "Images holds a reference to a URL at which the image file can be found."
 * x-resourceId: image
 * properties:
 *   id:
 *     description: "The id of the Image. This value will be prefixed by `img_`."
 *     type: string
 *   url:
 *     description: "The URL at which the image file can be found."
 *     type: string
 *   created_at:
 *     description: "The date with timezone at which the resource was created."
 *     type: string
 *     format: date-time
 *   update_at:
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
