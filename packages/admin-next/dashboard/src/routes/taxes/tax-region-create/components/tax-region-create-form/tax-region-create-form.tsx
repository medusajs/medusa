import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { InformationCircleSolid } from "@medusajs/icons"
import { Button, Heading, Input, Text, Tooltip, toast } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { Form } from "../../../../../components/common/form"
import { SwitchBox } from "../../../../../components/common/switch-box"
import { CountrySelect } from "../../../../../components/inputs/country-select"
import { PercentageInput } from "../../../../../components/inputs/percentage-input"
import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/route-modal"
import { i18n } from "../../../../../components/utilities/i18n"
import { useCreateTaxRegion } from "../../../../../hooks/api/tax-regions"

type TaxRegionCreateFormProps = {
  parentId?: string
}

const TaxRegionCreateSchema = z
  .object({
    name: z.string().optional(),
    code: z.string().optional(),
    rate: z
      .object({
        float: z.number().optional(),
        value: z.string().optional(),
      })
      .optional(),
    is_combinable: z.boolean().optional(),
    country_code: z.string().optional(),
    province_code: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.name && !data.rate?.float) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["rate"],
        message: i18n.t("taxRegions.create.errors.rateIsRequired"),
      })

      return false
    }

    if (data.rate?.float && !data.name) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["name"],
        message: i18n.t("taxRegions.create.errors.nameIsRequired"),
      })
    }

    if (!data.province_code && !data.country_code) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["country_code"],
        message: i18n.t("taxRegions.create.errors.regionIsRequired"),
      })

      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["province_code"],
        message: i18n.t("taxRegions.create.errors.regionIsRequired"),
      })
    }
  })

export const TaxRegionCreateForm = ({ parentId }: TaxRegionCreateFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<z.infer<typeof TaxRegionCreateSchema>>({
    defaultValues: {
      name: "",
      rate: {
        value: "",
      },
      code: "",
      country_code: "",
      province_code: "",
      is_combinable: false,
    },
    resolver: zodResolver(TaxRegionCreateSchema),
  })

  const { mutateAsync, isPending } = useCreateTaxRegion()

  const handleSubmit = form.handleSubmit(
    async (values) => {
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
          country_code: values.country_code!,
          province_code: values.province_code,
          parent_id: parentId,
          default_tax_rate: defaultRate,
        },
        {
          onSuccess: ({ tax_region }) => {
            toast.success(t("general.success"), {
              description: t("taxRegions.create.successToast"),
              dismissLabel: t("actions.close"),
            })

            handleSuccess(`../${tax_region.id}`)
          },
          onError: (error) => {
            toast.error(t("general.error"), {
              description: error.message,
              dismissable: true,
              dismissLabel: t("actions.close"),
            })
          },
        }
      )
    },
    (errors) => console.log(errors)
  )

  return (
    <RouteFocusModal.Form form={form}>
      <form
        onSubmit={handleSubmit}
        className="flex h-full flex-col overflow-hidden"
      >
        <RouteFocusModal.Header>
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
        </RouteFocusModal.Header>
        <RouteFocusModal.Body className="flex flex-1 flex-col overflow-hidden">
          <div className="flex flex-1 flex-col items-center overflow-y-auto">
            <div className="flex w-full max-w-[720px] flex-col gap-y-8 px-2 py-16">
              <div>
                <Heading className="capitalize">
                  {t("salesChannels.createSalesChannel")}
                </Heading>
                <Text size="small" className="text-ui-fg-subtle">
                  {t("salesChannels.createSalesChannelHint")}
                </Text>
              </div>
              <div className="flex flex-col gap-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Form.Field
                    control={form.control}
                    name="country_code"
                    render={({ field }) => {
                      return (
                        <Form.Item>
                          <Form.Label>{t("fields.country")}</Form.Label>
                          <Form.Control>
                            <CountrySelect {...field} />
                          </Form.Control>
                          <Form.ErrorMessage />
                        </Form.Item>
                      )
                    }}
                  />
                </div>
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
                  {parentId && (
                    <SwitchBox
                      control={form.control}
                      name="is_combinable"
                      label={t("taxRegions.fields.isCombinable.label")}
                      description={t("taxRegions.fields.isCombinable.hint")}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </RouteFocusModal.Body>
      </form>
    </RouteFocusModal.Form>
  )
}
