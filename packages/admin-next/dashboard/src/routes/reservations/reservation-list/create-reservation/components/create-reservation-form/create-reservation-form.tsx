import * as zod from "zod"

import { Button, Heading, Input, Text, Textarea, toast } from "@medusajs/ui"
import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../../components/modals"

import { zodResolver } from "@hookform/resolvers/zod"
import { InventoryTypes } from "@medusajs/types"
import React from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { Form } from "../../../../../../components/common/form"
import { Combobox } from "../../../../../../components/inputs/combobox"
import { useInventoryItems } from "../../../../../../hooks/api/inventory"
import { useCreateReservationItem } from "../../../../../../hooks/api/reservations"
import { useStockLocations } from "../../../../../../hooks/api/stock-locations"
import { InventoryItemRes } from "../../../../../../types/api-responses"

export const CreateReservationSchema = zod.object({
  inventory_item_id: zod.string().min(1),
  location_id: zod.string().min(1),
  quantity: zod.number().min(1),
  description: zod.string().optional(),
})

const AttributeGridRow = ({
  title,
  value,
}: {
  title: string
  value: string | number
}) => {
  return (
    <div className="grid grid-cols-2 divide-x">
      <Text className="px-2 py-1.5" size="small" leading="compact">
        {title}
      </Text>
      <Text className="px-2 py-1.5" size="small" leading="compact">
        {value}
      </Text>
    </div>
  )
}

