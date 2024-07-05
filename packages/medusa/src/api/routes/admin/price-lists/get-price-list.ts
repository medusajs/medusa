import { defaultAdminPriceListFields, defaultAdminPriceListRelations } from "."
import { PriceList } from "../../../.."
import PriceListService from "../../../../services/price-list"

/**
 * @oas [get] /admin/price-lists/{id}
 * operationId: "GetPriceListsPriceList"
 * summary: "Get a Price List"
 * description: "Retrieve a Price List's details."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Price List.
 * x-codegen:
 *   method: retrieve
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.priceLists.retrieve(priceListId)
 *       .then(({ price_list }) => {
 *         console.log(price_list.id);
 *       })
 *   - lang: tsx
 *     label: Medusa React
 *     source: |
 *       import React from "react"
 *       import { useAdminPriceList } from "medusa-react"
 *
 *       type Props = {
 *         priceListId: string
 *       }
 *
 *       const PriceList = ({
 *         priceListId
 *       }: Props) => {
 *         const {
 *           price_list,
 *           isLoading,
 *         } = useAdminPriceList(priceListId)
 *
 *         return (
 *           <div>
 *             {isLoading && <span>Loading...</span>}
 *             {price_list && <span>{price_list.name}</span>}
 *           </div>
 *         )
 *       }
 *
 *       export default PriceList
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl '{backend_url}/admin/price-lists/{id}' \
 *       -H 'x-medusa-access-token: {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * tags:
 *   - Price Lists
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminPriceListRes"
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
  const { id } = req.params

  const priceListService: PriceListService =
    req.scope.resolve("priceListService")

  const priceList = await priceListService.retrieve(id, {
    select: defaultAdminPriceListFields as (keyof PriceList)[],
    relations: defaultAdminPriceListRelations,
  })

  res.status(200).json({ price_list: priceList })
}
