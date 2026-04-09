import { zodResolver } from "@hookform/resolvers/zod"
import { HttpTypes } from "@medusajs/types"
import { Button, Input, Select, toast } from "@medusajs/ui"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { z } from "zod"

import { Form } from "../../../../../components/common/form"
import { Combobox } from "../../../../../components/inputs/combobox"
import { RouteDrawer, useRouteModal } from "../../../../../components/modals"
import { KeyboundForm } from "../../../../../components/utilities/keybound-form"
import { useUpdateStore } from "../../../../../hooks/api/store"
import { useComboboxData } from "../../../../../hooks/use-combobox-data"
import { sdk } from "../../../../../lib/client"
import { useDocumentDirection } from "../../../../../hooks/use-document-direction"

type EditStoreFormProps = {
  store: HttpTypes.AdminStore
}

const EditStoreSchema = z.object({
  name: z.string().min(1),
  default_currency_code: z.string().optional(),
  default_region_id: z.string().optional(),
  default_sales_channel_id: z.string().optional(),
  default_location_id: z.string().optional(),
})

export const EditStoreForm = ({ store }: EditStoreFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()
  const direction = useDocumentDirection()
  const form = useForm<z.infer<typeof EditStoreSchema>>({
    defaultValues: {
      name: store.name,
      default_region_id: store.default_region_id || undefined,
      default_currency_code:
        store.supported_currencies?.find((c) => c.is_default)?.currency_code ||
        undefined,
      default_sales_channel_id: store.default_sales_channel_id || undefined,
      default_location_id: store.default_location_id || undefined,
    },
    resolver: zodResolver(EditStoreSchema),
  })

  const { mutateAsync, isPending } = useUpdateStore(store.id)

  const regionsCombobox = useComboboxData({
    queryKey: ["regions", "default_region_id"],
    queryFn: (params) =>
      sdk.admin.region.list({ ...params, fields: "id,name" }),
    defaultValue: store.default_region_id || undefined,
    getOptions: (data) =>
      data.regions.map((r) => ({ label: r.name, value: r.id })),
  })

  const salesChannelsCombobox = useComboboxData({
    queryFn: (params) =>
      sdk.admin.salesChannel.list({ ...params, fields: "id,name" }),
    getOptions: (data) =>
      data.sales_channels.map((sc) => ({ label: sc.name, value: sc.id })),
    queryKey: ["sales_channels", "default_sales_channel_id"],
    defaultValue: store.default_sales_channel_id || undefined,
  })

  const locationsCombobox = useComboboxData({
    queryFn: (params) =>
      sdk.admin.stockLocation.list({ ...params, fields: "id,name" }),
    getOptions: (data) =>
      data.stock_locations.map((l) => ({ label: l.name, value: l.id })),
    queryKey: ["stock_locations", "default_location_id"],
    defaultValue: store.default_location_id || undefined,
  })

  const handleSubmit = form.handleSubmit(async (values) => {
    const { default_currency_code, ...rest } = values

    const normalizedMutation: HttpTypes.AdminUpdateStore = {
      ...rest,
      supported_currencies: store.supported_currencies?.map((c) => ({
        ...c,
        is_default: c.currency_code === default_currency_code,
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
      <KeyboundForm
        onSubmit={handleSubmit}
        className="flex h-full flex-col overflow-hidden"
      >
        <RouteDrawer.Body className="overflow-y-auto">
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
            <Form.Field
              control={form.control}
              name="default_currency_code"
              render={({ field: { onChange, ...field } }) => {
                return (
                  <Form.Item>
                    <Form.Label>{t("store.defaultCurrency")}</Form.Label>
                    <Form.Control>
                      <Select
                        dir={direction}
                        {...field}
                        onValueChange={onChange}
                      >
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
              render={({ field }) => {
                return (
                  <Form.Item>
                    <Form.Label>{t("store.defaultRegion")}</Form.Label>
                    <Form.Control>
                      <Combobox
                        {...field}
                        options={regionsCombobox.options}
                        searchValue={regionsCombobox.searchValue}
                        onSearchValueChange={
                          regionsCombobox.onSearchValueChange
                        }
                        disabled={regionsCombobox.disabled}
                      />
                    </Form.Control>
                  </Form.Item>
                )
              }}
            />
            <Form.Field
              control={form.control}
              name="default_sales_channel_id"
              render={({ field }) => {
                return (
                  <Form.Item>
                    <Form.Label>{t("store.defaultSalesChannel")}</Form.Label>
                    <Form.Control>
                      <Combobox
                        {...field}
                        options={salesChannelsCombobox.options}
                        searchValue={salesChannelsCombobox.searchValue}
                        onSearchValueChange={
                          salesChannelsCombobox.onSearchValueChange
                        }
                        disabled={salesChannelsCombobox.disabled}
                      />
                    </Form.Control>
                  </Form.Item>
                )
              }}
            />
            <Form.Field
              control={form.control}
              name="default_location_id"
              render={({ field }) => {
                return (
                  <Form.Item>
                    <Form.Label>{t("store.defaultLocation")}</Form.Label>
                    <Form.Control>
                      <Combobox
                        {...field}
                        options={locationsCombobox.options}
                        searchValue={locationsCombobox.searchValue}
                        onSearchValueChange={
                          locationsCombobox.onSearchValueChange
                        }
                        disabled={locationsCombobox.disabled}
                      />
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
      </KeyboundForm>
    </RouteDrawer.Form>
  )
}
