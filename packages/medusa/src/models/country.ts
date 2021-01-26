import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
  PrimaryGeneratedColumn,
} from "typeorm"

import { Region } from "./region"

@Entity()
export class Country {
  @PrimaryGeneratedColumn()
  id: number

  @Index({ unique: true })
  @Column()
  iso_2: string

  @Column()
  iso_3: string

  @Column()
  num_code: number

  @Column()
  name: string

  @Column()
  display_name: string

  @Column({ nullable: true })
  region_id: string

  @ManyToOne(
    () => Region,
    r => r.countries
  )
  @JoinColumn({ name: "region_id" })
  region: Region
}
