import { useForm } from "react-hook-form"
import { z } from "zod"

import { zodResolver } from "@hookform/resolvers/zod"
import { Region, TaxProvider } from "@medusajs/medusa"
import { Button, Select, Switch } from "@medusajs/ui"
import { useAdminUpdateRegion } from "medusa-react"
import { useTranslation } from "react-i18next"
import { Form } from "../../../../../components/common/form"
import {
  RouteDrawer,
  useRouteModal,
} from "../../../../../components/route-modal"
import { formatProvider } from "../../../../../lib/format-provider"

type EditTaxRateFormProps = {
  region: Region
  taxProviders: TaxProvider[]
}

const EditTaxSettingsSchema = z.object({
  includes_tax: z.boolean(),
  automatic_taxes: z.boolean(),
  gift_cards_taxable: z.boolean(),
  tax_provider_id: z.string(),
})

const SYSTEM_PROVIDER_ID = "system"

export const EditTaxSettingsForm = ({
  region,
  taxProviders,
}: EditTaxRateFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<z.infer<typeof EditTaxSettingsSchema>>({
    defaultValues: {
      includes_tax: region.includes_tax,
      automatic_taxes: region.automatic_taxes,
      gift_cards_taxable: region.gift_cards_taxable,
      tax_provider_id: region.tax_provider_id || SYSTEM_PROVIDER_ID,
    },
    resolver: zodResolver(EditTaxSettingsSchema),
  })

  const { mutateAsync, isLoading } = useAdminUpdateRegion(region.id)

  const handleSubmit = form.handleSubmit(async (data) => {
    const { tax_provider_id, ...rest } = data

    await mutateAsync(
      {
        tax_provider_id:
          tax_provider_id === SYSTEM_PROVIDER_ID ? null : tax_provider_id,
        ...rest,
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
            <Form.Field
              control={form.control}
              name="tax_provider_id"
              render={({ field: { onChange, ref, ...field } }) => {
                return (
                  <Form.Item>
                    <Form.Label>
                      {t("taxes.settings.taxProviderLabel")}
                    </Form.Label>
                    <Form.Control>
                      <Select {...field} onValueChange={onChange}>
                        <Select.Trigger ref={ref}>
                          <Select.Value />
                        </Select.Trigger>
                        <Select.Content>
                          <Select.Item value={SYSTEM_PROVIDER_ID}>
                            {t("taxes.settings.systemTaxProviderLabel")}
                          </Select.Item>
                          {taxProviders.map((tp) => (
                            <Select.Item key={tp.id} value={tp.id}>
                              {formatProvider(tp.id)}
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
            <Form.Field
              control={form.control}
              name="automatic_taxes"
              render={({ field: { value, onChange, ...field } }) => {
                return (
                  <Form.Item>
                    <div className="grid grid-cols-[1fr_32px] items-start gap-4">
                      <div className="flex flex-col gap-y-1">
                        <Form.Label>
                          {t("taxes.settings.calculateTaxesAutomaticallyLabel")}
                        </Form.Label>
                        <Form.Hint className="text-pretty">
                          {t("taxes.settings.calculateTaxesAutomaticallyHint")}
                        </Form.Hint>
                      </div>
                      <Form.Control>
                        <Switch
                          {...field}
                          checked={value}
                          onCheckedChange={onChange}
                        />
                      </Form.Control>
                    </div>
                    <Form.ErrorMessage />
                  </Form.Item>
                )
              }}
            />
            <Form.Field
              control={form.control}
              name="gift_cards_taxable"
              render={({ field: { value, onChange, ...field } }) => {
                return (
                  <Form.Item>
                    <div className="grid grid-cols-[1fr_32px] items-start gap-4">
                      <div className="flex flex-col gap-y-1">
                        <Form.Label>
                          {t("taxes.settings.applyTaxesOnGiftCardsLabel")}
                        </Form.Label>
                        <Form.Hint className="text-pretty">
                          {t("taxes.settings.applyTaxesOnGiftCardsHint")}
                        </Form.Hint>
                      </div>
                      <Form.Control>
                        <Switch
                          {...field}
                          checked={value}
                          onCheckedChange={onChange}
                        />
                      </Form.Control>
                    </div>
                    <Form.ErrorMessage />
                  </Form.Item>
                )
              }}
            />
            <Form.Field
              control={form.control}
              name="includes_tax"
              render={({ field: { value, onChange, ...field } }) => {
                return (
                  <Form.Item>
                    <div className="grid grid-cols-[1fr_32px] items-start gap-4">
                      <div className="flex flex-col gap-y-1">
                        <Form.Label>
                          {t("fields.taxInclusivePricing")}
                        </Form.Label>
                        <Form.Hint className="text-pretty">
                          {t("regions.taxInclusiveHint")}
                        </Form.Hint>
                      </div>
                      <Form.Control>
                        <Switch
                          {...field}
                          checked={value}
                          onCheckedChange={onChange}
                        />
                      </Form.Control>
                    </div>
                    <Form.ErrorMessage />
                  </Form.Item>
                )
              }}
            />
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
