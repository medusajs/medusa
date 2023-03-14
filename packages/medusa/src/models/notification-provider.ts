import { Column, Entity, PrimaryColumn } from "typeorm"

@Entity()
export class NotificationProvider {
  @PrimaryColumn()
  id: string

  @Column({ default: true })
  is_installed: boolean
}

/**
 * @schema NotificationProvider
 * title: "Notification Provider"
 * description: "Represents a notification provider plugin and holds its installation status."
 * type: object
 * required:
 *   - id
 *   - is_installed
 * properties:
 *   id:
 *     description: The id of the notification provider as given by the plugin.
 *     type: string
 *     example: sendgrid
 *   is_installed:
 *     description: Whether the plugin is installed in the current version. Plugins that are no longer installed are not deleted by will have this field set to `false`.
 *     type: boolean
 *     default: true
 */
