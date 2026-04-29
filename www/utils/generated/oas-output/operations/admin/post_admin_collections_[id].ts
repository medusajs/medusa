/**
 * @oas [post] /admin/collections/{id}
 * operationId: PostCollectionsId
 * summary: Update a Collection
 * description: Update a collection's details.
 * x-authenticated: true
 * parameters:
 *   - name: id
 *     in: path
 *     description: The collection's ID.
 *     required: true
 *     schema:
 *       type: string
 *   - name: fields
 *     in: query
 *     description: Comma-separated fields that should be included in the returned data. if a field is prefixed with `+` it will be added to the default fields, using `-` will remove it from the default
 *       fields. without prefix it will replace the entire default fields.
 *     required: false
 *     schema:
 *       type: string
 *       title: fields
 *       description: Comma-separated fields that should be included in the returned data. if a field is prefixed with `+` it will be added to the default fields, using `-` will remove it from the default
 *         fields. without prefix it will replace the entire default fields.
 *       externalDocs:
 *         url: "#select-fields-and-relations"
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         allOf:
 *           - type: object
 *             description: The details to update in a collection.
 *             properties:
 *               title:
 *                 type: string
 *                 title: title
 *                 description: The collection's title.
 *               handle:
 *                 type: string
 *                 title: handle
 *                 description: The collection's handle.
 *               metadata:
 *                 type: object
 *                 description: The collection's metadata.
 *           - type: object
 *             description: The details to update in a collection.
 *             properties:
 *               additional_data:
 *                 type: object
 *                 description: Pass additional custom data to the API route. This data is passed to the underlying workflow under the `additional_data` parameter.
 *         description: The details to update in a collection.
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS SDK
 *     source: |-
 *       import Medusa from "@medusajs/js-sdk"
 * 
 *       export const sdk = new Medusa({
 *         baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
 *         debug: import.meta.env.DEV,
 *         auth: {
 *           type: "session",
 *         },
 *       })
 * 
 *       sdk.admin.productCollection.update("pcol_123", {
 *         title: "Summer Collection"
 *       })
 *       .then(({ collection }) => {
 *         console.log(collection)
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/collections/{id}' \
 *       -H 'Authorization: Bearer {jwt_token}' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *         "metadata": {}
 *       }'
 * tags:
 *   - Collections
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminCollectionResponse"
 *   "400":
 *     $ref: "#/components/responses/400_error"
 *   "401":
 *     $ref: "#/components/responses/unauthorized"
 *   "404":
 *     $ref: "#/components/responses/not_found_error"
 *   "409":
 *     $ref: "#/components/responses/invalid_state_error"
 *   "422":
 *     $ref: "#/components/responses/invalid_request_error"
 *   "500":
 *     $ref: "#/components/responses/500_error"
 * x-workflow: updateCollectionsWorkflow
 * x-events:
 *   - name: product-collection.updated
 *     payload: |-
 *       ```ts
 *       {
 *         id, // The ID of the product collection
 *       }
 *       ```
 *     description: Emitted when product collections are updated.
 *     deprecated: false
 * 
*/

