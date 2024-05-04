import {
  shippingOptionsDefaultFields,
  shippingOptionsDefaultRelations,
} from "."

/**
 * @oas [get] /admin/shipping-options/{id}
 * operationId: "GetShippingOptionsOption"
 * summary: "Get a Shipping Option"
 * description: "Retrieve a Shipping Option's details."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Shipping Option.
 * x-codegen:
 *   method: retrieve
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.shippingOptions.retrieve(optionId)
 *       .then(({ shipping_option }) => {
 *         console.log(shipping_option.id);
 *       })
 *   - lang: tsx
 *     label: Medusa React
 *     source: |
 *       import React from "react"
 *       import { useAdminShippingOption } from "medusa-react"
 *
 *       type Props = {
 *         shippingOptionId: string
 *       }
 *
 *       const ShippingOption = ({ shippingOptionId }: Props) => {
 *         const {
 *           shipping_option,
 *           isLoading
 *         } = useAdminShippingOption(
 *           shippingOptionId
 *         )
 *
 *         return (
 *           <div>
 *             {isLoading && <span>Loading...</span>}
 *             {shipping_option && <span>{shipping_option.name}</span>}
 *           </div>
 *         )
 *       }
 *
 *       export default ShippingOption
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl '{backend_url}/admin/shipping-options/{id}' \
 *       -H 'x-medusa-access-token: {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * tags:
 *   - Shipping Options
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminShippingOptionsRes"
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
 */
export default async (req, res) => {
  const { option_id } = req.params
  const optionService = req.scope.resolve("shippingOptionService")

  const data = await optionService.retrieve(option_id, {
    select: shippingOptionsDefaultFields,
    relations: shippingOptionsDefaultRelations,
  })

  res.status(200).json({ shipping_option: data })
}
