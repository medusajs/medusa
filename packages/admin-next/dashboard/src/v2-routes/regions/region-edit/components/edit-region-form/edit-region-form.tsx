import { Button, Input, Select, Text, toast } from "@medusajs/ui"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as zod from "zod"
import { PaymentProviderDTO, RegionDTO } from "@medusajs/types"

import { Combobox } from "../../../../../components/common/combobox"
import { Form } from "../../../../../components/common/form"
import {
  RouteDrawer,
  useRouteModal,
} from "../../../../../components/route-modal"
import { formatProvider } from "../../../../../lib/format-provider"
import { CurrencyInfo } from "../../../../../lib/currencies"
import { useUpdateRegion } from "../../../../../hooks/api/regions.tsx"

type EditRegionFormProps = {
  region: RegionDTO
  currencies: CurrencyInfo[]
  paymentProviders: PaymentProviderDTO[]
}

const EditRegionSchema = zod.object({
  name: zod.string().min(1),
  currency_code: zod.string(),
  payment_providers: zod.array(zod.string()),
})

export const EditRegionForm = ({
  region,
  currencies,
  paymentProviders,
}: EditRegionFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<zod.infer<typeof EditRegionSchema>>({
    defaultValues: {
      name: region.name,
      currency_code: region.currency_code.toUpperCase(),
      payment_providers: region.payment_providers?.map((pp) => pp.id) || [],
    },
  })

  const { mutateAsync, isPending: isLoading } = useUpdateRegion(region.id)

  const handleSubmit = form.handleSubmit(async (values) => {
    await mutateAsync(
      {
        name: values.name,
        currency_code: values.currency_code.toLowerCase(),
        payment_providers: values.payment_providers,
      },
      {
        onSuccess: () => {
          toast.success(t("general.success"), {
            description: t("regions.toast.edit"),
            dismissLabel: t("actions.close"),
          })
          handleSuccess()
        },
        onError: (e) => {
          toast.error(t("general.error"), {
            description: e.message,
            dismissLabel: t("actions.close"),
          })
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
