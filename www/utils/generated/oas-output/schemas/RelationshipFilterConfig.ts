/**
 * @schema RelationshipFilterConfig
 * type: object
 * description: The filter's relationship details. Only available if the filter is a relationship filter.
 * x-schemaName: RelationshipFilterConfig
 * required:
 *   - entity
 *   - value_field
 *   - display_field
 *   - multiple
 *   - endpoint
 * properties:
 *   entity:
 *     type: string
 *     title: entity
 *     description: The entity the relationship filter is for.
 *   value_field:
 *     type: string
 *     title: value_field
 *     description: The relationship filter's value field.
 *   display_field:
 *     type: string
 *     title: display_field
 *     description: The relationship filter's display field.
 *   multiple:
 *     type: boolean
 *     title: multiple
 *     description: Whether the relationship filter allows multiple selections.
 *   endpoint:
 *     type: string
 *     title: endpoint
 *     description: The relationship filter's endpoint.
 * 
*/

