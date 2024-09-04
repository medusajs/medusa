import * as zod from "zod"

import { Button, Input, toast } from "@medusajs/ui"
import { RouteDrawer, useRouteModal } from "../../../../../../components/modals"

import { zodResolver } from "@hookform/resolvers/zod"
import { InventoryTypes } from "@medusajs/types"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { z } from "zod"

import { Form } from "../../../../../../components/common/form"
import { CountrySelect } from "../../../../../../components/inputs/country-select"
import { useUpdateInventoryItem } from "../../../../../../hooks/api/inventory"

type EditInventoryItemAttributeFormProps = {
  item: InventoryTypes.InventoryItemDTO
}

const EditInventoryItemAttributesSchema = z.object({
  height: z.number().positive().optional(),
  width: z.number().positive().optional(),
  length: z.number().positive().optional(),
  weight: z.number().positive().optional(),
  mid_code: z.string().optional(),
  hs_code: z.string().optional(),
  origin_country: z.string().optional(),
})

const getDefaultValues = (item: InventoryTypes.InventoryItemDTO) => {
  return {
    height: item.height ?? undefined,
    width: item.width ?? undefined,
    length: item.length ?? undefined,
    weight: item.weight ?? undefined,
    mid_code: item.mid_code ?? undefined,
    hs_code: item.hs_code ?? undefined,
    origin_country: item.origin_country ?? undefined,
  }
}

export const EditInventoryItemAttributesForm = ({
  item,
}: EditInventoryItemAttributeFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<zod.infer<typeof EditInventoryItemAttributesSchema>>({
    defaultValues: getDefaultValues(item),
    resolver: zodResolver(EditInventoryItemAttributesSchema),
  })

  const { mutateAsync, isPending: isLoading } = useUpdateInventoryItem(item.id)

  const handleSubmit = form.handleSubmit(async (values) => {
    await mutateAsync(values, {
      onSuccess: () => {
        toast.success(t("inventory.toast.updateItem"))
        handleSuccess()
      },
      onError: (error) => toast.error(error.message),
    })
  })

  return (
    <RouteDrawer.Form form={form}>
      <form
        onSubmit={handleSubmit}
        className="flex flex-1 flex-col overflow-hidden"
      >
        <RouteDrawer.Body className="flex flex-1 flex-col gap-y-4 overflow-auto">
          <Form.Field
            control={form.control}
            name="height"
            render={({ field: { onChange, value, ...field } }) => {
              return (
                <Form.Item>
                  <Form.Label optional>{t("fields.height")}</Form.Label>
                  <Form.Control>
                    <Input
                      type="number"
                      min={0}
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
            name="width"
            render={({ field: { onChange, value, ...field } }) => {
              return (
                <Form.Item>
                  <Form.Label optional>{t("fields.width")}</Form.Label>
                  <Form.Control>
                    <Input
                      type="number"
                      min={0}
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
            name="length"
            render={({ field: { onChange, value, ...field } }) => {
              return (
                <Form.Item>
                  <Form.Label optional>{t("fields.length")}</Form.Label>
                  <Form.Control>
                    <Input
                      type="number"
                      min={0}
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
            name="weight"
            render={({ field: { onChange, value, ...field } }) => {
              return (
                <Form.Item>
                  <Form.Label optional>{t("fields.weight")}</Form.Label>
                  <Form.Control>
                    <Input
                      type="number"
                      min={0}
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
            name="mid_code"
            render={({ field }) => {
              return (
                <Form.Item>
                  <Form.Label optional>{t("fields.midCode")}</Form.Label>
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
            name="hs_code"
            render={({ field }) => {
              return (
                <Form.Item>
                  <Form.Label optional>{t("fields.hsCode")}</Form.Label>
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
            name="origin_country"
            render={({ field }) => {
              return (
                <Form.Item>
                  <Form.Label optional>
                    {t("fields.countryOfOrigin")}
                  </Form.Label>
                  <Form.Control>
                    <CountrySelect {...field} />
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
