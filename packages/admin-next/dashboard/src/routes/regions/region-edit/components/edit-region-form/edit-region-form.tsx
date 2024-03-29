import {
  Currency,
  FulfillmentProvider,
  PaymentProvider,
  Region,
} from "@medusajs/medusa"
import { Button, Input, Select, Text } from "@medusajs/ui"
import { useAdminUpdateRegion } from "medusa-react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as zod from "zod"

import { Combobox } from "../../../../../components/common/combobox"
import { Form } from "../../../../../components/common/form"
import {
  RouteDrawer,
  useRouteModal,
} from "../../../../../components/route-modal"
import { formatProvider } from "../../../../../lib/format-provider"

type EditRegionFormProps = {
  region: Region
  currencies: Currency[]
  paymentProviders: PaymentProvider[]
  fulfillmentProviders: FulfillmentProvider[]
}

const EditRegionSchema = zod.object({
  name: zod.string().min(1),
  currency_code: zod.string(),
  payment_providers: zod.array(zod.string()),
  fulfillment_providers: zod.array(zod.string()),
})

export const EditRegionForm = ({
  region,
  currencies,
  paymentProviders,
  fulfillmentProviders,
}: EditRegionFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<zod.infer<typeof EditRegionSchema>>({
    defaultValues: {
      name: region.name,
      currency_code: region.currency_code,
      fulfillment_providers: region.fulfillment_providers.map((fp) => fp.id),
      payment_providers: region.payment_providers.map((pp) => pp.id),
    },
  })

  const { mutateAsync, isLoading } = useAdminUpdateRegion(region.id)

  const handleSubmit = form.handleSubmit(async (values) => {
    await mutateAsync(
      {
        name: values.name,
        currency_code: values.currency_code,
        fulfillment_providers: values.fulfillment_providers,
        payment_providers: values.payment_providers,
      },
      {
        onSuccess: () => {
          handleSuccess()
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
              <Form.Field
                control={form.control}
                name="fulfillment_providers"
                render={({ field }) => {
                  return (
                    <Form.Item>
                      <Form.Label>
                        {t("fields.fulfillmentProviders")}
                      </Form.Label>
                      <Form.Control>
                        <Combobox
                          options={fulfillmentProviders.map((fp) => ({
                            label: formatProvider(fp.id),
                            value: fp.id,
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
            <Button size="small" type="submit" isLoading={isLoading}>
              {t("actions.save")}
            </Button>
          </div>
        </RouteDrawer.Footer>
      </form>
    </RouteDrawer.Form>
  )
}
