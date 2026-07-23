/**
 * @schema AdminLayoutConfigurationResponse
 * type: object
 * description: The details for a layout configuration response.
 * x-schemaName: AdminLayoutConfigurationResponse
 * required:
 *   - personal_configuration
 *   - default_configuration
 *   - active_scope
 * properties:
 *   personal_configuration:
 *     $ref: "#/components/schemas/AdminLayoutConfiguration"
 *   default_configuration:
 *     $ref: "#/components/schemas/AdminLayoutConfiguration"
 *   active_scope:
 *     type: string
 *     description: The active scope of the layout configuration.
 *     enum:
 *       - default
 *       - personal
 * 
*/

