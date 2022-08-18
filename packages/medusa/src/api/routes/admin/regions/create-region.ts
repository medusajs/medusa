import { IsArray, IsNumber, IsOptional, IsString } from "class-validator"
import { defaultAdminRegionFields, defaultAdminRegionRelations } from "."

import { EntityManager } from "typeorm"
import { Region } from "../../../.."
import RegionService from "../../../../services/region"
import { validator } from "../../../../utils/validator"

/**
 * @oas [post] /regions
 * operationId: "PostRegions"
 * summary: "Create a Region"
 * description: "Creates a Region"
 * x-authenticated: true
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         required:
 *           - name
 *           - currency_code
 *           - tax_rate
 *           - payment_providers
 *           - fulfillment_providers
 *           - countries
 *         properties:
 *           name:
 *             description: "The name of the Region"
 *             type: string
 *           currency_code:
 *             description: "The 3 character ISO currency code to use for the Region."
 *             type: string
 *             externalDocs:
 *               url: https://en.wikipedia.org/wiki/ISO_4217#Active_codes
 *               description: See a list of codes.
 *           tax_code:
 *             description: "An optional tax code the Region."
 *             type: string
 *           tax_rate:
 *             description: "The tax rate to use on Orders in the Region."
 *             type: number
 *           payment_providers:
 *             description: "A list of Payment Provider IDs that should be enabled for the Region"
 *             type: array
 *             items:
 *               type: string
 *           fulfillment_providers:
 *             description: "A list of Fulfillment Provider IDs that should be enabled for the Region"
 *             type: array
 *             items:
 *               type: string
 *           countries:
 *             description: "A list of countries' 2 ISO Characters that should be included in the Region."
 *             example: ["US"]
 *             type: array
 *             items:
 *               type: string
 * tags:
 *   - Region
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             region:
 *               $ref: "#/components/schemas/region"
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
}
