import { BaseFilterable, OperatorMap } from "../dal"
import { FulfillmentSetDTO } from "../fulfillment"

/**
 * @schema StockLocationAddressDTO
 * title: "Stock Location Address"
 * description: "Represents a Stock Location Address"
 * type: object
 * required:
 *   - address_1
 *   - country_code
 *   - created_at
 *   - updated_at
 * properties:
 *   id:
 *     type: string
 *     description: The stock location address' ID
 *     example: laddr_51G4ZW853Y6TFXWPG5ENJ81X42
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
 *     description: Stock location company' name
 *     example: Medusa
 *   city:
 *     type: string
 *     description: Stock location address' city
 *     example: Mexico city
 *   country_code:
 *     type: string
 *     description: Stock location address' country
 *     example: MX
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
 *   created_at:
 *     type: string
 *     description: "The date with timezone at which the resource was created."
 *     format: date-time
 *   updated_at:
 *     type: string
 *     description: "The date with timezone at which the resource was updated."
 *     format: date-time
 *   deleted_at:
 *     type: string
 *     description: "The date with timezone at which the resource was deleted."
 *     format: date-time
 *   metadata:
 *     type: object
 *     description: An optional key-value map with additional details
 *     example: {car: "white"}
 */
export type StockLocationAddressDTO = {
  /**
   * The ID of the stock location address.
   */
  id?: string

  /**
   * The address 1 of the stock location address.
   */
  address_1: string

  /**
   * The address 2 of the stock location address.
   */
  address_2?: string | null

  /**
   * The company of the stock location address.
   */
  company?: string | null

  /**
   * The country code of the stock location address.
   */
  country_code: string

  /**
   * The city of the stock location address.
   */
  city?: string | null

  /**
   * The phone of the stock location address.
   */
  phone?: string | null

  /**
   * The postal code of the stock location address.
   */
  postal_code?: string | null

  /**
   * The province of the stock location address.
   */
  province?: string | null

  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown> | null

  /**
   * The creation date of the stock location address.
   */
  created_at: string | Date

  /**
   * The update date of the stock location address.
   */
  updated_at: string | Date

  /**
   * The deletion date of the stock location address.
   */
  deleted_at: string | Date | null
}

/**
 * @schema StockLocationDTO
 * title: "Stock Location"
 * description: "Represents a Stock Location"
 * type: object
 * required:
 *   - id
 *   - name
 *   - address_id
 *   - created_at
 *   - updated_at
 * properties:
 *   id:
 *     type: string
 *     description: The stock location's ID
 *     example: sloc_51G4ZW853Y6TFXWPG5ENJ81X42
 *   address_id:
 *     type: string
 *     description: Stock location address' ID
 *     example: laddr_05B2ZE853Y6FTXWPW85NJ81A44
 *   name:
 *     type: string
 *     description: The name of the stock location
 *     example: Main Warehouse
 *   address:
 *     description: "The Address of the Stock Location"
 *     allOf:
 *       - $ref: "#/components/schemas/StockLocationAddressDTO"
 *       - type: object
 *   metadata:
 *     type: object
 *     description: An optional key-value map with additional details
 *     example: {car: "white"}
 *   created_at:
 *     type: string
 *     description: "The date with timezone at which the resource was created."
 *     format: date-time
 *   updated_at:
 *     type: string
 *     description: "The date with timezone at which the resource was updated."
 *     format: date-time
 *   deleted_at:
 *     type: string
 *     description: "The date with timezone at which the resource was deleted."
 *     format: date-time
 */
export type StockLocationDTO = {
  /**
   * The ID of the stock location.
   */
  id: string

  /**
   * The name of the stock location.
   */
  name: string

  /**
   * Holds custom data in key-value pairs.
   */
  metadata: Record<string, unknown> | null

  /**
   * The associated address's ID.
   */
  address_id: string

  /**
   * The address of the stock location.
   */
  address?: StockLocationAddressDTO

  /**
   * Fulfillment sets for the location
   */
  fulfillment_sets: FulfillmentSetDTO[]

  /**
   * The creation date of the stock location.
   */
  created_at: string | Date

  /**
   * The update date of the stock location.
   */
  updated_at: string | Date

  /**
   * The deletion date of the stock location.
   */
  deleted_at: string | Date | null
}

