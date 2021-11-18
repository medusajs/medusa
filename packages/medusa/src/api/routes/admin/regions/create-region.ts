import { IsArray, IsNumber, IsOptional, IsString } from "class-validator"
import { defaultAdminRegionRelations, defaultAdminRegionFields } from "."
import { validator } from "../../../../utils/validator"
import { Region } from "../../../.."
import RegionService from "../../../../services/region"
/**
 * @oas [post] /regions
 * operationId: "PostRegions"
 * summary: "Create a Region"
 * description: "Creates a Region"
 * x-authenticated: true
 * requestBody:
 *   content:
 *     application/json:
 *       required:
 *         - name
 *         - currency_code
 *         - tax_rate
 *       schema:
 *         properties:
 *           name:
 *             description: "The name of the Region"
 *             type: string
 *           currency_code:
 *             description: "The 3 character ISO currency code to use for the Region."
 *             type: string
 *           tax_code:
 *             description: "An optional tax code the Region."
 *             type: string
 *           tax_rate:
 *             description: "The tax rate to use on Orders in the Region."
 *             type: number
 *           payment_providers:
 *             description: "A list of Payment Providers that should be enabled for the Region"
 *             type: array
 *             items:
 *               type: string
 *           fulfillment_providers:
 *             description: "A list of Fulfillment Providers that should be enabled for the Region"
 *             type: array
 *             items:
 *               type: string
 *           countries:
 *             description: "A list of countries that should be included in the Region."
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
  const result: Region = await regionService.create(validated)

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
