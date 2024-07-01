import { zodResolver } from "@hookform/resolvers/zod"
import * as zod from "zod"

import { HttpTypes, InventoryLevelDTO, StockLocationDTO } from "@medusajs/types"
import { Button, Input, Text, toast } from "@medusajs/ui"
import {
  RouteDrawer,
  useRouteModal,
} from "../../../../../../components/modals"

import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { Form } from "../../../../../../components/common/form"
import { useUpdateInventoryLevel } from "../../../../../../hooks/api/inventory"

type AdjustInventoryFormProps = {
  item: HttpTypes.AdminInventoryItem
  level: InventoryLevelDTO
  location: StockLocationDTO
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

  const AdjustInventorySchema = zod.object({
    stocked_quantity: zod.number().min(level.reserved_quantity),
  })

  const form = useForm<zod.infer<typeof AdjustInventorySchema>>({
    defaultValues: {
      stocked_quantity: level.stocked_quantity,
    },
    resolver: zodResolver(AdjustInventorySchema),
  })

  const stockedQuantityUpdate = form.watch("stocked_quantity")

  const { mutateAsync, isPending: isLoading } = useUpdateInventoryLevel(
    item.id,
    level.location_id
  )

  const handleSubmit = form.handleSubmit(async (value) => {
    if (value.stocked_quantity === level.stocked_quantity) {
      return handleSuccess()
    }

    try {
      await mutateAsync({
        stocked_quantity: value.stocked_quantity,
      })

      toast.success(t("general.success"), {
        description: t("inventory.toast.updateLevel"),
        dismissLabel: t("actions.close"),
      })
    } catch (e) {
      toast.error(t("general.error"), {
        description: e.message,
        dismissLabel: t("actions.close"),
      })
    }

    return handleSuccess()
  })

  return (
    <RouteDrawer.Form form={form}>
      <form
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
              value={stockedQuantityUpdate - level.reserved_quantity}
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
                      min={level.reserved_quantity}
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
      </form>
    </RouteDrawer.Form>
  )
}
