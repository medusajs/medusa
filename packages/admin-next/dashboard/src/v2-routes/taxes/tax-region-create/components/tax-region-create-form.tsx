import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Input, Select } from "@medusajs/ui"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as zod from "zod"

import { TaxRegionResponse } from "@medusajs/types"
import { useState } from "react"
import { Form } from "../../../../components/common/form"
import { RouteDrawer, useRouteModal } from "../../../../components/route-modal"
import {
  useCreateTaxRegion,
  useTaxRegions,
} from "../../../../hooks/api/tax-regions"
import { countries, getCountryByIso2 } from "../../../../lib/countries"

const CreateTaxRegionSchema = zod.object({
  country_code: zod.string(),
  province_code: zod.string().optional(),
  parent_id: zod.string().optional(),
})

export const TaxRegionCreateForm = () => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()
  const [selectedParent, setSelectedParent] = useState<TaxRegionResponse>()

  const form = useForm<zod.infer<typeof CreateTaxRegionSchema>>({
    defaultValues: {},
    resolver: zodResolver(CreateTaxRegionSchema),
  })
  const { tax_regions: taxRegions } = useTaxRegions({ parent_id: "null" })
  const { mutateAsync: createTaxRegion, isPending } = useCreateTaxRegion()

  const handleSubmit = form.handleSubmit(
    async (data) => {
      await createTaxRegion(
        {
          country_code: data.country_code,
          province_code: data.province_code,
          parent_id: data.parent_id,
        },
        {
          onSuccess: () => handleSuccess(`/settings/taxes`),
        }
      )
    },
    (data) => {
      console.log("data = ", data)
    }
  )

  return (
    <RouteDrawer.Form form={form}>
      <form onSubmit={handleSubmit} className="flex h-full flex-col">
        <RouteDrawer.Body>
          <div className="flex h-full flex-col gap-y-8">
            <Form.Field
              control={form.control}
              name="parent_id"
              render={({ field: { ref, onChange, ...field } }) => {
                return (
                  <Form.Item>
                    <Form.Label>{t("fields.parent")}</Form.Label>

                    <Form.Control>
                      <Select
                        {...field}
                        onValueChange={(e) => {
                          const selected = taxRegions?.find((tr) => tr.id === e)

                          setSelectedParent(selected)
                          onChange(e)

                          form.setValue(
                            "country_code",
                            selected?.country_code!,
                            { shouldDirty: true }
                          )
                        }}
                      >
                        <Select.Trigger ref={ref}>
                          <Select.Value />
                        </Select.Trigger>

                        <Select.Content>
                          {taxRegions?.map((taxRegion) => (
                            <Select.Item
                              key={taxRegion.id}
                              value={taxRegion.id}
                            >
                              {getCountryByIso2(taxRegion.country_code)
                                ?.display_name || taxRegion.country_code}
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select>
                    </Form.Control>
                  </Form.Item>
                )
              }}
            />

            {!selectedParent && (
              <Form.Field
                control={form.control}
                name="country_code"
                render={({ field: { ref, onChange, ...field } }) => {
                  return (
                    <Form.Item>
                      <Form.Label>{t("fields.country")}</Form.Label>

                      <Form.Control>
                        <Select {...field} onValueChange={onChange}>
                          <Select.Trigger ref={ref}>
                            <Select.Value />
                          </Select.Trigger>

                          <Select.Content>
                            {countries?.map((r) => (
                              <Select.Item key={r.iso_2} value={r.iso_2}>
                                {r.display_name}
                              </Select.Item>
                            ))}
                          </Select.Content>
                        </Select>
                      </Form.Control>
                    </Form.Item>
                  )
                }}
              />
            )}

            <Form.Field
              control={form.control}
              name="province_code"
              render={({ field }) => {
                return (
                  <Form.Item>
                    <Form.Label>{t("fields.province")}</Form.Label>

                    <Form.Control>
                      <Form.Control>
                        <Input {...field} />
                      </Form.Control>
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

            <Button size="small" type="submit" isLoading={isPending}>
              {t("actions.save")}
            </Button>
          </div>
        </RouteDrawer.Footer>
      </form>
    </RouteDrawer.Form>
  )
}
