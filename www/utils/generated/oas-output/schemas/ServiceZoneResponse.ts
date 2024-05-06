/**
 * @schema ServiceZoneResponse
 * type: object
 * description: The service zone's service zones.
 * x-schemaName: ServiceZoneResponse
 * required:
 *   - id
 *   - name
 *   - metadata
 *   - geo_zones
 *   - created_at
 *   - updated_at
 *   - deleted_at
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The service zone's ID.
 *   name:
 *     type: string
 *     title: name
 *     description: The service zone's name.
 *   metadata:
 *     type: object
 *     description: The service zone's metadata.
 *     properties: {}
 *   geo_zones:
 *     type: array
 *     description: The service zone's geo zones.
 *     items:
 *       $ref: "#/components/schemas/AdminGeoZoneResponse"
 *   created_at:
 *     type: string
 *     title: created_at
 *     description: The service zone's created at.
 *     format: date-time
 *   updated_at:
 *     type: string
 *     title: updated_at
 *     description: The service zone's updated at.
 *     format: date-time
 *   deleted_at:
 *     type: string
 *     title: deleted_at
 *     description: The service zone's deleted at.
 *     format: date-time
 * 
*/

