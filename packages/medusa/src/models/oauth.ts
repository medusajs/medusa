import {
  Entity,
  Index,
  BeforeInsert,
  Column,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
  RelationId,
  PrimaryColumn,
  OneToOne,
  OneToMany,
  ManyToOne,
  ManyToMany,
  JoinColumn,
  JoinTable,
} from "typeorm"
import randomize from "randomatic"

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

  @Column({ type: "jsonb", nullable: true })
  data: any

  @BeforeInsert()
  private beforeInsert() {
    if (this.id) return
    const id = randomize("Aa0", 10)
    this.id = `oauth_${id}`
  }
}
