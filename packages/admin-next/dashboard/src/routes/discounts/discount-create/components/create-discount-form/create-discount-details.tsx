import {
  Checkbox,
  CurrencyInput,
  DatePicker,
  Heading,
  Input,
  RadioGroup,
  Select,
  Switch,
  Text,
  Textarea,
} from "@medusajs/ui"
import { useAdminRegions } from "medusa-react"
import { useEffect, useMemo } from "react"
import { Trans, useTranslation } from "react-i18next"

import { useWatch } from "react-hook-form"
import { Combobox } from "../../../../../components/common/combobox"
import { Form } from "../../../../../components/common/form"
import { PercentageInput } from "../../../../../components/common/percentage-input"
import { getCurrencySymbol } from "../../../../../lib/currencies"
import { CreateDiscountFormReturn } from "./create-discount-form"
import { DiscountRuleType } from "./types"

type CreateDiscountPropsProps = {
  form: CreateDiscountFormReturn
}

export const CreateDiscountDetails = ({ form }: CreateDiscountPropsProps) => {
  const { t } = useTranslation()

  const { regions } = useAdminRegions()

  const watchType = useWatch({
    control: form.control,
    name: "type",
  })
  const watchRegion = useWatch({
    name: "regions",
    control: form.control,
  })

  const isFixedDiscount = watchType === DiscountRuleType.FIXED
  const isFreeShipping = watchType === DiscountRuleType.FREE_SHIPPING

  const activeRegion = useMemo(() => {
    if (!watchRegion || !regions?.length) {
      return
    }

    return regions.find((r) => r.id === watchRegion[0])
  }, [regions, watchRegion])

  const { setValue } = form

  useEffect(() => {
    setValue("regions", [])
    setValue("value", undefined)
  }, [watchType, setValue])

  return (
    <div className="flex size-full flex-col items-center overflow-auto p-16">
      <div className="flex w-full max-w-[736px] flex-col justify-center px-2 pb-2">
        <div className="flex flex-col gap-y-1">
          <Heading>{t("discounts.createDiscountTitle")}</Heading>
        </div>
        <div className="flex flex-col gap-y-8 divide-y [&>div]:pt-8">
          {/* DETAILS */}
          <div className="flex flex-col gap-y-8">
            <Form.Field
              control={form.control}
              name="type"
              render={({ field }) => {
                return (
                  <Form.Item>
                    <Form.Label>{t("discounts.type")}</Form.Label>
                    <Form.Control>
                      <RadioGroup
                        className="flex justify-between gap-4"
                        {...field}
                        onValueChange={field.onChange}
                      >
                        <RadioGroup.ChoiceBox
                          className="flex-1"
                          value={DiscountRuleType.PERCENTAGE}
                          label={t("fields.percentage")}
                          description={t("discounts.percentageDescription")}
                        />
                        <RadioGroup.ChoiceBox
                          className="flex-1"
                          value={DiscountRuleType.FIXED}
                          label={t("discounts.fixedAmount")}
                          description={t("discounts.fixedDescription")}
                        />
                        <RadioGroup.ChoiceBox
                          className="flex-1"
                          value={DiscountRuleType.FREE_SHIPPING}
                          label={t("discounts.freeShipping")}
                          description={t("discounts.shippingDescription")}
                        />
                      </RadioGroup>
                    </Form.Control>
                    <Form.ErrorMessage />
                  </Form.Item>
                )
              }}
            />

            <div className="grid grid-cols-2 gap-x-4">
              <Form.Field
                control={form.control}
                name="regions"
                render={({ field: { onChange, value, ref, ...field } }) => {
                  return (
                    <Form.Item>
                      <Form.Label>
                        {t("discounts.chooseValidRegions")}
                      </Form.Label>
                      <Form.Control>
                        {isFixedDiscount ? (
                          <Select
                            value={value[0]}
                            onValueChange={(v) => {
                              if (v) {
                                onChange([v])
                              }
                            }}
                            {...field}
                          >
                            <Select.Trigger ref={ref}>
                              <Select.Value />
                            </Select.Trigger>
                            <Select.Content>
                              {(regions || []).map((r) => (
                                <Select.Item key={r.id} value={r.id}>
                                  {r.name}
                                </Select.Item>
                              ))}
                            </Select.Content>
                          </Select>
                        ) : (
                          <Combobox
                            options={(regions || []).map((r) => ({
                              label: r.name,
                              value: r.id,
                            }))}
                            value={value}
                            onChange={onChange}
                            {...field}
                          />
                        )}
                      </Form.Control>
                      <Form.ErrorMessage />
                    </Form.Item>
                  )
                }}
              />
            </div>

            <div className="grid grid-cols-2 gap-x-4">
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
                      <Form.ErrorMessage />
                    </Form.Item>
                  )
                }}
              />
              {!isFreeShipping && (
                <Form.Field
                  control={form.control}
                  name="value"
                  render={({ field: { onChange, ...field } }) => {
                    return (
                      <Form.Item>
                        <Form.Label
                          tooltip={
                            isFixedDiscount &&
                            !activeRegion &&
                            t("discounts.selectRegionFirst")
                          }
                        >
                          {isFixedDiscount
                            ? t("fields.amount")
                            : t("fields.percentage")}
                        </Form.Label>
                        <Form.Control>
                          {isFixedDiscount ? (
                            activeRegion ? (
                              <CurrencyInput
                                min={0}
                                onValueChange={onChange}
                                code={activeRegion.currency_code}
                                symbol={getCurrencySymbol(
                                  activeRegion.currency_code
                                )}
                                {...field}
                              />
                            ) : (
                              <Input key="placeholder" disabled />
                            )
                          ) : (
                            <PercentageInput
                              key="amount"
                              min={0}
                              max={100}
                              {...field}
                              value={field.value || ""}
                              onChange={(e) => {
                                const value = e.target.value
                                if (value === "") {
                                  onChange(null)
                                } else {
                                  onChange(parseFloat(value))
                                }
                              }}
                            />
                          )}
                        </Form.Control>
                        <Form.ErrorMessage />
                      </Form.Item>
                    )
                  }}
                />
              )}
            </div>

            <Text size="small" leading="compact" className="text-ui-fg-subtle">
              <Trans
                i18nKey="discounts.titleHint"
                t={t}
                components={[<br key="break" />]}
              />
            </Text>

            <Form.Field
              control={form.control}
              name="description"
              render={({ field }) => {
                return (
                  <Form.Item>
                    <Form.Label optional>{t("fields.description")}</Form.Label>
                    <Form.Control>
                      <Textarea {...field} />
                    </Form.Control>
                    <Form.ErrorMessage />
                  </Form.Item>
                )
              }}
            />

            <Form.Field
              control={form.control}
              name="is_dynamic"
              render={({ field: { value, onChange, ...field } }) => {
                return (
                  <Form.Item>
                    <div className="flex gap-2">
                      <Form.Control>
                        <Checkbox
                          checked={value}
                          onCheckedChange={(s) => onChange(s === true)}
                          {...field}
                        />
                      </Form.Control>
                      <Form.Label
                        className="cursor-pointer"
                        tooltip={t("discounts.templateHint")}
                      >
                        {t("discounts.isTemplateDiscount")}
                      </Form.Label>
                    </div>
                    {/* <Form.ErrorMessage />*/}
                  </Form.Item>
                )
              }}
            />
          </div>

          {/* CONFIGURATIONS */}
          <div className="flex flex-col gap-y-8">
            <div className="flex flex-col gap-y-1">
              <Text
                size="large"
                leading="compact"
                className="text-ui-fg-base"
                weight="plus"
              >
                {t("fields.configurations")}
              </Text>
              <Text
                size="small"
                leading="compact"
                className="text-ui-fg-subtle"
              >
                <Trans
                  t={t}
                  i18nKey="discounts.codeHint"
                  components={[<br key="break" />]}
                />
              </Text>
            </div>

            <div className="flex flex-col gap-y-4">
              <Form.Field
                control={form.control}
                name="start_date_enabled"
                render={({ field: { value, onChange, ...field } }) => (
                  <Form.Item>
                    <div className="flex items-center justify-between">
                      <Form.Label tooltip="todo">
                        {t("discounts.hasStartDate")}
                      </Form.Label>
                      <Form.Control>
                        <Switch
                          {...field}
                          checked={!!value}
                          onCheckedChange={onChange}
                        />
                      </Form.Control>
                    </div>
                    <Form.Hint className="!mt-1">
                      {t("discounts.startDateHint")}
                    </Form.Hint>
                    <Form.ErrorMessage />
                  </Form.Item>
                )}
              />
              {form.watch("start_date_enabled") && (
                <Form.Field
                  control={form.control}
                  name="start_date"
                  render={({
                    field: { value, onChange, ref: _ref, ...field },
                  }) => {
                    return (
                      <Form.Item>
                        <div className="grid grid-cols-2 gap-x-4">
                          <Form.Control>
                            <DatePicker
                              showTimePicker
                              value={value ?? undefined}
                              onChange={(v) => {
                                onChange(v ?? null)
                              }}
                              {...field}
                            />
                          </Form.Control>
                        </div>
                        <Form.ErrorMessage />
                      </Form.Item>
                    )
                  }}
                />
              )}
            </div>

            <div className="flex flex-col gap-y-4">
              <Form.Field
                control={form.control}
                name="end_date_enabled"
                render={({ field: { value, onChange, ...field } }) => {
                  return (
                    <Form.Item>
                      <div className="flex items-center justify-between">
                        <Form.Label tooltip="todo">
                          {t("discounts.hasEndDate")}
                        </Form.Label>
                        <Form.Control>
                          <Switch
                            {...field}
                            checked={!!value}
                            onCheckedChange={onChange}
                          />
                        </Form.Control>
                      </div>
                      <Form.Hint className="!mt-1">
                        {t("discounts.endDateHint")}
                      </Form.Hint>
                      <Form.ErrorMessage />
                    </Form.Item>
                  )
                }}
              />
              {form.watch("end_date_enabled") && (
                <Form.Field
                  control={form.control}
                  name="end_date"
                  render={({
                    field: { value, onChange, ref: _ref, ...field },
                  }) => {
                    return (
                      <Form.Item>
                        <div className="grid grid-cols-2 gap-x-4">
                          <Form.Control>
                            <DatePicker
                              showTimePicker
                              value={value ?? undefined}
                              onChange={(v) => {
                                onChange(v ?? null)
                              }}
                              {...field}
                            />
                          </Form.Control>
                        </div>

                        <Form.ErrorMessage />
                      </Form.Item>
                    )
                  }}
                />
              )}
            </div>
            <div className="flex flex-col gap-y-4">
              <Form.Field
                control={form.control}
                name="usage_limit_enabled"
                render={({ field }) => {
                  return (
                    <Form.Item>
                      <div className="flex items-center justify-between">
                        <Form.Label tooltip="todo">
                          {t("discounts.hasUsageLimit")}
                        </Form.Label>
                        <Form.Control>
                          <Switch
                            checked={!!field.value}
                            onCheckedChange={field.onChange}
                          />
                        </Form.Control>
                      </div>
                      <Form.Hint className="!mt-1">
                        {t("discounts.usageLimitHint")}
                      </Form.Hint>
                      <Form.ErrorMessage />
                    </Form.Item>
                  )
                }}
              />

              {form.watch("usage_limit_enabled") && (
                <Form.Field
                  control={form.control}
                  name="usage_limit"
                  render={({ field }) => {
                    return (
                      <Form.Item>
                        <Form.Control>
                          <div className="grid grid-cols-2 gap-x-4">
                            <Input
                              {...field}
                              type="number"
                              min={0}
                              onChange={(e) => {
                                const value = e.target.value

                                if (value === "") {
                                  field.onChange(null)
                                } else {
                                  field.onChange(Number(value))
                                }
                              }}
                            />
                          </div>
                        </Form.Control>
                        <Form.ErrorMessage />
                      </Form.Item>
                    )
                  }}
                />
              )}
            </div>
            <div className="flex flex-col gap-y-4">
              <Form.Field
                control={form.control}
                name="valid_duration_enabled"
                render={({ field }) => {
                  return (
                    <Form.Item>
                      <div className="flex items-center justify-between">
                        <Form.Label tooltip="todo">
                          {t("discounts.hasDurationLimit")}
                        </Form.Label>
                        <Form.Control>
                          <Switch
                            checked={!!field.value}
                            onCheckedChange={field.onChange}
                          />
                        </Form.Control>
                      </div>
                      <Form.Hint className="!mt-1">
                        {t("discounts.durationHint")}
                      </Form.Hint>
                      <Form.ErrorMessage />
                    </Form.Item>
                  )
                }}
              />
              {form.watch("valid_duration_enabled") && (
                <div className="flex items-center justify-between gap-3">
                  <Form.Field
                    control={form.control}
                    name="years"
                    render={({ field }) => {
                      return (
                        <Form.Item className="flex-1">
                          <Form.Label>{t("fields.years")}</Form.Label>
                          <Form.Control>
                            <Input
                              {...field}
                              type="number"
                              min={0}
                              onChange={(e) => {
                                const value = e.target.value

                                if (value === "") {
                                  field.onChange(null)
                                } else {
                                  field.onChange(Number(value))
                                }
                              }}
                            />
                          </Form.Control>
                          <Form.ErrorMessage />
                        </Form.Item>
                      )
                    }}
                  />
                  <Form.Field
                    control={form.control}
                    name="months"
                    render={({ field }) => {
                      return (
                        <Form.Item className="flex-1">
                          <Form.Label>{t("fields.months")}</Form.Label>
                          <Form.Control>
                            <Input
                              {...field}
                              type="number"
                              min={0}
                              onChange={(e) => {
                                const value = e.target.value

                                if (value === "") {
                                  field.onChange(null)
                                } else {
                                  field.onChange(Number(value))
                                }
                              }}
                            />
                          </Form.Control>
                          <Form.ErrorMessage />
                        </Form.Item>
                      )
                    }}
                  />
                  <Form.Field
                    control={form.control}
                    name="days"
                    render={({ field }) => {
                      return (
                        <Form.Item className="flex-1">
                          <Form.Label>{t("fields.days")}</Form.Label>
                          <Form.Control>
                            <Input
                              {...field}
                              type="number"
                              min={0}
                              onChange={(e) => {
                                const value = e.target.value

                                if (value === "") {
                                  field.onChange(null)
                                } else {
                                  field.onChange(Number(value))
                                }
                              }}
                            />
                          </Form.Control>
                          <Form.ErrorMessage />
                        </Form.Item>
                      )
                    }}
                  />
                  <Form.Field
                    control={form.control}
                    name="hours"
                    render={({ field }) => {
                      return (
                        <Form.Item className="flex-1">
                          <Form.Label>{t("fields.hours")}</Form.Label>
                          <Form.Control>
                            <Input
                              {...field}
                              type="number"
                              min={0}
                              onChange={(e) => {
                                const value = e.target.value

                                if (value === "") {
                                  field.onChange(null)
                                } else {
                                  field.onChange(Number(value))
                                }
                              }}
                            />
                          </Form.Control>
                          <Form.ErrorMessage />
                        </Form.Item>
                      )
                    }}
                  />
                  <Form.Field
                    control={form.control}
                    name="minutes"
                    render={({ field }) => {
                      return (
                        <Form.Item className="flex-1">
                          <Form.Label>{t("fields.minutes")}</Form.Label>
                          <Form.Control>
                            <Input
                              {...field}
                              type="number"
                              min={0}
                              onChange={(e) => {
                                const value = e.target.value
                                if (value === "") {
                                  field.onChange(null)
                                } else {
                                  field.onChange(Number(value))
                                }
                              }}
                            />
                          </Form.Control>
                          <Form.ErrorMessage />
                        </Form.Item>
                      )
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* CONDITIONS */}
          <div className="flex flex-col gap-y-8">
            <div className="flex flex-col gap-y-1">
              <Text
                size="large"
                leading="compact"
                className="text-ui-fg-base"
                weight="plus"
              >
                {t("fields.conditions")}
              </Text>
              <Text
                size="small"
                leading="compact"
                className="text-ui-fg-subtle"
              >
                <Trans
                  t={t}
                  i18nKey="discounts.conditionsHint"
                  components={[<br key="break" />]}
                />
              </Text>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
