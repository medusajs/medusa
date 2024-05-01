import * as zod from "zod"

import { Button, Input, toast } from "@medusajs/ui"
import {
  RouteDrawer,
  useRouteModal,
} from "../../../../../../components/route-modal"

import { Form } from "../../../../../../components/common/form"
import { InventoryNext } from "@medusajs/types"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useUpdateInventoryItem } from "../../../../../../hooks/api/inventory"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

type EditInventoryItemFormProps = {
  item: InventoryNext.InventoryItemDTO
}

const EditInventoryItemSchema = z.object({
  title: z.string().optional(),
  sku: z.string().min(1),
})

const getDefaultValues = (item: InventoryNext.InventoryItemDTO) => {
  return {
    title: item.title ?? undefined,
    sku: item.sku ?? undefined,
  }
}

export const EditInventoryItemForm = ({ item }: EditInventoryItemFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<zod.infer<typeof EditInventoryItemSchema>>({
    defaultValues: getDefaultValues(item),
    resolver: zodResolver(EditInventoryItemSchema),
  })

  const { mutateAsync, isPending: isLoading } = useUpdateInventoryItem(item.id)

  const handleSubmit = form.handleSubmit(async (values) => {
    mutateAsync(values as any, {
      onSuccess: () => {
        toast.success(t("general.success"), {
          description: t("inventory.toast.update"),
          dismissLabel: t("actions.close"),
        })
        handleSuccess()
      },
      onError: (e) =>
        toast.error(t("general.error"), {
          description: e.message,
          dismissLabel: t("actions.close"),
        }),
    })
  })

  return (
    <RouteDrawer.Form form={form}>
      <form
        onSubmit={handleSubmit}
        className="flex flex-1 flex-col overflow-hidden"
      >
        <RouteDrawer.Body className="flex flex-1 flex-col gap-y-8 overflow-auto">
          <Form.Field
            control={form.control}
            name="title"
            render={({ field }) => {
              return (
                <Form.Item>
                  <Form.Label>{t("fields.title")}</Form.Label>
                  <Form.Control>
                    <Input {...field} />
                  </Form.Control>
                  <Form.ErrorMessage />
                </Form.Item>
              )
            }}
          />
          <Form.Field
            control={form.control}
            name="sku"
            render={({ field }) => {
              return (
                <Form.Item>
                  <Form.Label>{t("fields.sku")}</Form.Label>
                  <Form.Control>
                    <Input {...field} />
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
