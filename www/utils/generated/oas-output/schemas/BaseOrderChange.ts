/**
 * @schema BaseOrderChange
 * type: object
 * description: The order preview's order change.
 * x-schemaName: BaseOrderChange
 * required:
 *   - order
 *   - claim
 *   - return
 *   - exchange
 *   - id
 *   - version
 *   - order_id
 *   - return_id
 *   - exchange_id
 *   - claim_id
 *   - return_order
 *   - actions
 *   - status
 *   - requested_by
 *   - requested_at
 *   - confirmed_by
 *   - confirmed_at
 *   - declined_by
 *   - declined_reason
 *   - metadata
 *   - declined_at
 *   - canceled_by
 *   - canceled_at
 *   - created_at
 *   - updated_at
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The order change's ID.
 *   order_id:
 *     type: string
 *     title: order_id
 *     description: The order change's order id.
 *   actions:
 *     type: array
 *     description: The order change's actions.
 *     items:
 *       $ref: "#/components/schemas/BaseOrderChangeAction"
 *   status:
 *     type: string
 *     title: status
 *     description: The order change's status.
 *   requested_by:
 *     type: string
 *     title: requested_by
 *     description: The order change's requested by.
 *   requested_at:
 *     oneOf:
 *       - type: string
 *         title: requested_at
 *         description: The order change's requested at.
 *       - type: string
 *         title: requested_at
 *         description: The order change's requested at.
 *         format: date-time
 *   confirmed_by:
 *     type: string
 *     title: confirmed_by
 *     description: The order change's confirmed by.
 *   confirmed_at:
 *     oneOf:
 *       - type: string
 *         title: confirmed_at
 *         description: The order change's confirmed at.
 *       - type: string
 *         title: confirmed_at
 *         description: The order change's confirmed at.
 *         format: date-time
 *   declined_by:
 *     type: string
 *     title: declined_by
 *     description: The order change's declined by.
 *   declined_reason:
 *     type: string
 *     title: declined_reason
 *     description: The order change's declined reason.
 *   metadata:
 *     type: object
 *     description: The order change's metadata.
 *   declined_at:
 *     oneOf:
 *       - type: string
 *         title: declined_at
 *         description: The order change's declined at.
 *       - type: string
 *         title: declined_at
 *         description: The order change's declined at.
 *         format: date-time
 *   canceled_by:
 *     type: string
 *     title: canceled_by
 *     description: The order change's canceled by.
 *   canceled_at:
 *     oneOf:
 *       - type: string
 *         title: canceled_at
 *         description: The order change's canceled at.
 *       - type: string
 *         title: canceled_at
 *         description: The order change's canceled at.
 *         format: date-time
 *   created_at:
 *     type: string
 *     format: date-time
 *     title: created_at
 *     description: The order change's created at.
 *   updated_at:
 *     type: string
 *     format: date-time
 *     title: updated_at
 *     description: The order change's updated at.
 *   version:
 *     type: number
 *     title: version
 *     description: The order change's version.
 *   change_type:
 *     type: string
 *     description: The order change's change type.
 *     enum:
 *       - return
 *       - exchange
 *       - claim
 *       - edit
 *       - return_request
 *   return_id:
 *     type: string
 *     title: return_id
 *     description: The order change's return id.
 *   exchange_id:
 *     type: string
 *     title: exchange_id
 *     description: The order change's exchange id.
 *   claim_id:
 *     type: string
 *     title: claim_id
 *     description: The order change's claim id.
 *   order:
 *     $ref: "#/components/schemas/AdminOrder"
 *   return_order:
 *     $ref: "#/components/schemas/AdminReturn"
 *   exchange:
 *     $ref: "#/components/schemas/AdminExchange"
 *   claim:
 *     $ref: "#/components/schemas/AdminClaim"
 * 
*/

