import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne } from "typeorm"

import { SoftDeletableEntity } from "../interfaces"
import { resolveDbType } from "../utils/db-aware-column"
import { generateEntityId } from "../utils"
import { User } from "./user"

@Entity()
export class PublishableApiKey extends SoftDeletableEntity {
  @Column({ nullable: true })
  created_by: string | null

  @ManyToOne(() => User)
  @JoinColumn({ name: "created_by" })
  created_by_user: User

  @Column({ nullable: true })
  revoked_by: string | null

  @ManyToOne(() => User)
  @JoinColumn({ name: "revoked_by" })
  revoked_by_user?: User

  @Column({ type: resolveDbType("timestamptz"), nullable: true })
  revoked_at?: Date

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "pak")
  }
}
