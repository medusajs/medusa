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
