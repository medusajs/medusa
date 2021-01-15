import {
  Entity,
  RelationId,
  BeforeInsert,
  Column,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  OneToOne,
  OneToMany,
  ManyToOne,
  ManyToMany,
  JoinColumn,
  JoinTable,
} from "typeorm"
import { ulid } from "ulid"

@Entity()
export class StagedJob {
  @PrimaryColumn()
  id: string

  @Column()
  event_name: string

  @Column({ type: "jsonb" })
  data: any

  @BeforeInsert()
  private beforeInsert() {
    const id = ulid()
    this.id = `job_${id}`
  }
}