export const CreateReservationForm = (props: { inventoryItemId?: string }) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()
  const [inventorySearch, setInventorySearch] = React.useState<string | null>(
    null
  )

  const form = useForm<zod.infer<typeof CreateReservationSchema>>({
    defaultValues: {
      inventory_item_id: props.inventoryItemId || "",
      location_id: "",
      quantity: 0,
      description: "",
    },
    resolver: zodResolver(CreateReservationSchema),
  })

  const { inventory_items } = useInventoryItems({
    q: inventorySearch,
  })

  const inventoryItemId = form.watch("inventory_item_id")
  const selectedInventoryItem = inventory_items?.find(
    (it) => it.id === inventoryItemId
  ) as InventoryItemRes["inventory_item"] | undefined

  const locationId = form.watch("location_id")
  const selectedLocationLevel = selectedInventoryItem?.location_levels?.find(
    (it) => it.location_id === locationId
  )

  const quantity = form.watch("quantity")

  const { stock_locations } = useStockLocations(
    {
      id:
        selectedInventoryItem?.location_levels?.map(
          (level: InventoryTypes.InventoryLevelDTO) => level.location_id
        ) ?? [],
    },
    {
      enabled: !!selectedInventoryItem,
    }
  )

  const { mutateAsync, isPending } = useCreateReservationItem()

  const handleSubmit = form.handleSubmit(async (data) => {
    await mutateAsync(data, {
      onSuccess: ({ reservation }) => {
        toast.success(t("general.success"), {
          dismissLabel: t("actions.close"),
          description: t("inventory.reservation.successToast"),
        })
        handleSuccess(
          props.inventoryItemId
            ? `/inventory/${props.inventoryItemId}`
            : `/reservations/${reservation.id}`
        )
      },
    })
  })

  return (
    <RouteFocusModal.Form form={form}>
      <form onSubmit={handleSubmit}>
        <RouteFocusModal.Header>
          <div className="flex items-center justify-end gap-x-2">
            <RouteFocusModal.Close asChild>
              <Button variant="secondary" size="small">
                {t("actions.cancel")}
              </Button>
            </RouteFocusModal.Close>
            <Button
              type="submit"
              variant="primary"
              size="small"
              isLoading={isPending}
            >
              {t("actions.create")}
            </Button>
          </div>
        </RouteFocusModal.Header>
        <RouteFocusModal.Body className="flex flex-col items-center pt-[72px]">
          <div className="flex w-full max-w-[720px] flex-col gap-y-8">
            <Heading>{t("inventory.reservation.create")}</Heading>
            <div className="grid grid-cols-2 gap-4">
              <Form.Field
                key={"inventory_item_id"}
                control={form.control}
                name={"inventory_item_id"}
                render={({ field: { value, onChange, ...field } }) => {
                  return (
                    <Form.Item>
                      <Form.Label>
                        {t("inventory.reservation.itemToReserve")}
                      </Form.Label>
                      <Form.Control>
                        <Combobox
                          onSearchValueChange={(value: string) =>
                            setInventorySearch(value)
                          }
                          value={value}
                          onChange={(v) => {
                            onChange(v)
                          }}
                          {...field}
                          disabled={!!props.inventoryItemId}
                          options={(inventory_items ?? []).map(
                            (inventoryItem) => ({
                              label: inventoryItem.title ?? inventoryItem.sku!,
                              value: inventoryItem.id,
                            })
                          )}
                        />
                      </Form.Control>
                    </Form.Item>
                  )
                }}
              />
              <Form.Field
                key={"location_id"}
                control={form.control}
                name={"location_id"}
                render={({ field: { value, onChange, ...field } }) => {
                  return (
                    <Form.Item>
                      <Form.Label>{t("fields.location")}</Form.Label>
                      <Form.Control>
                        <Combobox
                          value={value}
                          onChange={(v) => {
                            onChange(v)
                          }}
                          {...field}
                          disabled={!inventoryItemId}
                          options={(stock_locations ?? []).map(
                            (stockLocation) => ({
                              label: stockLocation.name,
                              value: stockLocation.id,
                            })
                          )}
                        />
                      </Form.Control>
                    </Form.Item>
                  )
                }}
              />
            </div>
            <div className="text-ui-fg-subtle shadow-elevation-card-rest grid grid-rows-4 divide-y rounded-lg border">
              <AttributeGridRow
                title={t("fields.title")}
                value={
                  selectedInventoryItem?.title ??
                  selectedInventoryItem?.sku ??
                  "-"
                }
              />
              <AttributeGridRow
                title={t("fields.sku")}
                value={selectedInventoryItem?.sku ?? "-"}
              />
              <AttributeGridRow
                title={t("fields.inStock")}
                value={selectedLocationLevel?.stocked_quantity ?? "-"}
              />
              <AttributeGridRow
                title={t("inventory.available")}
                value={
                  selectedLocationLevel
                    ? selectedLocationLevel.available_quantity - (quantity || 0)
                    : "-"
                }
              />
            </div>
            <div className="w-full lg:w-1/2">
              <Form.Field
                control={form.control}
                name="quantity"
                render={({ field: { onChange, value, ...field } }) => {
                  return (
                    <Form.Item>
                      <Form.Label>{t("fields.quantity")}</Form.Label>
                      <Form.Control>
                        <Input
                          type="number"
                          placeholder={t(
                            "inventory.reservation.quantityPlaceholder"
                          )}
                          min={1}
                          max={
                            selectedLocationLevel
                              ? selectedLocationLevel.available_quantity
                              : 0
                          }
                          value={value || ""}
                          onChange={(e) => {
                            const value = e.target.value

                            if (value === "") {
                              onChange(null)
                            } else {
                              onChange(parseFloat(value))
                            }
                          }}
                          {...field}
                          disabled={!inventoryItemId || !locationId}
                        />
                      </Form.Control>
                      <Form.ErrorMessage />
                    </Form.Item>
                  )
                }}
              />
            </div>
            <Form.Field
              control={form.control}
              name="description"
              render={({ field }) => {
                return (
                  <Form.Item>
                    <Form.Label optional>{t("fields.description")}</Form.Label>
                    <Form.Control>
                      <Textarea
                        {...field}
                        disabled={!inventoryItemId || !locationId}
                        placeholder={t(
                          "inventory.reservation.descriptionPlaceholder"
                        )}
                      />
                    </Form.Control>
                    <Form.ErrorMessage />
                  </Form.Item>
                )
              }}
            />
          </div>
        </RouteFocusModal.Body>
      </form>
    </RouteFocusModal.Form>
  )
}
