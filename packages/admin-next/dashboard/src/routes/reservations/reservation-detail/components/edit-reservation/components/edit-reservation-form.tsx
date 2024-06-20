import * as zod from "zod"

import { Button, Input, Select, Text, Textarea, toast } from "@medusajs/ui"
import { InventoryTypes, StockLocationDTO } from "@medusajs/types"
import {
  RouteDrawer,
  useRouteModal,
} from "../../../../../../components/route-modal"

import { Form } from "../../../../../../components/common/form"
import { InventoryItemRes } from "../../../../../../types/api-responses"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useUpdateReservationItem } from "../../../../../../hooks/api/reservations"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

type EditReservationFormProps = {
  reservation: InventoryTypes.ReservationItemDTO
  locations: StockLocationDTO[]
  item: InventoryItemRes["inventory_item"]
}

const EditReservationSchema = z.object({
  location_id: z.string(),
  description: z.string().optional(),
  quantity: z.number().min(1),
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

const getDefaultValues = (reservation: InventoryTypes.ReservationItemDTO) => {
  return {
    quantity: reservation.quantity,
    location_id: reservation.location_id,
    description: reservation.description ?? undefined,
  }
}

export const EditReservationForm = ({
  reservation,
  item,
  locations,
}: EditReservationFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<zod.infer<typeof EditReservationSchema>>({
    defaultValues: getDefaultValues(reservation),
    resolver: zodResolver(EditReservationSchema),
  })

  const { mutateAsync } = useUpdateReservationItem(reservation.id)

  const handleSubmit = form.handleSubmit(async (values) => {
    mutateAsync(values as any, {
      onSuccess: () => {
        handleSuccess()
        toast.success(t("general.success"), {
          dismissLabel: t("actions.close"),
          description: t("inventory.reservation.updateSuccessToast"),
        })
      },
    })
  })

  const reservedQuantity = form.watch("quantity")
  const locationId = form.watch("location_id")

  const level = item.location_levels!.find(
    (level: InventoryTypes.InventoryLevelDTO) =>
      level.location_id === locationId
  )

  return (
    <RouteDrawer.Form form={form}>
      <form
        onSubmit={handleSubmit}
        className="flex flex-1 flex-col overflow-hidden"
      >
        <RouteDrawer.Body className="flex flex-1 flex-col gap-y-8 overflow-auto">
          <Form.Field
            control={form.control}
            name="location_id"
            render={({ field: { onChange, value, ref, ...field } }) => {
              return (
                <Form.Item>
                  <Form.Label>{t("inventory.reservation.location")}</Form.Label>
                  <Form.Control>
                    <Select
                      value={value}
                      onValueChange={(v) => {
                        onChange(v)
                      }}
                      {...field}
                    >
                      <Select.Trigger ref={ref}>
                        <Select.Value />
                      </Select.Trigger>
                      <Select.Content>
                        {(locations || []).map((r) => (
                          <Select.Item key={r.id} value={r.id}>
                            {r.name}
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
          <div className="text-ui-fg-subtle shadow-elevation-card-rest grid grid-rows-4 divide-y rounded-lg border">
            <AttributeGridRow
              title={t("fields.title")}
              value={item.title ?? item.sku!}
            />
            <AttributeGridRow title={t("fields.sku")} value={item.sku!} />
            <AttributeGridRow
              title={t("fields.inStock")}
              value={level!.stocked_quantity}
            />
            <AttributeGridRow
              title={t("inventory.available")}
              value={level!.stocked_quantity - reservedQuantity}
            />
          </div>
          <Form.Field
            control={form.control}
            name="quantity"
            render={({ field: { onChange, value, ...field } }) => {
              return (
                <Form.Item>
                  <Form.Label>
                    {t("inventory.reservation.reservedAmount")}
                  </Form.Label>
                  <Form.Control>
                    <Input
                      type="number"
                      min={0}
                      max={level!.available_quantity + reservation.quantity}
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
          <Form.Field
            control={form.control}
            name="description"
            render={({ field }) => {
              return (
                <Form.Item>
                  <Form.Label optional>{t("fields.description")}</Form.Label>
                  <Form.Control>
                    <Textarea {...field} />
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
            <Button type="submit" size="small" isLoading={false}>
              {t("actions.save")}
            </Button>
          </div>
        </RouteDrawer.Footer>
      </form>
    </RouteDrawer.Form>
  )
}
