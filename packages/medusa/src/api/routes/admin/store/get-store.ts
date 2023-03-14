import { FulfillmentProvider, PaymentProvider, Store } from "../../../../models"
import {
  FulfillmentProviderService,
  PaymentProviderService,
  StoreService,
} from "../../../../services"
import { FeatureFlagsResponse } from "../../../../types/feature-flags"
import { ModulesResponse } from "../../../../types/modules"
import { FlagRouter } from "../../../../utils/flag-router"
import { ModulesHelper } from "../../../../utils/module-helper"

/**
 * @oas [get] /store
 * operationId: "GetStore"
 * summary: "Get Store details"
 * description: "Retrieves the Store details"
 * x-authenticated: true
 * x-codegen:
 *   method: retrieve
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.store.retrieve()
 *       .then(({ store }) => {
 *         console.log(store.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request GET 'https://medusa-url.com/admin/store' \
 *       --header 'Authorization: Bearer {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - Store
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminStoresRes"
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
  const storeService: StoreService = req.scope.resolve("storeService")

  const featureFlagRouter: FlagRouter = req.scope.resolve("featureFlagRouter")
  const modulesHelper: ModulesHelper = req.scope.resolve("modulesHelper")

  const paymentProviderService: PaymentProviderService = req.scope.resolve(
    "paymentProviderService"
  )
  const fulfillmentProviderService: FulfillmentProviderService =
    req.scope.resolve("fulfillmentProviderService")

  const relations = ["currencies", "default_currency"]
  if (featureFlagRouter.isFeatureEnabled("sales_channels")) {
    relations.push("default_sales_channel")
  }

  const data = (await storeService.retrieve({
    relations,
  })) as Store & {
    payment_providers: PaymentProvider[]
    fulfillment_providers: FulfillmentProvider[]
    feature_flags: FeatureFlagsResponse
    modules: ModulesResponse
  }

  data.feature_flags = featureFlagRouter.listFlags()
  data.modules = modulesHelper.modules

  const paymentProviders = await paymentProviderService.list()
  const fulfillmentProviders = await fulfillmentProviderService.list()

  data.payment_providers = paymentProviders
  data.fulfillment_providers = fulfillmentProviders

  res.status(200).json({ store: data })
}
