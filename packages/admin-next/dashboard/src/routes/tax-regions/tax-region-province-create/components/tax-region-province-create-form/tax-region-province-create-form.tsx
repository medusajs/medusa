import { zodResolver } from "@hookform/resolvers/zod"
import { InformationCircleSolid } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Button, Heading, Input, Text, Tooltip, toast } from "@medusajs/ui"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { z } from "zod"
import { Form } from "../../../../../components/common/form"
import { SwitchBox } from "../../../../../components/common/switch-box"
import { PercentageInput } from "../../../../../components/inputs/percentage-input"
import { ProvinceSelect } from "../../../../../components/inputs/province-select"
import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/modals"
import { useCreateTaxRegion } from "../../../../../hooks/api/tax-regions"
import { getCountryProvinceObjectByIso2 } from "../../../../../lib/data/country-states"

type TaxRegionProvinceCreateFormProps = {
  parent: HttpTypes.AdminTaxRegion
}

const CreateTaxRegionProvinceSchema = z.object({
  province_code: z.string().min(1),
  name: z.string().optional(),
  code: z.string().optional(),
  rate: z
    .object({
      float: z.number().optional(),
      value: z.string().optional(),
    })
    .optional(),
  is_combinable: z.boolean().optional(),
})

export const TaxRegionProvinceCreateForm = ({
  parent,
}: TaxRegionProvinceCreateFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<z.infer<typeof CreateTaxRegionProvinceSchema>>({
    defaultValues: {
      province_code: "",
      code: "",
      is_combinable: false,
      name: "",
      rate: {
        value: "",
      },
    },
    resolver: zodResolver(CreateTaxRegionProvinceSchema),
  })

  const { mutateAsync, isPending } = useCreateTaxRegion()

  const handleSubmit = form.handleSubmit(async (values) => {
    const defaultRate =
      values.name && values.rate?.float
        ? {
            name: values.name,
            rate: values.rate.float,
            code: values.code,
          }
        : undefined

    await mutateAsync(
      {
        country_code: parent.country_code!,
        province_code: values.province_code,
        parent_id: parent.id,
        default_tax_rate: defaultRate,
      },
      {
        onSuccess: ({ tax_region }) => {
          toast.success(t("taxRegions.create.successToast"))
          handleSuccess(
            `/settings/tax-regions/${parent.id}/provinces/${tax_region.id}`
          )
        },
        onError: (error) => {
          toast.error(error.message)
        },
      }
    )
  })

  const provinceObject = getCountryProvinceObjectByIso2(parent.country_code!)

  const label = provinceObject
    ? t(`provinces.labels.${provinceObject.type}`)
    : ""

  return (
    <RouteFocusModal.Form form={form}>
      <form
        onSubmit={handleSubmit}
        className="flex h-full flex-col overflow-hidden"
      >
        <RouteFocusModal.Header />
        <RouteFocusModal.Body className="flex flex-1 flex-col overflow-hidden">
          <div className="flex flex-1 flex-col items-center overflow-y-auto">
            <div className="flex w-full max-w-[720px] flex-col gap-y-8 px-2 py-16">
              <div>
                <Heading>
                  {t(`taxRegions.${provinceObject?.type!}.create.header`)}
                </Heading>
                <Text size="small" className="text-ui-fg-subtle">
                  {t(`taxRegions.${provinceObject?.type!}.create.hint`)}
                </Text>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Form.Field
                  control={form.control}
                  name="province_code"
                  render={({ field }) => {
                    return (
                      <Form.Item>
                        <Form.Label>{label}</Form.Label>
                        <Form.Control>
                          <ProvinceSelect
                            country_code={parent.country_code!}
                            {...field}
                          />
                        </Form.Control>
                        <Form.ErrorMessage />
                      </Form.Item>
                    )
                  }}
                />
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-x-1">
                  <Heading level="h2" className="!txt-compact-small-plus">
                    {t("taxRegions.fields.defaultTaxRate.label")}
                  </Heading>
                  <Text
                    size="small"
                    leading="compact"
                    className="text-ui-fg-muted"
                  >
                    ({t("fields.optional")})
                  </Text>
                  <Tooltip
                    content={t("taxRegions.fields.defaultTaxRate.tooltip")}
                  >
                    <InformationCircleSolid className="text-ui-fg-muted" />
                  </Tooltip>
                </div>
                <div className="flex flex-col gap-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                      name="rate"
                      render={({ field: { value, onChange, ...field } }) => {
                        return (
                          <Form.Item>
                            <Form.Label>
                              {t("taxRegions.fields.taxRate")}
                            </Form.Label>
                            <Form.Control>
                              <PercentageInput
                                {...field}
                                value={value?.value}
                                onValueChange={(value, _name, values) =>
                                  onChange({
                                    value: value,
                                    float: values?.float,
                                  })
                                }
                              />
                            </Form.Control>
                            <Form.ErrorMessage />
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
                            <Form.Label>
                              {t("taxRegions.fields.taxCode")}
                            </Form.Label>
                            <Form.Control>
                              <Input {...field} />
                            </Form.Control>
                            <Form.ErrorMessage />
                          </Form.Item>
                        )
                      }}
                    />
                  </div>
                  <SwitchBox
                    control={form.control}
                    name="is_combinable"
                    label={t("taxRegions.fields.isCombinable.label")}
                    description={t("taxRegions.fields.isCombinable.hint")}
                  />
                </div>
              </div>
            </div>
          </div>
        </RouteFocusModal.Body>
        <RouteFocusModal.Footer>
          <div className="flex items-center justify-end gap-x-2">
            <RouteFocusModal.Close asChild>
              <Button size="small" variant="secondary">
                {t("actions.cancel")}
              </Button>
            </RouteFocusModal.Close>
            <Button size="small" type="submit" isLoading={isPending}>
              {t("actions.save")}
            </Button>
          </div>
        </RouteFocusModal.Footer>
      </form>
    </RouteFocusModal.Form>
  )
}
