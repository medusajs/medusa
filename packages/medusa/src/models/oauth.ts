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
 *   - application_name
 *   - data
 *   - display_name
 *   - id
 *   - install_url
 *   - uninstall_url
 * properties:
 *   id:
 *     description: The app's ID
 *     type: string
 *     example: example_app
 *   display_name:
 *     description: The app's display name
 *     type: string
 *     example: Example app
 *   application_name:
 *     description: The app's name
 *     type: string
 *     example: example
 *   install_url:
 *     description: The URL to install the app
 *     nullable: true
 *     type: string
 *     format: uri
 *   uninstall_url:
 *     description: The URL to uninstall the app
 *     nullable: true
 *     type: string
 *     format: uri
 *   data:
 *     description: Any data necessary to the app.
 *     nullable: true
 *     type: object
 *     example: {}
 */
