import { zodResolver } from "@hookform/resolvers/zod"
import { HttpTypes } from "@medusajs/types"
import { Button, Input, Select, toast } from "@medusajs/ui"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { z } from "zod"

import { Form } from "../../../../../components/common/form"
import { RouteDrawer, useRouteModal } from "../../../../../components/modals"
import { useRegions } from "../../../../../hooks/api/regions"
import { useUpdateStore } from "../../../../../hooks/api/store"

type EditStoreFormProps = {
  store: HttpTypes.AdminStore
}

const EditStoreSchema = z.object({
  name: z.string().min(1),
  default_currency_code: z.string().optional(),
  default_region_id: z.string().optional(),
  // default_location_id: z.string().optional(),
})

export const EditStoreForm = ({ store }: EditStoreFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<z.infer<typeof EditStoreSchema>>({
    defaultValues: {
      name: store.name,
      default_region_id: store.default_region_id || undefined,
      default_currency_code:
        store.supported_currencies?.find((c) => c.is_default)?.currency_code ||
        undefined,
    },
    resolver: zodResolver(EditStoreSchema),
  })

  const { mutateAsync, isPending } = useUpdateStore(store.id)

  const { regions, isPending: isRegionsLoading } = useRegions({ limit: 999 })

  const handleSubmit = form.handleSubmit(async (values) => {
    const normalizedMutation = {
      ...values,
      default_currency_code: undefined,
      supported_currencies: store.supported_currencies?.map((c) => ({
        ...c,
        is_default: c.currency_code === values.default_currency_code,
      })),
    }
    await mutateAsync(normalizedMutation, {
      onSuccess: () => {
        toast.success(t("store.toast.update"))
        handleSuccess()
      },
      onError: (error) => {
        toast.error(error.message)
      },
    })
  })

  return (
    <RouteDrawer.Form form={form}>
      <form onSubmit={handleSubmit} className="flex h-full flex-col">
        <RouteDrawer.Body>
          <div className="flex flex-col gap-y-8">
            <Form.Field
              control={form.control}
              name="name"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label>{t("fields.name")}</Form.Label>
                  <Form.Control>
                    <Input placeholder="ACME" {...field} />
                  </Form.Control>
                  <Form.ErrorMessage />
                </Form.Item>
              )}
            />
            {/* TODO: Add comboboxes for default sales channel and location */}
            <Form.Field
              control={form.control}
              name="default_currency_code"
              render={({ field: { onChange, ...field } }) => {
                return (
                  <Form.Item>
                    <Form.Label>{t("store.defaultCurrency")}</Form.Label>
                    <Form.Control>
                      <Select {...field} onValueChange={onChange}>
                        <Select.Trigger ref={field.ref}>
                          <Select.Value />
                        </Select.Trigger>
                        <Select.Content>
                          {store.supported_currencies?.map((currency) => (
                            <Select.Item
                              key={currency.currency_code}
                              value={currency.currency_code}
                            >
                              {currency.currency_code.toUpperCase()}
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select>
                    </Form.Control>
                  </Form.Item>
                )
              }}
            />
            <Form.Field
              control={form.control}
              name="default_region_id"
              render={({ field: { onChange, ...field } }) => {
                return (
                  <Form.Item>
                    <Form.Label>{t("store.defaultRegion")}</Form.Label>
                    <Form.Control>
                      <Select
                        {...field}
                        onValueChange={onChange}
                        disabled={isRegionsLoading}
                      >
                        <Select.Trigger ref={field.ref}>
                          <Select.Value />
                        </Select.Trigger>
                        <Select.Content>
                          {(regions || []).map((region) => (
                            <Select.Item key={region.id} value={region.id}>
                              {region.name}
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select>
                    </Form.Control>
                  </Form.Item>
                )
              }}
            />
          </div>
        </RouteDrawer.Body>
        <RouteDrawer.Footer>
          <div className="flex items-center justify-end gap-x-2">
            <RouteDrawer.Close asChild>
              <Button size="small" variant="secondary">
                {t("actions.cancel")}
              </Button>
            </RouteDrawer.Close>
            <Button size="small" isLoading={isPending} type="submit">
              {t("actions.save")}
            </Button>
          </div>
        </RouteDrawer.Footer>
      </form>
    </RouteDrawer.Form>
  )
}
