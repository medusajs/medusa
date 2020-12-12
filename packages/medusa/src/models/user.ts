import {
  Entity,
  BeforeInsert,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
  Column,
  PrimaryColumn,
} from "typeorm"
import randomize from "randomatic"

@Entity()
export class User {
  @PrimaryColumn()
  id: string

  @Index({ unique: true })
  @Column()
  email: string

  @Column()
  first_name: string

  @Column()
  last_name: string

  @Column()
  password_hash: string

  @Column()
  api_token: string

  @CreateDateColumn({ type: "timestamptz" })
  created_at: Date

  @UpdateDateColumn({ type: "timestamptz" })
  updated_at: Date

  @DeleteDateColumn({ type: "timestamptz" })
  deleted_at: Date

  @Column({ type: "jsonb", nullable: true })
  metadata: any

  @BeforeInsert()
  private beforeInsert() {
    const id = randomize("Aa0", 10)
    this.id = `usr_${id}`
  }
}
