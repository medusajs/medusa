import { Region } from "@medusajs/medusa"
import { Button, Input, Switch } from "@medusajs/ui"
import { useAdminUpdateRegion } from "medusa-react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as zod from "zod"

import { Combobox } from "../../../../../components/common/combobox"
import { Form } from "../../../../../components/common/form"
import { RouteDrawer } from "../../../../../components/route-modal"
import { countries } from "../../../../../lib/countries"

type EditRegionFormProps = {
  region: Region
}

const EditRegionSchema = zod.object({
  name: zod.string().min(1),
  includes_tax: zod.boolean(),
  currency_code: zod.string(),
  countries: zod.array(zod.string()),
})

export const EditRegionForm = ({ region }: EditRegionFormProps) => {
  const { mutateAsync, isLoading } = useAdminUpdateRegion(region.id)

  const form = useForm<zod.infer<typeof EditRegionSchema>>({
    defaultValues: {
      name: region.name,
      currency_code: region.currency_code,
      includes_tax: region.includes_tax,
      countries: region.countries.map((c) => c.iso_2),
    },
  })

  console.log(countries.length)
  const { t } = useTranslation()

  const handleSubmit = form.handleSubmit(async (values) => {
    await mutateAsync({
      name: values.name,
      currency_code: values.currency_code,
      includes_tax: values.includes_tax,
    })
  })

  return (
    <RouteDrawer.Form form={form}>
      <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
        <RouteDrawer.Body>
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
              name="includes_tax"
              render={({ field: { value, onChange, ...field } }) => {
                return (
                  <Form.Item>
                    <div className="flex items-start justify-between">
                      <div>
                        <Form.Label>
                          {t("fields.taxInclusivePricing")}
                        </Form.Label>
                        <Form.Hint>{t("regions.taxInclusiveHint")}</Form.Hint>
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
              name="countries"
              render={({ field }) => {
                return (
                  <Form.Item>
                    <Form.Label>{t("fields.countries")}</Form.Label>
                    <Form.Control>
                      <Combobox
                        options={countries.map((c) => ({
                          label: c.display_name,
                          value: c.iso_2,
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
