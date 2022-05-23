import { Column, Entity, PrimaryColumn } from "typeorm"

@Entity()
export class PaymentProvider {
  @PrimaryColumn()
  id: string

  @Column({ default: true })
  is_installed: boolean
}

/**
 * @schema payment_provider
 * title: "Payment Provider"
 * description: "Represents a Payment Provider plugin and holds its installation status."
 * x-resourceId: payment_provider
 * properties:
 *   id:
 *     description: "The id of the payment provider as given by the plugin."
 *     type: string
 *   is_installed:
 *     description: "Whether the plugin is installed in the current version. Plugins that are no longer installed are not deleted by will have this field set to `false`."
 *     type: boolean
 */
