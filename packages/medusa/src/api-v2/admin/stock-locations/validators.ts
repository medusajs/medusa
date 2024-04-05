import { Transform, Type } from "class-transformer"
import {
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator"
import { FindParams, extendedFindParamsMixin } from "../../../types/common"

import { z } from "zod"
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
class StockLocationCreateAddress {
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
  @Type(() => StockLocationCreateAddress)
  address?: StockLocationCreateAddress

  @IsOptional()
  @IsString()
  address_id?: string

  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>
}

export class AdminPostStockLocationsParams extends FindParams {}

/**
 * Parameters used to filter and configure the pagination of the retrieved stock locations.
 */
export class AdminGetStockLocationsParams extends extendedFindParamsMixin({
  limit: 20,
  offset: 0,
}) {
  /**
   * Search term to search stock location names.
   */
  @IsString()
  @IsOptional()
  q?: string

  /**
   * IDs to filter stock locations by.
   */
  @IsOptional()
  @IsType([String, [String]])
  id?: string | string[]

  /**
   * Names to filter stock locations by.
   */
  @IsOptional()
  @IsType([String, [String]])
  name?: string | string[]

  /**
   * Filter stock locations by the ID of their associated addresses.
   */
  @IsOptional()
  @IsType([String, [String]])
  address_id?: string | string[]

  /**
   * Filter stock locations by the ID of their associated sales channels.
   */
  @IsOptional()
  @IsType([String, [String]])
  sales_channel_id?: string | string[]

  /**
   * The field to sort the data by. By default, the sort order is ascending. To change the order to descending, prefix the field name with `-`.
   */
  @IsString()
  @IsOptional()
  order?: string
}
/**
 * The attributes of a stock location address to create or update.
 */
class StockLocationUpdateAddress {
  /**
   * First line address.
   */
  @IsString()
  address_1: string

  /**
   * Second line address.
   */
  @IsOptional()
  @IsString()
  address_2?: string

  /**
   * Company.
   */
  @IsOptional()
  @IsString()
  company?: string

  /**
   * City.
   */
  @IsOptional()
  @IsString()
  city?: string

  /**
   * Country code.
   */
  @IsString()
  country_code: string

  /**
   * Phone.
   */
  @IsOptional()
  @IsString()
  phone?: string

  /**
   * Postal code.
   */
  @IsOptional()
  @IsString()
  postal_code?: string

  /**
   * Province.
   */
  @IsOptional()
  @IsString()
  province?: string
}

/**
 * @schema AdminPostStockLocationsLocationReq
 * type: object
 * description: "The details to update of the stock location."
 * properties:
 *   name:
 *     description: the name of the stock location
 *     type: string
 *   address_id:
 *     description: the stock location address ID
 *     type: string
 *   metadata:
 *     type: object
 *     description: An optional key-value map with additional details
 *     example: {car: "white"}
 *     externalDocs:
 *       description: "Learn about the metadata attribute, and how to delete and update it."
 *       url: "https://docs.medusajs.com/development/entities/overview#metadata-attribute"
 *   address:
 *     description: The data of an associated address to create or update.
 *     $ref: "#/components/schemas/StockLocationAddressInput"
 */
export class AdminPostStockLocationsLocationReq {
  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @ValidateNested()
  @Type(() => StockLocationUpdateAddress)
  address?: StockLocationUpdateAddress

  @IsOptional()
  @IsString()
  address_id?: string

  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>
}

export class AdminPostStockLocationsLocationParams extends FindParams {}

export class AdminGetStockLocationsLocationParams extends FindParams {}

export class AdminStockLocationsLocationSalesChannelBatchReq {
  @IsString({ each: true })
  sales_channel_ids: string[]
}

export const AdminCreateStockLocationFulfillmentSet = z
  .object({
    name: z.string(),
    type: z.string(),
  })
  .strict()
