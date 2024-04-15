import * as zod from "zod"

import { Button, Text } from "@medusajs/ui"
import {
  RouteDrawer,
  useRouteModal,
} from "../../../../../../components/route-modal"

import { InventoryNext } from "@medusajs/types"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useUpdateInventoryItem } from "../../../../../../hooks/api/inventory"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

type EditReservationFormProps = {
  reservation: InventoryNext.ReservationItemDTO
}

const EditReservationSchema = z.object({
  location_id: z.string(),
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

const getDefaultValues = (reservation: InventoryNext.ReservationItemDTO) => {
  return {
    quantity: reservation.quantity,
    location_id: reservation.location_id,
  }
}

export const EditReservationForm = ({
  reservation,
}: EditReservationFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<zod.infer<typeof EditReservationSchema>>({
    defaultValues: getDefaultValues(reservation),
    resolver: zodResolver(EditReservationSchema),
  })

  const { mutateAsync } = useUpdateInventoryItem(reservation.id)

  const handleSubmit = form.handleSubmit(async (values) => {
    mutateAsync(values as any, {
      onSuccess: () => {
        handleSuccess()
      },
    })
  })

  console.warn(reservation)
  return (
    <RouteDrawer.Form form={form}>
      <form
        onSubmit={handleSubmit}
        className="flex flex-1 flex-col overflow-hidden"
      >
        <RouteDrawer.Body className="flex flex-1 flex-col gap-y-8 overflow-auto">
          <div className="text-ui-fg-subtle shadow-elevation-card-rest grid grid-rows-4 divide-y rounded-lg border">
            {/* <AttributeGridRow
              title={t("fields.title")}
              value={
                reservation.inventory_item.title ??
                reservation.inventory_item.sku
              }
            /> */}
            {/* <AttributeGridRow title={t("fields.sku")} value={item.sku!} />
            <AttributeGridRow
              title={t("fields.sku")}
              value={reservation.inventory_item.sku}
            />
            <AttributeGridRow
              title={t("inventory.reserved")}
              value={item.reserved_quantity}
            />
            <AttributeGridRow
              title={t("inventory.available")}
              value={stockedQuantityUpdate - item.reserved_quantity}
            /> */}
          </div>
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
