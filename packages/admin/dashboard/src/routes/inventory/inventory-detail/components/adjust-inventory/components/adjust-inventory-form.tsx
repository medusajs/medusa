import { zodResolver } from "@hookform/resolvers/zod"
import {
  AdminInventoryLevel,
  AdminStockLocation,
  HttpTypes,
} from "@medusajs/types"
import { Button, Input, Text, toast } from "@medusajs/ui"
import { useForm, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { z } from "zod"

import { Form } from "../../../../../../components/common/form"
import { RouteDrawer, useRouteModal } from "../../../../../../components/modals"
import { KeyboundForm } from "../../../../../../components/utilities/keybound-form"
import { useUpdateInventoryLevel } from "../../../../../../hooks/api/inventory"
import { castNumber } from "../../../../../../lib/cast-number"

type AdjustInventoryFormProps = {
  item: HttpTypes.AdminInventoryItem
  level: AdminInventoryLevel
  location: AdminStockLocation
}

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

export const AdjustInventoryForm = ({
  item,
  level,
  location,
}: AdjustInventoryFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const AdjustInventorySchema = z
    .object({
      stocked_quantity: z.union([z.number(), z.string()]),
    })
    .superRefine((data, ctx) => {
      const quantity = data.stocked_quantity
        ? castNumber(data.stocked_quantity)
        : null

      if (quantity === null) {
        ctx.addIssue({
          code: z.ZodIssueCode.invalid_type,
          expected: "number",
          received: "undefined",
          path: ["stocked_quantity"],
        })

        return
      }

      if (quantity < level.reserved_quantity) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("inventory.adjustInventory.errors.stockedQuantity", {
            quantity: level.reserved_quantity,
          }),
          path: ["stocked_quantity"],
        })
      }
    })

  const form = useForm<z.infer<typeof AdjustInventorySchema>>({
    defaultValues: {
      stocked_quantity: level.stocked_quantity,
    },
    resolver: zodResolver(AdjustInventorySchema),
  })

  const stockedQuantityUpdate = useWatch({
    control: form.control,
    name: "stocked_quantity",
  })

  const availableQuantity = stockedQuantityUpdate
    ? castNumber(stockedQuantityUpdate) - level.reserved_quantity
    : 0 - level.reserved_quantity

  const { mutateAsync, isPending: isLoading } = useUpdateInventoryLevel(
    item.id,
    level.location_id
  )

  const handleSubmit = form.handleSubmit(async (value) => {
    await mutateAsync(
      {
        stocked_quantity: castNumber(value.stocked_quantity),
      },
      {
        onSuccess: () => {
          toast.success(t("inventory.toast.updateLevel"))
          handleSuccess()
        },
        onError: (e) => {
          toast.error(e.message)
        },
      }
    )
  })

  return (
    <RouteDrawer.Form form={form}>
      <KeyboundForm
        onSubmit={handleSubmit}
        className="flex flex-1 flex-col overflow-hidden"
      >
        <RouteDrawer.Body className="flex flex-1 flex-col gap-y-8 overflow-auto">
          <div className="text-ui-fg-subtle shadow-elevation-card-rest grid grid-rows-4 divide-y rounded-lg border">
            <AttributeGridRow
              title={t("fields.title")}
              value={item.title ?? "-"}
            />
            <AttributeGridRow title={t("fields.sku")} value={item.sku!} />
            <AttributeGridRow
              title={t("locations.domain")}
              value={location.name}
            />
            <AttributeGridRow
              title={t("inventory.reserved")}
              value={level.reserved_quantity}
            />
            <AttributeGridRow
              title={t("inventory.available")}
              value={availableQuantity}
            />
          </div>
          <Form.Field
            control={form.control}
            name="stocked_quantity"
            render={({ field: { onChange, value, ...field } }) => {
              return (
                <Form.Item>
                  <Form.Label>{t("fields.inStock")}</Form.Label>
                  <Form.Control>
                    <Input
                      type="number"
                      value={value}
                      onChange={onChange}
                      {...field}
                    />
                  </Form.Control>
                  <Form.ErrorMessage />
                </Form.Item>
              )
            }}
          />
        </RouteDrawer.Body>
        <RouteDrawer.Footer>
          <div className="flex items-center justify-end gap-x-2">
            <RouteDrawer.Close asChild>
              <Button variant="secondary" size="small">
                {t("actions.cancel")}
              </Button>
            </RouteDrawer.Close>
            <Button type="submit" size="small" isLoading={isLoading}>
              {t("actions.save")}
            </Button>
          </div>
        </RouteDrawer.Footer>
      </KeyboundForm>
    </RouteDrawer.Form>
  )
}
