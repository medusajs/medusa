import { BeforeInsert, Column, Entity, Index, PrimaryColumn } from "typeorm"

import { DbAwareColumn } from "../utils/db-aware-column"
import { generateEntityId } from "../utils/generate-entity-id"

@Entity()
export class Oauth {
  @PrimaryColumn()
  id: string

  @Column()
  display_name: string

  @Index({ unique: true })
  @Column()
  application_name: string

  @Column({ nullable: true })
  install_url: string

  @Column({ nullable: true })
  uninstall_url: string

  @DbAwareColumn({ type: "jsonb", nullable: true })
  data: Record<string, unknown>

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "oauth")
  }
}

/**
 * @schema OAuth
 * title: "OAuth"
 * description: "Represent an OAuth app"
 * type: object
 * required:
 *   - id
 *   - display_name
 *   - application_name
 * properties:
 *   id:
 *     type: string
 *     description: The app's ID
 *     example: example_app
 *   display_name:
 *     type: string
 *     description: The app's display name
 *     example: Example app
 *   application_name:
 *     type: string
 *     description: The app's name
 *     example: example
 *   install_url:
 *     type: string
 *     description: The URL to install the app
 *     format: uri
 *   uninstall_url:
 *     type: string
 *     description: The URL to uninstall the app
 *     format: uri
 *   data:
 *     type: object
 *     description: Any data necessary to the app.
 *     example: {}
 */
