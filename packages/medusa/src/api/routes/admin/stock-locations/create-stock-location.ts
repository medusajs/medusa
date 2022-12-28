import { Request, Response } from "express"
import { Type } from "class-transformer"
import { ValidateNested, IsOptional, IsString } from "class-validator"

import { IStockLocationService } from "../../../../interfaces"
import { FindParams } from "../../../../types/common"

/**
 * @oas [post] /stock-locations
 * operationId: "PostStockLocations"
 * summary: "Create a Stock Location"
 * description: "Creates a Stock Location."
 * x-authenticated: true
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminPostStockLocationsReq"
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.stockLocations.create({
 *         name: 'Main Warehouse',
 *         location_id: 'sloc'
 *       })
 *       .then(({ stock_location }) => {
 *         console.log(stock_location.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request POST 'https://medusa-url.com/admin/stock-locations' \
 *       --header 'Authorization: Bearer {api_token}' \
 *       --header 'Content-Type: application/json' \
 *       --data-raw '{
 *           "name": "App"
 *       }'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - Stock Location
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *             stock_location:
 *               $ref: "#/components/schemas/StockLocationDTO"
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
export default async (req: Request, res: Response) => {
  const locationService: IStockLocationService = req.scope.resolve(
    "stockLocationService"
  )

  const stockLocation = await locationService.create(
    req.validatedBody as AdminPostStockLocationsReq
  )

  res.status(200).json({ stock_location: stockLocation })
}

class StockLocationAddress {
  @IsString()
  address_1: string

  @IsOptional()
  @IsString()
  address_2?: string

  @IsOptional()
  @IsString()
  city?: string

  @IsString()
  country_code: string

  @IsOptional()
  @IsString()
  phone?: string

  @IsOptional()
  @IsString()
  postal_code?: string

  @IsOptional()
  @IsString()
  province?: string
}

export class AdminPostStockLocationsReq {
  @IsString()
  name: string

  @IsOptional()
  @ValidateNested()
  @Type(() => StockLocationAddress)
  address?: StockLocationAddress
}

export class AdminPostStockLocationsParams extends FindParams {}
