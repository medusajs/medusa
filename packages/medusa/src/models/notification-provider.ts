import { Entity, Column, PrimaryColumn } from "typeorm"

@Entity()
export class NotificationProvider {
  @PrimaryColumn()
  id: string

  @Column({ default: true })
  is_installed: boolean
}
