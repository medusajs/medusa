/**
 * @schema AdminAuditLogRequest
 * type: object
 * description: The HTTP details of an audit log written for an API request.
 * x-schemaName: AdminAuditLogRequest
 * required:
 *   - method
 *   - route
 *   - path
 *   - status_code
 *   - request_id
 *   - ip_address
 *   - user_agent
 * properties:
 *   method:
 *     type: string
 *     title: method
 *     description: The HTTP method, such as `POST`.
 *   route:
 *     type: string
 *     title: route
 *     description: The route pattern, such as `/admin/orders/:id/cancel`.
 *   path:
 *     type: string
 *     title: path
 *     description: The request path without the query string.
 *   status_code:
 *     type: number
 *     title: status_code
 *     description: The response status code.
 *   request_id:
 *     type: string
 *     title: request_id
 *     description: The request's request id.
 *   ip_address:
 *     type: string
 *     title: ip_address
 *     description: The request's ip address.
 *   user_agent:
 *     type: string
 *     title: user_agent
 *     description: The request's user agent.
 * 
*/

