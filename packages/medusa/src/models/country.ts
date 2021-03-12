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

  @Index()
  @Column({ nullable: true })
  region_id: string

  @ManyToOne(
    () => Region,
    r => r.countries
  )
  @JoinColumn({ name: "region_id" })
  region: Region
}

/**
 * @schema country
 * title: "Country"
 * description: "Country details"
 * x-resourceId: country
 * properties:
 *  id:
 *    description: "The database id of the country"
 *    type: integer
 *  iso_2:
 *    description: "The 2 character ISO code for the country."
 *    type: string
 *  iso_3:
 *    description: "The 3 character ISO code for the country."
 *    type: string
 *  num_code:
 *    description: "The numerical ISO code for the country."
 *    type: string
 *  name:
 *    description: "The normalized country name; in upper case."
 *    type: string
 *  display_name:
 *    description: "The country name appropriate for display."
 *    type: string
 */
