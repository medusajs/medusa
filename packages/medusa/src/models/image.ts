import {
  Entity,
  BeforeInsert,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  PrimaryColumn,
} from "typeorm"
import { BaseEntity } from "./_base"
import { ulid } from "ulid"
import { resolveDbType, DbAwareColumn } from "../utils/db-aware-column"

@Entity()
export class Image extends BaseEntity {
  prefixId = "img"

  @Column()
  url: string
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
