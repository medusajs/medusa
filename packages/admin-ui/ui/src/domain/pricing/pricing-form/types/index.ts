/* eslint-disable no-unused-vars */

import { BaseSyntheticEvent } from "react"
import { Option } from "../../../../types/shared"

interface BasePriceProps {
  id?: string
  amount: number
  variant_id: string
  min_quantity?: number
  max_quantity?: number
}

interface RegionPriceProps extends BasePriceProps {
  region_id: string
  currency_code?: never
}

interface CurrencyPriceProps extends BasePriceProps {
  currency_code: string
  region_id?: never
}

/**
 * @description Can have either a region_id or a currency_code, but not both.
 */
type PriceProps = RegionPriceProps | CurrencyPriceProps

export type PriceListFormValues = {
  name: string | null
  description: string | null
  starts_at: Date | null
  ends_at: Date | null
  customer_groups: Option[] | null
  type: PriceListType | null
  prices: PriceProps[] | null
  includes_tax: boolean
}

export type CreatePriceListPricesFormValues = {
  [k: string]: RegionPriceProps[] | CurrencyPriceProps[]
}

export type CreatePriceListFormValues = {
  name: string | null
  description: string | null
  starts_at: Date | null
  ends_at: Date | null
  customer_groups: Option[] | null
  type: PriceListType | null
  prices: CreatePriceListPricesFormValues | null
  includes_tax: boolean
}

export type ConfigurationField = keyof Pick<
  PriceListFormValues,
  "starts_at" | "ends_at" | "customer_groups"
>

export type ConfigurationFields = Pick<
  PriceListFormValues,
  "starts_at" | "ends_at" | "customer_groups"
>

export enum PriceListStatus {
  ACTIVE = "active",
  DRAFT = "draft",
}

export enum PriceListType {
  SALE = "sale",
  OVERRIDE = "override",
}

export enum ViewType {
  CREATE = "create",
  EDIT_DETAILS = "edit_details",
  EDIT_PRICES = "edit_prices",
}

interface BasePriceListFormProps {
  viewType: ViewType
}

interface CreatePriceListFormProps extends BasePriceListFormProps {
  viewType: ViewType.CREATE
  id?: never
}

interface EditPriceListFormProps extends BasePriceListFormProps {
  viewType: ViewType.EDIT_DETAILS | ViewType.EDIT_PRICES
  id: string
}

export type PriceListFormProps =
  | CreatePriceListFormProps
  | EditPriceListFormProps

export type HeaderAction = {
  label: string
  onClick:
    | (() => void)
    | ((e?: BaseSyntheticEvent<object, any, any> | undefined) => Promise<void>)
}
