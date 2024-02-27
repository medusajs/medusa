import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Heading, Input, Select, Switch, Text } from "@medusajs/ui"
import { useAdminCreateRegion, useAdminStore } from "medusa-react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import * as zod from "zod"
import { Form } from "../../../../../components/common/form"
import { RouteFocusModal } from "../../../../../components/route-modal/route-focus-modal"

const CreateRegionSchema = zod.object({
  name: zod.string().min(1),
  currency_code: zod.string(),
  includes_tax: zod.boolean(),
  countries: zod.array(zod.string()),
  fulfillment_providers: zod.array(zod.string()).min(1),
  payment_providers: zod.array(zod.string()).min(1),
  tax_rate: zod.number().min(0).max(1),
  tax_code: zod.string().optional(),
})

export const CreateRegionForm = () => {
  const form = useForm<zod.infer<typeof CreateRegionSchema>>({
    defaultValues: {
      name: "",
      currency_code: "",
      includes_tax: false,
      countries: [],
      fulfillment_providers: [],
      payment_providers: [],
      tax_code: "",
      tax_rate: 0,
    },
    resolver: zodResolver(CreateRegionSchema),
  })

  const { t } = useTranslation()
  const navigate = useNavigate()

  const { mutateAsync, isLoading } = useAdminCreateRegion()

  const { store } = useAdminStore()
  const storeCurrencies = store?.currencies ?? []

  const handleSubmit = form.handleSubmit(async (values) => {
    await mutateAsync(
      {
        name: values.name,
        countries: values.countries,
        currency_code: values.currency_code,
        fulfillment_providers: values.fulfillment_providers,
        payment_providers: values.payment_providers,
        tax_rate: values.tax_rate,
        tax_code: values.tax_code,
        includes_tax: values.includes_tax,
      },
      {
        onSuccess: ({ region }) => {
          navigate(`../${region.id}`)
        },
      }
    )
  })

  return (
    <RouteFocusModal.Form form={form}>
      <form
        className="flex h-full flex-col overflow-hidden"
        onSubmit={handleSubmit}
      >
        <RouteFocusModal.Header>
          <div className="flex items-center justify-end gap-x-2">
            <RouteFocusModal.Close asChild>
              <Button size="small" variant="secondary">
                {t("actions.cancel")}
              </Button>
            </RouteFocusModal.Close>
            <Button size="small" type="submit" isLoading={isLoading}>
              {t("actions.save")}
            </Button>
          </div>
        </RouteFocusModal.Header>
        <RouteFocusModal.Body className="flex h-full w-full flex-col items-center overflow-y-auto py-16">
          <div className="flex w-full max-w-[720px] flex-col gap-y-8">
            <div>
              <Heading>{t("regions.createRegion")}</Heading>
              <Text size="small" className="text-ui-fg-subtle">
                {t("regions.createRegionHint")}
              </Text>
            </div>
            <div className="flex flex-col gap-y-4">
              <div className="grid grid-cols-2 gap-4">
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
                          <Select {...field} onValueChange={onChange}>
                            <Select.Trigger ref={ref}>
                              <Select.Value />
                            </Select.Trigger>
                            <Select.Content>
                              {storeCurrencies.map((currency) => (
                                <Select.Item
                                  value={currency.code}
                                  key={currency.code}
                                >
                                  {currency.name}
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
              <div className="grid grid-cols-2 gap-4">
                <Form.Field
                  control={form.control}
                  name="tax_rate"
                  render={({ field }) => {
                    return (
                      <Form.Item>
                        <Form.Label>{t("fields.taxRate")}</Form.Label>
                        <Form.Control>
                          <Input type="number" {...field} />
                        </Form.Control>
                        <Form.ErrorMessage />
                      </Form.Item>
                    )
                  }}
                />
                <Form.Field
                  control={form.control}
                  name="tax_code"
                  render={({ field }) => {
                    return (
                      <Form.Item>
                        <Form.Label optional>{t("fields.taxCode")}</Form.Label>
                        <Form.Control>
                          <Input type="number" {...field} />
                        </Form.Control>
                        <Form.ErrorMessage />
                      </Form.Item>
                    )
                  }}
                />
              </div>
            </div>
            <Form.Field
              control={form.control}
              name="includes_tax"
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
            <div className="flex flex-col gap-y-4">
              <div>
                <Text size="small" leading="compact" weight="plus">
                  {t("fields.providers")}
                </Text>
                <Text size="small" className="text-ui-fg-subtle">
                  {t("regions.providersHint")}
                </Text>
              </div>
              <div className="grid grid-cols-2 gap-4"></div>
            </div>
          </div>
        </RouteFocusModal.Body>
      </form>
    </RouteFocusModal.Form>
  )
}
