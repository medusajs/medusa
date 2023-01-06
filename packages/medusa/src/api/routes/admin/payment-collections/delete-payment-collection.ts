import { PaymentCollectionService } from "../../../../services"

/**
 * @oas [delete] /payment-collections/{id}
 * operationId: "DeletePaymentCollectionsPaymentCollection"
 * summary: "Del a PaymentCollection"
 * description: "Deletes a Payment Collection"
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Payment Collection to delete.
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.paymentCollections.delete(payment_collection_id)
 *         .then(({ id, object, deleted }) => {
 *           console.log(id)
 *         })
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request DELETE 'https://medusa-url.com/admin/payment-collections/{id}' \
 *       --header 'Authorization: Bearer {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - PaymentCollection
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               description: The ID of the deleted Payment Collection.
 *             object:
 *               type: string
 *               description: The type of the object that was deleted.
 *               format: payment_collection
 *             deleted:
 *               type: boolean
 *               description: Whether or not the Payment Collection was deleted.
 *               default: true
 *   "400":
 *     $ref: "#/components/responses/400_error"
 *   "401":
 *     $ref: "#/components/responses/unauthorized"
 */
export default async (req, res) => {
  const { id } = req.params

  const paymentCollectionService: PaymentCollectionService = req.scope.resolve(
    "paymentCollectionService"
  )

  await paymentCollectionService.delete(id)

  res.status(200).json({ id, deleted: true, object: "payment_collection" })
}
