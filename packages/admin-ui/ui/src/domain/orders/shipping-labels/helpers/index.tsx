import { ClaimOrder, Order, Swap } from "@medusajs/medusa"
import React, { useMemo } from "react"
import { Package } from "../../../../hooks/admin/packages"
import {
  ShippingPackageItem,
  ShippingPackageItemsQuantityMap,
  ShippingPackageOption,
} from "../types"

export const useShippingDateOptions = () => {
  const nextSevenDays = getArrayOfNextSevenDays()
  const shippingDateOptions = useMemo(
    () =>
      nextSevenDays.map((date) => ({
        label: isToday(date)
          ? "Today"
          : date.toLocaleString("us", {
              weekday: "short",
              month: "short",
              day: "numeric",
            }),
        value: date.toISOString(),
      })),
    [nextSevenDays]
  )

  return shippingDateOptions
}

export const formatShippingPackageOption = (
  shippingPackage: Package
): ShippingPackageOption => {
  return {
    label: (
      <>
        {shippingPackage.package_name}{" "}
        <span className="text-gray-400">
          ({shippingPackage.length}x{shippingPackage.width}x
          {shippingPackage.height || 0}in, {shippingPackage.empty_weight || 0}
          oz)
        </span>
      </>
    ),
    value: shippingPackage.id,
  }
}

export const getPackageItems = (
  order: Order | ClaimOrder | Swap,
  itemIds: string[],
  quantities: ShippingPackageItemsQuantityMap
) => {
  const items = "items" in order ? order.items : order.additional_items

  return items
    .filter((item) => itemIds.includes(item.id) && quantities[item.id] > 0)
    .map((item) => ({
      id: item.id,
      weight: item.variant.weight,
      quantity: quantities[item.id],
    }))
}

export const calculatePackageWeight = (
  items: ShippingPackageItem[],
  shippingPackage?: Package
): number =>
  items.reduce((acc, item) => acc + item.quantity * item.weight, 0) +
  (shippingPackage?.empty_weight || 0)

export function getArrayOfNextSevenDays(): Date[] {
  const days: Date[] = []

  for (let i = 0; i < 8; i++) {
    const date = new Date()
    date.setDate(date.getDate() + i)
    days.push(date)
  }

  return days
}

export function isToday(date: Date): boolean {
  const today = new Date()

  return (
    date.getDate() == today.getDate() &&
    date.getMonth() == today.getMonth() &&
    date.getFullYear() == today.getFullYear()
  )
}
