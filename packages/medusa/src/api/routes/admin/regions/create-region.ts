import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from "class-validator"
import { EntityManager } from "typeorm"
import { defaultAdminRegionFields, defaultAdminRegionRelations } from "."
import { Region } from "../../../.."
import TaxInclusivePricingFeatureFlag from "../../../../loaders/feature-flags/tax-inclusive-pricing"
import RegionService from "../../../../services/region"
import { FeatureFlagDecorators } from "../../../../utils/feature-flag-decorators"
import { validator } from "../../../../utils/validator"

/**
 * @oas [post] /admin/regions
 * operationId: "PostRegions"
 * summary: "Create a Region"
 * description: "Creates a Region"
 * x-authenticated: true
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminPostRegionsReq"
 * x-codegen:
 *   method: create
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.regions.create({
 *         name: 'Europe',
 *         currency_code: 'eur',
 *         tax_rate: 0,
 *         payment_providers: [
 *           'manual'
 *         ],
 *         fulfillment_providers: [
 *           'manual'
 *         ],
 *         countries: [
 *           'DK'
 *         ]
 *       })
 *       .then(({ region }) => {
 *         console.log(region.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request POST 'https://medusa-url.com/admin/regions' \
 *       --header 'Authorization: Bearer {api_token}' \
 *       --header 'Content-Type: application/json' \
 *       --data-raw '{
 *           "name": "Europe",
 *           "currency_code": "eur",
 *           "tax_rate": 0,
 *           "payment_providers": [
 *             "manual"
 *           ],
 *           "fulfillment_providers": [
 *             "manual"
 *           ],
 *           "countries": [
 *             "DK"
 *           ]
 *       }'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - Regions
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminRegionsRes"
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
  const validated = await validator(AdminPostRegionsReq, req.body)

  const regionService: RegionService = req.scope.resolve("regionService")
  const manager: EntityManager = req.scope.resolve("manager")
  const result: Region = await manager.transaction(
    async (transactionManager) => {
      return await regionService
        .withTransaction(transactionManager)
        .create(validated)
    }
  )

  const region: Region = await regionService.retrieve(result.id, {
    select: defaultAdminRegionFields,
    relations: defaultAdminRegionRelations,
  })

  res.status(200).json({ region })
}

/**
 * @schema AdminPostRegionsReq
 * type: object
 * required:
 *   - name
 *   - currency_code
 *   - tax_rate
 *   - payment_providers
 *   - fulfillment_providers
 *   - countries
 * properties:
 *   name:
 *     description: "The name of the Region"
 *     type: string
 *   currency_code:
 *     description: "The 3 character ISO currency code to use for the Region."
 *     type: string
 *     externalDocs:
 *       url: https://en.wikipedia.org/wiki/ISO_4217#Active_codes
 *       description: See a list of codes.
 *   tax_code:
 *     description: "An optional tax code the Region."
 *     type: string
 *   tax_rate:
 *     description: "The tax rate to use on Orders in the Region."
 *     type: number
 *   payment_providers:
 *     description: "A list of Payment Provider IDs that should be enabled for the Region"
 *     type: array
 *     items:
 *       type: string
 *   fulfillment_providers:
 *     description: "A list of Fulfillment Provider IDs that should be enabled for the Region"
 *     type: array
 *     items:
 *       type: string
 *   countries:
 *     description: "A list of countries' 2 ISO Characters that should be included in the Region."
 *     example: ["US"]
 *     type: array
 *     items:
 *       type: string
 *   includes_tax:
 *     description: "[EXPERIMENTAL] Tax included in prices of region"
 *     type: boolean
 */
export class AdminPostRegionsReq {
  @IsString()
  name: string

  @IsString()
  currency_code: string

  @IsString()
  @IsOptional()
  tax_code?: string

  @IsNumber()
  tax_rate: number

  @IsArray()
  @IsString({ each: true })
  payment_providers: string[]

  @IsArray()
  @IsString({ each: true })
  fulfillment_providers: string[]

  @IsArray()
  @IsString({ each: true })
  countries: string[]

  @FeatureFlagDecorators(TaxInclusivePricingFeatureFlag.key, [
    IsOptional(),
    IsBoolean(),
  ])
  includes_tax?: boolean

  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>
}
