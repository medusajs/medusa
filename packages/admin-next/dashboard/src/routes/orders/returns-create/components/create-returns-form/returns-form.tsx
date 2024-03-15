import React, { useEffect, useMemo, useState } from "react"
import { UseFormReturn } from "react-hook-form"
import {
  AdminGetVariantsVariantInventoryRes,
  LineItem,
  Order,
} from "@medusajs/medusa"
import { Alert, Heading, Select, Text } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useAdminShippingOptions, useAdminStockLocations } from "medusa-react"
import { LevelWithAvailability } from "@medusajs/medusa"

import { ReturnItem } from "./return-item"
import { Form } from "../../../../../components/common/form"

import { medusa } from "../../../../../lib/medusa"

type ReturnsFormProps = {
  form: UseFormReturn<any>
  items: LineItem[] // Items selected for return
  order: Order
}

export function ReturnsForm({ form, items, order }: ReturnsFormProps) {
  const { t } = useTranslation()

  const [inventoryMap, setInventoryMap] = useState<
    Record<string, LevelWithAvailability[]>
  >({})

  const { shipping_options = [] } = useAdminShippingOptions({
    region_id: order.region_id,
    is_return: true,
  })

  const { stock_locations = [] } = useAdminStockLocations({})

  useEffect(() => {
    const getInventoryMap = async () => {
      const ret: Record<string, LevelWithAvailability[]> = {}

      if (!items.length) {
        return ret
      }

      ;(
        await Promise.all(
          items.map(async (item) => {
            if (!item.variant_id) {
              return undefined
            }
            return await medusa.admin.variants.getInventory(item.variant_id)
          })
        )
      )
        .filter((it) => it?.variant)
        .forEach((item) => {
          const { variant } = item as AdminGetVariantsVariantInventoryRes
          ret[variant.id] = variant.inventory[0]?.location_levels
        })

      return ret
    }

    getInventoryMap().then((map) => {
      setInventoryMap(map)
    })
  }, [items])

  const selectedLocation = form.watch("location")

  const showLevelsWarning = useMemo(() => {
    if (!selectedLocation) {
      return false
    }

    const allItemsHaveLocation = items
      .map((item) => {
        if (!item?.variant_id) {
          return true
        }
        return inventoryMap[item.variant_id]?.find(
          (l) => l.location_id === selectedLocation
        )
      })
      .every(Boolean)

    return !allItemsHaveLocation
  }, [items, inventoryMap, selectedLocation])

  const onQuantityChangeComplete = () => {}

  return (
    <div className="flex size-full flex-col items-center overflow-auto p-16">
      <div className="flex w-full max-w-[736px] flex-col justify-center px-2 pb-2">
        <div className="flex flex-col gap-y-1 pb-10">
          <Heading className="text-2xl">{t("fields.details")}</Heading>
        </div>
        <Heading className="mb-2">{t("orders.refunds.chooseItems")}</Heading>
        {items.map((item) => (
          <ReturnItem
            item={item}
            form={form}
            currencyCode={order.currency_code}
            onQuantityChangeComplete={onQuantityChangeComplete}
          />
        ))}

        <div className="flex flex-col gap-y-1 pb-4 pt-10">
          <Heading className="text-2xl">{t("fields.shipping")}</Heading>
        </div>

        <div className="flex gap-x-4">
          <div className="flex-1">
            <Heading level="h3">{t("fields.location")}</Heading>
            <Text className="text-ui-fg-subtle mb-1">
              {t("order.refunds.locationDescription")}
            </Text>
            <Form.Field
              control={form.control}
              name="location"
              render={({ field: { onChange, ref, ...field } }) => {
                return (
                  <Form.Item>
                    <Form.Control>
                      <Select onValueChange={onChange} {...field}>
                        <Select.Trigger className="bg-ui-bg-base" ref={ref}>
                          <Select.Value />
                        </Select.Trigger>
                        <Select.Content>
                          {stock_locations.map((l) => (
                            <Select.Item key={l.id} value={l.name}>
                              {l.name}
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select>
                    </Form.Control>
                    <Form.ErrorMessage />
                  </Form.Item>
                )
              }}
            />
          </div>
          <div className="flex-1">
            <Heading level="h3">{t("fields.shipping")}</Heading>
            <Text className="text-ui-fg-subtle mb-1">
              {t("order.refunds.shippingDescription")}
            </Text>
            <Form.Field
              control={form.control}
              name="shipping"
              render={({ field: { onChange, ref, ...field } }) => {
                return (
                  <Form.Item>
                    <Form.Control>
                      <Select onValueChange={onChange} {...field}>
                        <Select.Trigger className="bg-ui-bg-base" ref={ref}>
                          <Select.Value />
                        </Select.Trigger>
                        <Select.Content>
                          {shipping_options.map((o) => (
                            <Select.Item key={o.id} value={o.name}>
                              {o.name}
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select>
                    </Form.Control>
                    <Form.ErrorMessage />
                  </Form.Item>
                )
              }}
            />
          </div>
        </div>
        {showLevelsWarning && (
          <Alert variant="warning" dismissible className="mt-4 p-5">
            <div className="text-ui-fg-subtle txt-small pb-2 font-medium leading-[20px]">
              {t("orders.returns.noInventoryLevel")}
            </div>
            <Text className="text-ui-fg-subtle txt-small leading-normal">
              {t("orders.returns.noInventoryLevelDesc")}
            </Text>
          </Alert>
        )}
      </div>
    </div>
  )
}