/**
 * @schema StockLocationExpandedDTO
 * allOf:
 *   - $ref: "#/components/schemas/StockLocationDTO"
 *   - type: object
 *     properties:
 *       sales_channels:
 *         description: "The associated sales channels."
 *         $ref: "#/components/schemas/SalesChannel"
 */
export type StockLocationExpandedDTO = StockLocationDTO & {
  /**
   * The list of sales channels.
   */
  sales_channels?: any[] // TODO: SalesChannel type
}

/**
 * @interface
 *
 * The filters to apply on the retrieved stock locations.
 */
export interface FilterableStockLocationProps
  extends BaseFilterable<FilterableStockLocationProps> {
  /**
   * Search parameter for stock location names
   */
  q?: string

  /**
   * The IDs to filter stock locations by.
   */
  id?: string | string[]

  /**
   * The names to filter stock locations by.
   */
  name?: string | string[] | OperatorMap<string>
}

/**
 * @schema StockLocationAddressInput
 * title: "Stock Location Address Input"
 * description: "Represents a Stock Location Address Input"
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
 *   city:
 *     type: string
 *     description: Stock location address' city
 *     example: Mexico city
 *   country_code:
 *     type: string
 *     description: Stock location address' country
 *     example: MX
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
 *   metadata:
 *     type: object
 *     description: An optional key-value map with additional details
 *     example: {car: "white"}
 */
export type StockLocationAddressInput = {
  /**
   * The first line of the stock location address.
   */
  address_1: string

  /**
   * The second line of the stock location address.
   */
  address_2?: string | null

  /**
   * The country code of the stock location address.
   */
  country_code: string

  /**
   * The city of the stock location address.
   */
  city?: string | null

  /**
   * The phone of the stock location address.
   */
  phone?: string | null

  /**
   * The province of the stock location address.
   */
  province?: string | null

  /**
   * The postal code of the stock location address.
   */
  postal_code?: string | null

  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown> | null
}

/**
 * @schema CreateStockLocationInput
 * title: "Create Stock Location Input"
 * description: "Represents the Input to create a Stock Location"
 * type: object
 * required:
 *   - name
 * properties:
 *   name:
 *     type: string
 *     description: The stock location name
 *   address_id:
 *     type: string
 *     description: The Stock location address ID
 *   address:
 *     description: Stock location address object
 *     allOf:
 *       - $ref: "#/components/schemas/StockLocationAddressInput"
 *       - type: object
 *   metadata:
 *     type: object
 *     description: An optional key-value map with additional details
 *     example: {car: "white"}
 */
export type CreateStockLocationInput = {
  /**
   * The name of the stock location.
   */
  name: string

  /**
   * The associated address's ID.
   */
  address_id?: string

  /**
   * The associated address.
   */
  address?: string | StockLocationAddressInput

  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown>
}

/**
 * @schema UpdateStockLocationInput
 * title: "Update Stock Location Input"
 * description: "Represents the Input to update a Stock Location"
 * type: object
 * properties:
 *   name:
 *     type: string
 *     description: The stock location name
 *   address_id:
 *     type: string
 *     description: The Stock location address ID
 *   address:
 *     description: Stock location address object
 *     allOf:
 *       - $ref: "#/components/schemas/StockLocationAddressInput"
 *       - type: object
 *   metadata:
 *     type: object
 *     description: An optional key-value map with additional details
 *     example: {car: "white"}
 */
export type UpdateStockLocationInput = {
  /**
   * The name of the stock location.
   */
  name?: string

  /**
   * The associated address's ID.
   */
  address_id?: string

  /**
   * The associated address's details.
   */
  address?: StockLocationAddressInput

  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown>
}

/**
 * @interface
 *
 * A stock location to create or update. If the `id` property isn't provided,
 * the stock location is created. In that case, the `name` property is required.
 */
export type UpsertStockLocationInput = Partial<UpdateStockLocationInput> & {
  /**
   * The ID of the stock location, if updating.
   */
  id?: string
}
