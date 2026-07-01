/**
 * @schema AdminLayoutConfiguration
 * type: object
 * description: The layout configuration's layout configurations.
 * x-schemaName: AdminLayoutConfiguration
 * required:
 *   - id
 *   - zone
 *   - user_id
 *   - is_system_default
 *   - configuration
 *   - created_at
 *   - updated_at
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The layout configuration's ID.
 *   zone:
 *     type: string
 *     title: zone
 *     description: The layout configuration's zone.
 *   user_id:
 *     type: string
 *     title: user_id
 *     description: The layout configuration's user id.
 *   is_system_default:
 *     type: boolean
 *     title: is_system_default
 *     description: The layout configuration's is system default.
 *   configuration:
 *     type: object
 *     description: The layout configuration's configuration.
 *     required:
 *       - widgets
 *     properties:
 *       widgets:
 *         type: object
 *         description: The configuration's widgets.
 *         additionalProperties:
 *           type: object
 *           properties:
 *             hidden:
 *               type: boolean
 *               title: hidden
 *               description: The widget's hidden.
 *             section:
 *               type: string
 *               title: section
 *               description: The widget's section.
 *             order:
 *               type: number
 *               title: order
 *               description: The widget's order.
 *   created_at:
 *     type: string
 *     format: date-time
 *     title: created_at
 *     description: The layout configuration's created at.
 *   updated_at:
 *     type: string
 *     format: date-time
 *     title: updated_at
 *     description: The layout configuration's updated at.
 * 
*/

