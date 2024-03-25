import {
  DateComparisonOperator,
  FindParams,
  NumericalComparisonOperator,
  StringComparisonOperator,
  extendedFindParamsMixin,
} from "../../../types/common"
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator"
import { Transform, Type } from "class-transformer"

import { IsType } from "../../../utils"

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
 * description: "The details of the stock location to create."
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

export class AdminGetStockLocationsLocationParams extends FindParams {}
