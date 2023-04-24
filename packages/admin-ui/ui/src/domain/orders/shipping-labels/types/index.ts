import { ReactNode } from "react"

export type ShippingPackageItemsQuantityMap = { [key: string]: number }

export interface ShippingPackageItem {
  id: string
  weight: number
  quantity: number
}

export interface ShippingPackage {
  id: string
  name: string
  length: number
  width: number
  height: number
  weight: number
}

export interface ShippingPackageOption {
  label: ReactNode
  value: string
}
