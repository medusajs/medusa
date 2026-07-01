/**
 * @schema AdminLayoutConfigurationResponse
 * type: object
 * description: SUMMARY
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
 *     description: The layout's active scope.
 *     enum:
 *       - default
 *       - personal
 * 
*/

