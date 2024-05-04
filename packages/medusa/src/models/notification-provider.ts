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
 * description: "A notification provider represents a notification service installed in the Medusa backend, either through a plugin or backend customizations.
 *  It holds the notification service's installation status."
 * type: object
 * required:
 *   - id
 *   - is_installed
 * properties:
 *   id:
 *     description: The ID of the notification provider as given by the notification service.
 *     type: string
 *     example: sendgrid
 *   is_installed:
 *     description: Whether the notification service is installed in the current version. If a notification service is no longer installed, the `is_installed` attribute is set to `false`.
 *     type: boolean
 *     default: true
 */
