import { HttpTypes, PaymentProviderDTO } from "@medusajs/types"
import { Button, Input, Select, Switch, Text, toast } from "@medusajs/ui"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as zod from "zod"

import { Form } from "../../../../../components/common/form/index.ts"
import { Combobox } from "../../../../../components/inputs/combobox/index.ts"
import {
  RouteDrawer,
  useRouteModal,
} from "../../../../../components/modals/index.ts"
import { useUpdateRegion } from "../../../../../hooks/api/regions.tsx"
import { CurrencyInfo } from "../../../../../lib/currencies.ts"
import { formatProvider } from "../../../../../lib/format-provider.ts"

type EditRegionFormProps = {
  region: HttpTypes.AdminRegion
  currencies: CurrencyInfo[]
  paymentProviders: PaymentProviderDTO[]
  pricePreferences: HttpTypes.AdminPricePreference[]
}

const EditRegionSchema = zod.object({
  name: zod.string().min(1),
  currency_code: zod.string(),
  payment_providers: zod.array(zod.string()),
  automatic_taxes: zod.boolean(),
  is_tax_inclusive: zod.boolean(),
})

export const EditRegionForm = ({
  region,
  currencies,
  paymentProviders,
  pricePreferences,
}: EditRegionFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()
  const pricePreferenceForRegion = pricePreferences?.find(
    (preference) =>
      preference.attribute === "region_id" && preference.value === region.id
  )

  const form = useForm<zod.infer<typeof EditRegionSchema>>({
    defaultValues: {
      name: region.name,
      currency_code: region.currency_code.toUpperCase(),
      payment_providers: region.payment_providers?.map((pp) => pp.id) || [],
      automatic_taxes: region.automatic_taxes,
      is_tax_inclusive: pricePreferenceForRegion?.is_tax_inclusive || false,
    },
  })

  const { mutateAsync: updateRegion, isPending: isPendingRegion } =
    useUpdateRegion(region.id)

  const handleSubmit = form.handleSubmit(async (values) => {
    await updateRegion(
      {
        name: values.name,
        currency_code: values.currency_code.toLowerCase(),
        payment_providers: values.payment_providers,
        is_tax_inclusive: values.is_tax_inclusive,
      },
      {
        onError: (e) => {
          toast.error(t("general.error"), {
            description: e.message,
            dismissLabel: t("actions.close"),
          })
        },
        onSuccess: () => {
          toast.success(t("regions.toast.edit"))
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
      <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
        <RouteDrawer.Body>
          <div className="flex flex-col gap-y-8">
            <div className="flex flex-col gap-y-4">
              <Form.Field
                control={form.control}
                name="name"
                render={({ field }) => {
                  return (
                    <Form.Item>
                      <Form.Label>{t("fields.name")}</Form.Label>
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
                name="currency_code"
                render={({ field: { onChange, ref, ...field } }) => {
                  return (
                    <Form.Item>
                      <Form.Label>{t("fields.currency")}</Form.Label>
                      <Form.Control>
                        <Select onValueChange={onChange} {...field}>
                          <Select.Trigger ref={ref}>
                            <Select.Value />
                          </Select.Trigger>
                          <Select.Content>
                            {currencies.map((c) => (
                              <Select.Item key={c.code} value={c.code}>
                                {c.code.toUpperCase()}
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
            <div className="flex flex-col gap-y-4">
              <Form.Field
                control={form.control}
                name="automatic_taxes"
                render={({ field: { value, onChange, ...field } }) => {
                  return (
                    <Form.Item>
                      <div>
                        <div className="flex items-start justify-between">
                          <Form.Label>{t("fields.automaticTaxes")}</Form.Label>
                          <Form.Control>
                            <Switch
                              {...field}
                              checked={value}
                              onCheckedChange={onChange}
                            />
                          </Form.Control>
                        </div>
                        <Form.Hint>{t("regions.automaticTaxesHint")}</Form.Hint>
                        <Form.ErrorMessage />
                      </div>
                    </Form.Item>
                  )
                }}
              />

              <Form.Field
                control={form.control}
                name="is_tax_inclusive"
                render={({ field: { value, onChange, ...field } }) => {
                  return (
                    <Form.Item>
                      <div>
                        <div className="flex items-start justify-between">
                          <Form.Label>
                            {t("fields.taxInclusivePricing")}
                          </Form.Label>
                          <Form.Control>
                            <Switch
                              {...field}
                              checked={value}
                              onCheckedChange={onChange}
                            />
                          </Form.Control>
                        </div>
                        <Form.Hint>{t("regions.taxInclusiveHint")}</Form.Hint>
                        <Form.ErrorMessage />
                      </div>
                    </Form.Item>
                  )
                }}
              />
            </div>
            <div className="flex flex-col gap-y-4">
              <div>
                <Text size="small" leading="compact" weight="plus">
                  Providers
                </Text>
                <Text size="small" className="text-ui-fg-subtle">
                  {t("regions.providersHint")}
                </Text>
              </div>
              <Form.Field
                control={form.control}
                name="payment_providers"
                render={({ field }) => {
                  return (
                    <Form.Item>
                      <Form.Label>{t("fields.paymentProviders")}</Form.Label>
                      <Form.Control>
                        <Combobox
                          options={paymentProviders.map((pp) => ({
                            label: formatProvider(pp.id),
                            value: pp.id,
                          }))}
                          {...field}
                        />
                      </Form.Control>
                      <Form.ErrorMessage />
                    </Form.Item>
                  )
                }}
              />
            </div>
          </div>
        </RouteDrawer.Body>
        <RouteDrawer.Footer>
          <div className="flex items-center gap-x-2">
            <RouteDrawer.Close asChild>
              <Button size="small" variant="secondary">
                {t("actions.cancel")}
              </Button>
            </RouteDrawer.Close>
            <Button size="small" type="submit" isLoading={isPendingRegion}>
              {t("actions.save")}
            </Button>
          </div>
        </RouteDrawer.Footer>
      </form>
    </RouteDrawer.Form>
  )
}
