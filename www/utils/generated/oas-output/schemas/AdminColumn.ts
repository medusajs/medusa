/**
 * @schema AdminColumn
 * type: object
 * description: The details of a column in a view configuration.
 * x-schemaName: AdminColumn
 * required:
 *   - id
 *   - name
 *   - field
 *   - sortable
 *   - hideable
 *   - default_visible
 *   - data_type
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The column's ID.
 *   name:
 *     type: string
 *     title: name
 *     description: The column's name. This is displayed in the view header.
 *   description:
 *     type: string
 *     title: description
 *     description: The column's description.
 *   field:
 *     type: string
 *     title: field
 *     description: The column's field in the entity.
 *   sortable:
 *     type: boolean
 *     title: sortable
 *     description: Whether the column is sortable.
 *   hideable:
 *     type: boolean
 *     title: hideable
 *     description: Whether the column is hideable.
 *   default_visible:
 *     type: boolean
 *     title: default_visible
 *     description: Whether the column is visible by default.
 *   data_type:
 *     type: string
 *     description: The data type of the column's value.
 *     enum:
 *       - string
 *       - number
 *       - boolean
 *       - object
 *       - date
 *       - currency
 *       - enum
 *   semantic_type:
 *     type: string
 *     title: semantic_type
 *     description: The column's semantic type. It can be `computed`, or other primitive types.
 *   context:
 *     type: string
 *     title: context
 *     description: The column's context. It can be `display` or `generic`.
 *   computed:
 *     type: object
 *     description: A computed column's details. Only available if the column's `semantic_type` is `computed`.
 *     required:
 *       - type
 *       - required_fields
 *       - optional_fields
 *     properties:
 *       type:
 *         type: string
 *         title: type
 *         description: The computed's type for rendering.
 *       required_fields:
 *         type: array
 *         description: The required fields in the computed column.
 *         items:
 *           type: string
 *           title: required_fields
 *           description: A required field in the computed column.
 *       optional_fields:
 *         type: array
 *         description: The optional fields in the computed column.
 *         items:
 *           type: string
 *           title: optional_fields
 *           description: An optional field in the computed column.
 *   relationship:
 *     type: object
 *     description: The relationship details. Only available for relationship columns.
 *     required:
 *       - entity
 *       - field
 *     properties:
 *       entity:
 *         type: string
 *         title: entity
 *         description: The related entity.
 *       field:
 *         type: string
 *         title: field
 *         description: The field in the related entity.
 *   default_order:
 *     type: number
 *     title: default_order
 *     description: The column's sort order in the default view configuration.
 *   category:
 *     type: string
 *     description: The column's category.
 *     enum:
 *       - status
 *       - metadata
 *       - identifier
 *       - timestamp
 *       - metric
 *       - relationship
 *   render_mode:
 *     type: string
 *     title: render_mode
 *     description: The column's render mode.
 *   filter:
 *     type: object
 *     description: The column's filter.
 *     required:
 *       - enabled
 *     properties:
 *       enabled:
 *         type: boolean
 *         title: enabled
 *         description: Whether the column's filter is enabled.
 *       operators:
 *         type: array
 *         description: The filter's operators.
 *         items:
 *           type: string
 *           title: operators
 *           description: An operator for the column's filter.
 *       enumValues:
 *         type: array
 *         description: The filter's enum values, if the filter supports enums.
 *         items:
 *           type: string
 *           title: enumValues
 *           description: An enum value for the column's filter.
 *       relationship:
 *         $ref: "#/components/schemas/RelationshipFilterConfig"
 *   source:
 *     type: object
 *     description: The column's source details. Only available if the column is from a source.
 *     required:
 *       - module
 *       - entity
 *     properties:
 *       module:
 *         type: string
 *         title: module
 *         description: The source's module.
 *       entity:
 *         type: string
 *         title: entity
 *         description: The source's entity.
 *   custom_label:
 *     type: boolean
 *     title: custom_label
 *     description: Whether the column has a custom label.
 *   label_id:
 *     type: string
 *     title: label_id
 *     description: The ID of the column's label, if it has a custom label.
 * 
*/

