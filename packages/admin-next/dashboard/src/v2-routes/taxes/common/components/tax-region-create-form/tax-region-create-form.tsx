import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Heading, Input, Select, Switch, Text } from "@medusajs/ui"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as zod from "zod"

import { TaxRegionResponse } from "@medusajs/types"
import { Form } from "../../../../../components/common/form"
import { PercentageInput } from "../../../../../components/common/percentage-input"
import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/route-modal"
import { useCreateTaxRegion } from "../../../../../hooks/api/tax-regions"
import { countries } from "../../../../../lib/countries"

export const TaxRegionCreateForm = ({
  taxRegion,
  formSchema,
}: {
  taxRegion?: TaxRegionResponse
  formSchema: zod.ZodObject<{
    province_code: any
    country_code: any
    parent_id: any
    name: any
    code: any
    rate: any
    is_combinable: any
  }>
}) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<zod.infer<typeof formSchema>>({
    defaultValues: {
      country_code: taxRegion?.country_code || undefined,
      parent_id: taxRegion?.id || undefined,
    },
    resolver: zodResolver(formSchema),
  })

  const { mutateAsync, isPending } = useCreateTaxRegion()

  const handleSubmit = form.handleSubmit(async (data) => {
    await mutateAsync(
      {
        parent_id: taxRegion?.id,
        province_code: data.province_code,
        country_code: data.country_code,
        default_tax_rate: {
          name: data.name,
          code: data.code,
          rate: data.rate,
        },
      },
      {
        onSuccess: () => {
          taxRegion?.id
            ? handleSuccess(`/settings/taxes/${taxRegion.id}`)
            : handleSuccess(`/settings/taxes`)
        },
      }
    )
  })

  return (
    <RouteFocusModal.Form form={form}>
      <form onSubmit={handleSubmit} className="flex h-full flex-col">
        <RouteFocusModal.Header>
          <div className="flex items-center justify-end gap-x-2">
            <RouteFocusModal.Close asChild>
              <Button variant="secondary" size="small">
                {t("actions.cancel")}
              </Button>
            </RouteFocusModal.Close>

            <Button
              type="submit"
              variant="primary"
              size="small"
              isLoading={isPending}
            >
              {t("actions.create")}
            </Button>
          </div>
        </RouteFocusModal.Header>

        <RouteFocusModal.Body className="flex h-full w-full flex-col items-center overflow-hidden p-16">
          <div className="flex flex-col gap-y-8 w-full max-w-[720px]">
            <div>
              <Heading className="text-left">
                {taxRegion
                  ? t("taxRegions.create-child.title")
                  : t("taxRegions.create.title")}
              </Heading>

              <Text className="text-ui-fg-subtle txt-small">
                {taxRegion
                  ? t("taxRegions.create-child.description")
                  : t("taxRegions.create.description")}
              </Text>
            </div>

            {!taxRegion && (
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
                            {countries?.map((country) => (
                              <Select.Item
                                key={country.iso_2}
                                value={country.iso_2}
                              >
                                {country.display_name}
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
            )}

            {taxRegion && (
              <Form.Field
                control={form.control}
                name="province_code"
                render={({ field }) => {
                  return (
                    <Form.Item>
                      <Form.Label>{t("fields.province")}</Form.Label>

                      <Form.Control>
                        <Input {...field} />
                      </Form.Control>
                    </Form.Item>
                  )
                }}
              />
            )}

            <Form.Field
              control={form.control}
              name="name"
              render={({ field }) => {
                return (
                  <Form.Item>
                    <Form.Label>Tax Rate Name</Form.Label>

                    <Form.Control>
                      <Input {...field} />
                    </Form.Control>
                  </Form.Item>
                )
              }}
            />

            <Form.Field
              control={form.control}
              name="rate"
              render={({ field }) => {
                return (
                  <Form.Item>
                    <Form.Label>{t("fields.rate")}</Form.Label>

                    <Form.Control>
                      <PercentageInput
                        {...field}
                        value={field.value}
                        onChange={(e) => {
                          if (e.target.value) {
                            field.onChange(parseInt(e.target.value))
                          }
                        }}
                      />
                    </Form.Control>

                    <Form.Hint className="!mt-1">
                      {t("taxRegions.fields.rate.hint")}
                    </Form.Hint>
                  </Form.Item>
                )
              }}
            />

            <Form.Field
              control={form.control}
              name="code"
              render={({ field }) => {
                return (
                  <Form.Item>
                    <Form.Label>{t("fields.code")}</Form.Label>

                    <Form.Control>
                      <Input {...field} />
                    </Form.Control>
                  </Form.Item>
                )
              }}
            />

            {!taxRegion?.parent_id && (
              <Form.Field
                control={form.control}
                name="is_combinable"
                render={({ field: { ref, onChange, value, ...field } }) => {
                  return (
                    <Form.Item>
                      <Form.Label>
                        {t("taxRates.fields.isCombinable")}
                      </Form.Label>

                      <Form.Control>
                        <Switch
                          {...field}
                          checked={value}
                          onCheckedChange={onChange}
                        />
                      </Form.Control>

                      <Form.Hint className="!mt-1">
                        {t("taxRegions.fields.is_combinable.hint")}
                      </Form.Hint>
                    </Form.Item>
                  )
                }}
              />
            )}
          </div>
        </RouteFocusModal.Body>
      </form>
    </RouteFocusModal.Form>
  )
}
