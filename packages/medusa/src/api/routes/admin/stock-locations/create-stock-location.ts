import {
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator"
import { Request, Response } from "express"
import { Transform, Type } from "class-transformer"

import { FindParams } from "../../../../types/common"
import { IStockLocationService } from "@medusajs/types"

/**
 * @oas [post] /admin/stock-locations
 * operationId: "PostStockLocations"
 * summary: "Create a Stock Location"
 * description: "Create a Stock Location."
 * x-authenticated: true
 * parameters:
 *   - (query) expand {string} Comma-separated relations that should be expanded in the returned stock location.
 *   - (query) fields {string} Comma-separated fields that should be included in the returned stock location.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminPostStockLocationsReq"
 * x-codegen:
 *   method: create
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.stockLocations.create({
 *         name: "Main Warehouse",
 *       })
 *       .then(({ stock_location }) => {
 *         console.log(stock_location.id);
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl -X POST '{backend_url}/admin/stock-locations' \
 *       -H 'x-medusa-access-token: {api_token}' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *           "name": "App"
 *       }'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * tags:
 *   - Stock Locations
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminStockLocationsRes"
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

  const createdStockLocation = await locationService.create(
    req.validatedBody as AdminPostStockLocationsReq
  )

  const stockLocation = await locationService.retrieve(
    createdStockLocation.id,
    req.retrieveConfig
  )

  res.status(200).json({ stock_location: stockLocation })
}

/**
 * @schema AdminPostStockLocationsReqAddress
 * type: object
 * required:
 *   - address_1
 *   - country_code
 * properties:
 *   address_1:
 *     type: string
 *     description: Stock location address
 *     example: 35, Jhon Doe Ave
 *   address_2:
 *     type: string
 *     description: Stock location address' complement
 *     example: apartment 4432
 *   company:
 *     type: string
 *     description: Stock location address' company
 *   city:
 *     type: string
 *     description: Stock location address' city
 *     example: Mexico city
 *   country_code:
 *     description: "The two character ISO code for the country."
 *     type: string
 *     externalDocs:
 *       url: https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2#Officially_assigned_code_elements
 *       description: See a list of codes.
 *   phone:
 *     type: string
 *     description: Stock location address' phone number
 *     example: +1 555 61646
 *   postal_code:
 *     type: string
 *     description: Stock location address' postal code
 *     example: HD3-1G8
 *   province:
 *     type: string
 *     description: Stock location address' province
 *     example: Sinaloa
 */
class StockLocationAddress {
  @IsString()
  address_1: string

  @IsOptional()
  @IsString()
  address_2?: string

  @IsOptional()
  @IsString()
  company?: string

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

/**
 * @schema AdminPostStockLocationsReq
 * type: object
 * required:
 *   - name
 * properties:
 *   name:
 *     description: the name of the stock location
 *     type: string
 *   address_id:
 *     description: the ID of an existing stock location address to associate with the stock location. Only required if `address` is not provided.
 *     type: string
 *   metadata:
 *     type: object
 *     description: An optional key-value map with additional details
 *     example: {car: "white"}
 *     externalDocs:
 *       description: "Learn about the metadata attribute, and how to delete and update it."
 *       url: "https://docs.medusajs.com/development/entities/overview#metadata-attribute"
 *   address:
 *     description: A new stock location address to create and associate with the stock location. Only required if `address_id` is not provided.
 *     $ref: "#/components/schemas/StockLocationAddressInput"
 */
export class AdminPostStockLocationsReq {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => value?.trim())
  name: string

  @IsOptional()
  @ValidateNested()
  @Type(() => StockLocationAddress)
  address?: StockLocationAddress

  @IsOptional()
  @IsString()
  address_id?: string

  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>
}

export class AdminPostStockLocationsParams extends FindParams {}
