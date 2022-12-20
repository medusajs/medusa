import { Column, Entity, PrimaryColumn } from "typeorm"

@Entity()
export class FulfillmentProvider {
  @PrimaryColumn()
  id: string

  @Column({ default: true })
  is_installed: boolean
}

/**
 * @schema fulfillment_provider
 * title: "Fulfillment Provider"
 * description: "Represents a fulfillment provider plugin and holds its installation status."
 * x-resourceId: fulfillment_provider
 * type: object
 * properties:
 *   id:
 *     description: "The id of the fulfillment provider as given by the plugin."
 *     type: string
 *     example: manual
 *   is_installed:
 *     description: "Whether the plugin is installed in the current version. Plugins that are no longer installed are not deleted by will have this field set to `false`."
 *     type: boolean
 *     example: true
 */
