import { StringComparisonOperator } from "./common"

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
  id?: string
  address_1: string
  address_2?: string | null
  company?: string | null
  country_code: string
  city?: string | null
  phone?: string | null
  postal_code?: string | null
  province?: string | null
  metadata?: Record<string, unknown> | null
  created_at: string | Date
  updated_at: string | Date
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
  id: string
  name: string
  metadata: Record<string, unknown> | null
  address_id: string
  address?: StockLocationAddressDTO
  created_at: string | Date
  updated_at: string | Date
  deleted_at: string | Date | null
}

export type FilterableStockLocationProps = {
  id?: string | string[]
  name?: string | string[] | StringComparisonOperator
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
  address_1: string
  address_2?: string
  country_code: string
  city?: string
  phone?: string
  province?: string
  postal_code?: string
  metadata?: Record<string, unknown>
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
  name: string
  address_id?: string
  address?: string | StockLocationAddressInput
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
  name?: string
  address_id?: string
  address?: StockLocationAddressInput
  metadata?: Record<string, unknown>
}
