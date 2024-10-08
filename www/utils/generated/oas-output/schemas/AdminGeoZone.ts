/**
 * @schema AdminGeoZone
 * type: object
 * description: The geo zone's geo zones.
 * x-schemaName: AdminGeoZone
 * required:
 *   - id
 *   - type
 *   - country_code
 *   - province_code
 *   - city
 *   - postal_expression
 *   - created_at
 *   - updated_at
 *   - deleted_at
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The geo zone's ID.
 *   type:
 *     type: string
 *     description: The geo zone's type.
 *     enum:
 *       - country
 *       - province
 *       - city
 *       - zip
 *   country_code:
 *     type: string
 *     title: country_code
 *     description: The geo zone's country code.
 *   province_code:
 *     type: string
 *     title: province_code
 *     description: The geo zone's province code.
 *   city:
 *     type: string
 *     title: city
 *     description: The geo zone's city.
 *   postal_expression:
 *     type: object
 *     description: The geo zone's postal expression.
 *   created_at:
 *     type: string
 *     format: date-time
 *     title: created_at
 *     description: The geo zone's created at.
 *   updated_at:
 *     type: string
 *     format: date-time
 *     title: updated_at
 *     description: The geo zone's updated at.
 *   deleted_at:
 *     type: string
 *     format: date-time
 *     title: deleted_at
 *     description: The geo zone's deleted at.
 * 
*/

