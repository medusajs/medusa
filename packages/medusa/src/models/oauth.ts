import { BeforeInsert, Column, Entity, Index, PrimaryColumn } from "typeorm"
import { ulid } from "ulid"
import { DbAwareColumn } from "../utils/db-aware-column"

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
  data: any

  @BeforeInsert()
  private beforeInsert() {
    if (this.id) return
    const id = ulid()
    this.id = `oauth_${id}`
  }
}

/**
 * @schema OAuth
 * title: "OAuth"
 * description: "Represent an OAuth app"
 * x-resourceId: OAuth
 * properties:
 *   id:
 *     type: string
 *   display_name:
 *     type: string
 *   application_name:
 *     type: string
 *   install_url:
 *     type: string
 *   uninstall_url:
 *     type: integer
 *   data:
 *     type: object
 */
