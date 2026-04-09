/**
 * @oas [post] /admin/translations/batch
 * operationId: PostTranslationsBatch
 * summary: Manage Translations
 * description: Manage translations in bulk by creating, updating, or deleting multiple translations in a single request. You can manage translations for various resources such as products, product
 *   variants, categories, and more.
 * x-authenticated: true
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         type: object
 *         description: The translations to be created, updated, or deleted in bulk.
 *         properties:
 *           create:
 *             type: array
 *             description: The translations to create.
 *             items:
 *               type: object
 *               description: The translation's details.
 *               required:
 *                 - reference
 *                 - reference_id
 *                 - locale_code
 *                 - translations
 *               properties:
 *                 reference:
 *                   type: string
 *                   title: reference
 *                   description: The resource that the translation belongs to.
 *                   example: product
 *                 reference_id:
 *                   type: string
 *                   title: reference_id
 *                   description: The ID of the resource that the translation belongs to. For example, the ID of a product.
 *                   example: prod_123
 *                 locale_code:
 *                   type: string
 *                   title: locale_code
 *                   description: The translation's locale code in BCP 47 format.
 *                   example: fr-FR
 *                 translations:
 *                   type: object
 *                   description: The translation key-value pairs. Each key is a field in the resource, and the value is the translated text.
 *                   example:
 *                     title: Chaussures
 *                     description: Des chaussures élégantes.
 *           update:
 *             type: array
 *             description: The translations to update.
 *             items:
 *               type: object
 *               description: The data for updating a translation.
 *               required:
 *                 - id
 *               properties:
 *                 id:
 *                   type: string
 *                   title: id
 *                   description: The ID of the translation to update.
 *                 reference:
 *                   type: string
 *                   title: reference
 *                   description: The resource that the translation belongs to.
 *                   example: product
 *                 reference_id:
 *                   type: string
 *                   title: reference_id
 *                   description: The ID of the resource that the translation belongs to. For example, the ID of a product.
 *                   example: prod_123
 *                 locale_code:
 *                   type: string
 *                   title: locale_code
 *                   description: The translation's locale code in BCP 47 format.
 *                   example: fr-FR
 *                 translations:
 *                   type: object
 *                   description: The translation key-value pairs. Each key is a field in the resource, and the value is the translated text.
 *                   example:
 *                     title: Chaussures Modifiées
 *                     description: Des chaussures élégantes et modifiées.
 *           delete:
 *             type: array
 *             description: The translations to delete.
 *             items:
 *               type: string
 *               title: delete
 *               description: The ID of a translation to delete.
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
 *       sdk.admin.translation.batch({
 *         create: [
 *           {
 *             reference_id: "prod_123",
 *             reference: "product",
 *             locale_code: "en-US",
 *             translations: { title: "Shirt" }
 *           }
 *         ],
 *         update: [
 *           {
 *             id: "trans_123",
 *             translations: { title: "Pants" }
 *           }
 *         ],
 *         delete: ["trans_321"]
 *       })
 *       .then(({ created, updated, deleted }) => {
 *         console.log(created, updated, deleted)
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/translations/batch' \
 *       -H 'Authorization: Bearer {access_token}' \
 *       -H 'Content-Type: application/json' \
 *       -d '{
 *         "create": [
 *           {
 *             "reference": "product",
 *             "reference_id": "prod_123",
 *             "locale_code": "fr-FR",
 *             "translations": {
 *               "title": "Chaussures",
 *               "description": "Des chaussures élégantes."
 *             }
 *           }
 *         ]
 *       }'
 * tags:
 *   - Translations
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminTranslationsBatchResponse"
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
 * x-workflow: batchTranslationsWorkflow
 * x-events:
 *   - name: translation.created
 *     payload: |-
 *       ```ts
 *       {
 *         id, // The ID of the translation
 *       }
 *       ```
 *     description: Emitted when translations are created.
 *     deprecated: false
 *     since: 2.12.3
 *   - name: translation.updated
 *     payload: |-
 *       ```ts
 *       {
 *         id, // The ID of the translation
 *       }
 *       ```
 *     description: Emitted when translations are updated.
 *     deprecated: false
 *     since: 2.12.3
 *   - name: translation.deleted
 *     payload: |-
 *       ```ts
 *       {
 *         id, // The ID of the translation
 *       }
 *       ```
 *     description: Emitted when translations are deleted.
 *     deprecated: false
 *     since: 2.12.3
 * x-since: 2.12.3
 * x-featureFlag: translation
 * 
*/

