import { Entity, Column, PrimaryColumn } from "typeorm"

@Entity()
export class TaxProvider {
  @PrimaryColumn()
  id: string

  @Column({ default: true })
  is_installed: boolean
}

/**
 * @schema tax_provider
 * title: "Tax Provider"
 * description: "The tax service used to calculate taxes"
 * x-resourceId: tax_provider
 * properties:
 *   id:
 *     description: "The id of the tax provider as given by the plugin."
 *     type: string
 *   is_installed:
 *     description: "Whether the plugin is installed in the current version. Plugins that are no longer installed are not deleted by will have this field set to `false`."
 *     type: boolean
 */
