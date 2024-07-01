import { zodResolver } from "@hookform/resolvers/zod"
import {
  Alert,
  Badge,
  Button,
  clx,
  CurrencyInput,
  Heading,
  Input,
  ProgressTabs,
  RadioGroup,
  Text,
  toast,
} from "@medusajs/ui"
import { useEffect, useMemo, useState } from "react"
import { useForm, useWatch } from "react-hook-form"
import { Trans, useTranslation } from "react-i18next"
import { z } from "zod"

import {
  ApplicationMethodAllocationValues,
  ApplicationMethodTargetTypeValues,
  ApplicationMethodTypeValues,
  PromotionRuleOperatorValues,
  PromotionTypeValues,
} from "@medusajs/types"
import { Divider } from "../../../../../components/common/divider"
import { Form } from "../../../../../components/common/form"
import { PercentageInput } from "../../../../../components/inputs/percentage-input"
import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/modals"
import { useCampaigns } from "../../../../../hooks/api/campaigns"
import { useCreatePromotion } from "../../../../../hooks/api/promotions"
import { getCurrencySymbol } from "../../../../../lib/currencies"
import { defaultCampaignValues } from "../../../../campaigns/campaign-create/components/create-campaign-form"
import { RulesFormField } from "../../../common/edit-rules/components/rules-form-field"
import { AddCampaignPromotionFields } from "../../../promotion-add-campaign/components/add-campaign-promotion-form"
import { Tab } from "./constants"
import { CreatePromotionSchema } from "./form-schema"
import { templates } from "./templates"

const defaultValues = {
  campaign_id: undefined,
  template_id: templates[0].id!,
  campaign_choice: "none" as "none",
  is_automatic: "false",
  code: "",
  type: "standard" as PromotionTypeValues,
  rules: [],
  application_method: {
    allocation: "each" as ApplicationMethodAllocationValues,
    type: "fixed" as ApplicationMethodTypeValues,
    target_type: "items" as ApplicationMethodTargetTypeValues,
    max_quantity: 1,
    target_rules: [],
    buy_rules: [],
  },
  campaign: undefined,
}

export const CreatePromotionForm = () => {
  const [tab, setTab] = useState<Tab>(Tab.TYPE)
  const [detailsValidated, setDetailsValidated] = useState(false)

  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<z.infer<typeof CreatePromotionSchema>>({
    defaultValues,
    resolver: zodResolver(CreatePromotionSchema),
  })

  const { mutateAsync: createPromotion } = useCreatePromotion()

  const handleSubmit = form.handleSubmit(
    async (data) => {
      const {
        campaign_choice,
        is_automatic,
        template_id,
        application_method,
        rules,
        ...promotionData
      } = data
      const {
        target_rules: targetRulesData = [],
        buy_rules: buyRulesData = [],
        ...applicationMethodData
      } = application_method

      const disguisedRules = [
        ...targetRulesData.filter((r) => !!r.disguised),
        ...buyRulesData.filter((r) => !!r.disguised),
        ...rules.filter((r) => !!r.disguised),
      ]

      const applicationMethodRuleData: Record<any, any> = {}

      for (const rule of disguisedRules) {
        applicationMethodRuleData[rule.attribute] =
          rule.field_type === "number"
            ? parseInt(rule.values as string)
            : rule.values
      }

      const buildRulesData = (
        rules: {
          operator: string
          attribute: string
          values: any[] | any
          disguised?: boolean
        }[]
      ) => {
        return rules
          .filter((r) => !r.disguised)
          .map((rule) => ({
            operator: rule.operator as PromotionRuleOperatorValues,
            attribute: rule.attribute,
            values: rule.values,
          }))
      }

      createPromotion({
        ...promotionData,
        rules: buildRulesData(rules),
        application_method: {
          ...applicationMethodData,
          ...applicationMethodRuleData,
          target_rules: buildRulesData(targetRulesData),
          buy_rules: buildRulesData(buyRulesData),
        },
        is_automatic: is_automatic === "true",
      })
        .then(() => handleSuccess())
        .catch((e) => {
          toast.error(t("general.error"), {
            description: e.message,
            dismissLabel: t("general.close"),
          })
        })
    },
    async (error) => {
      const { campaign, ...rest } = error || {}
      const errorInPromotionTab = !!Object.keys(rest || {}).length

      if (errorInPromotionTab) {
        toast.error(t("general.error"), {
          description: t("promotions.errors.promotionTabError"),
          dismissLabel: t("general.close"),
        })
      }
    }
  )

  const handleContinue = async () => {
    switch (tab) {
      case Tab.TYPE:
        setTab(Tab.PROMOTION)
        break
      case Tab.PROMOTION:
        const valid = await form.trigger()

        if (valid) {
          setTab(Tab.CAMPAIGN)
        } else {
          // TODO: Set errors on the root level
        }

        break
      case Tab.CAMPAIGN:
        break
    }
  }

  const handleTabChange = (tab: Tab) => {
    switch (tab) {
      case Tab.TYPE:
        setDetailsValidated(false)
        setTab(tab)
        break
      case Tab.PROMOTION:
        setDetailsValidated(false)
        setTab(tab)
        break
      case Tab.CAMPAIGN:
        setDetailsValidated(false)
        setTab(tab)
        break
    }
  }

  const watchTemplateId = useWatch({
    control: form.control,
    name: "template_id",
  })

  const currentTemplate = useMemo(() => {
    const currentTemplate = templates.find(
      (template) => template.id === watchTemplateId
    )

    if (!currentTemplate) {
      return
    }

    form.reset({ ...defaultValues, template_id: watchTemplateId })

    for (const [key, value] of Object.entries(currentTemplate.defaults)) {
      if (typeof value === "object") {
        for (const [subKey, subValue] of Object.entries(value)) {
          form.setValue(`application_method.${subKey}`, subValue)
        }
      } else {
        form.setValue(key, value)
      }
    }

    return currentTemplate
  }, [watchTemplateId])

  const watchValueType = useWatch({
    control: form.control,
    name: "application_method.type",
  })

  const isFixedValueType = watchValueType === "fixed"
  const watchAllocation = useWatch({
    control: form.control,
    name: "application_method.allocation",
  })

  useEffect(() => {
    if (watchAllocation === "across") {
      form.setValue("application_method.max_quantity", null)
    }
  }, [watchAllocation])

  const watchType = useWatch({
    control: form.control,
    name: "type",
  })

  const isTypeStandard = watchType === "standard"

  const targetType = useWatch({
    control: form.control,
    name: "application_method.target_type",
  })

  const isTargetTypeOrder = targetType === "order"

  const formData = form.getValues()
  let campaignQuery: object = {}

  if (isFixedValueType && formData.application_method.currency_code) {
    campaignQuery = {
      budget: { currency_code: formData.application_method.currency_code },
    }
  }

  const { campaigns } = useCampaigns(campaignQuery)

  const detailsProgress = useMemo(() => {
    if (detailsValidated) {
      return "completed"
    }

    return "not-started"
  }, [detailsValidated])

  const watchCampaignChoice = useWatch({
    control: form.control,
    name: "campaign_choice",
  })

  useEffect(() => {
    const formData = form.getValues()

    if (watchCampaignChoice !== "existing") {
      form.setValue("campaign_id", undefined)
    }

    if (watchCampaignChoice !== "new") {
      form.setValue("campaign", undefined)
    }

    if (watchCampaignChoice === "new") {
      if (!formData.campaign || !formData.campaign?.budget?.type) {
        form.setValue("campaign", {
          ...defaultCampaignValues,
          budget: {
            ...defaultCampaignValues.budget,
            currency_code: formData.application_method.currency_code,
          },
        })
      }
    }
  }, [watchCampaignChoice])

  const watchRules = useWatch({
    control: form.control,
    name: "rules",
  })

  const watchCurrencyRule = watchRules.find(
    (rule) => rule.attribute === "currency_code"
  )

  if (watchCurrencyRule) {
    const formData = form.getValues()
    const currencyCode = formData.application_method.currency_code
    const ruleValue = watchCurrencyRule.values

    if (!Array.isArray(ruleValue) && currencyCode !== ruleValue) {
      form.setValue("application_method.currency_code", ruleValue as string)
    }
  }

  return (
    <RouteFocusModal.Form form={form}>
      <form
        className="flex h-full flex-col overflow-scroll"
        onSubmit={handleSubmit}
      >
        <ProgressTabs
          value={tab}
          onValueChange={(tab) => handleTabChange(tab as Tab)}
        >
          <RouteFocusModal.Header>
            <div className="flex w-full items-center justify-between gap-x-4">
              <div className="-my-2 w-full max-w-[400px] border-l">
                <ProgressTabs.List className="grid w-full grid-cols-3">
                  <ProgressTabs.Trigger
                    className="w-full"
                    value={Tab.TYPE}
                    status={detailsProgress}
                  >
                    {t("promotions.tabs.template")}
                  </ProgressTabs.Trigger>

                  <ProgressTabs.Trigger
                    className="w-full"
                    value={Tab.PROMOTION}
                  >
                    {t("promotions.tabs.promotion")}
                  </ProgressTabs.Trigger>

                  <ProgressTabs.Trigger className="w-full" value={Tab.CAMPAIGN}>
                    {t("promotions.tabs.campaign")}
                  </ProgressTabs.Trigger>
                </ProgressTabs.List>
              </div>

              <div className="flex items-center gap-x-2">
                <RouteFocusModal.Close asChild>
                  <Button variant="secondary" size="small">
                    {t("actions.cancel")}
                  </Button>
                </RouteFocusModal.Close>

                {tab === Tab.CAMPAIGN ? (
                  <Button
                    key="save-btn"
                    type="submit"
                    size="small"
                    isLoading={false}
                  >
                    {t("actions.save")}
                  </Button>
                ) : (
                  <Button
                    key="continue-btn"
                    type="button"
                    onClick={handleContinue}
                    size="small"
                  >
                    {t("actions.continue")}
                  </Button>
                )}
              </div>
            </div>
          </RouteFocusModal.Header>

          <RouteFocusModal.Body className="mx-auto my-20 w-[800px]">
            <ProgressTabs.Content value={Tab.TYPE}>
              <Form.Field
                control={form.control}
                name="template_id"
                render={({ field }) => {
                  return (
                    <Form.Item>
                      <Form.Label>{t("promotions.fields.type")}</Form.Label>

                      <Form.Control>
                        <RadioGroup
                          key={"template_id"}
                          className="flex-col gap-y-3"
                          {...field}
                          onValueChange={field.onChange}
                        >
                          {templates.map((template) => {
                            return (
                              <RadioGroup.ChoiceBox
                                key={template.id}
                                value={template.id}
                                label={template.title}
                                description={template.description}
                              />
                            )
                          })}
                        </RadioGroup>
                      </Form.Control>
                      <Form.ErrorMessage />
                    </Form.Item>
                  )
                }}
              />
            </ProgressTabs.Content>

            <ProgressTabs.Content
              value={Tab.PROMOTION}
              className="flex flex-1 flex-col gap-8"
            >
              <Heading level="h1" className="text-fg-base">
                {t(`promotions.sections.details`)}

                {currentTemplate?.title && (
                  <Badge
                    className="ml-2 align-middle"
                    color="grey"
                    size="2xsmall"
                    rounded="full"
                  >
                    {currentTemplate?.title}
                  </Badge>
                )}
              </Heading>

              {form.formState.errors.root && (
                <Alert
                  variant="error"
                  dismissible={false}
                  className="text-balance"
                >
                  {form.formState.errors.root.message}
                </Alert>
              )}

              <Form.Field
                control={form.control}
                name="is_automatic"
                render={({ field }) => {
                  return (
                    <Form.Item>
                      <Form.Label>Method</Form.Label>

                      <Form.Control>
                        <RadioGroup
                          className="flex gap-y-3"
                          {...field}
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <RadioGroup.ChoiceBox
                            value={"false"}
                            label={t("promotions.form.method.code.title")}
                            description={t(
                              "promotions.form.method.code.description"
                            )}
                            className={clx("basis-1/2")}
                          />

                          <RadioGroup.ChoiceBox
                            value={"true"}
                            label={t("promotions.form.method.automatic.title")}
                            description={t(
                              "promotions.form.method.automatic.description"
                            )}
                            className={clx("basis-1/2")}
                          />
                        </RadioGroup>
                      </Form.Control>
                      <Form.ErrorMessage />
                    </Form.Item>
                  )
                }}
              />

              <div className="flex gap-y-4">
                <Form.Field
                  control={form.control}
                  name="code"
                  render={({ field }) => {
                    return (
                      <Form.Item className="basis-1/2">
                        <Form.Label>
                          {t("promotions.form.code.title")}
                        </Form.Label>

                        <Form.Control>
                          <Input {...field} placeholder="SUMMER15" />
                        </Form.Control>

                        <Text
                          size="small"
                          leading="compact"
                          className="text-ui-fg-subtle"
                        >
                          <Trans
                            t={t}
                            i18nKey="promotions.form.code.description"
                            components={[<br key="break" />]}
                          />
                        </Text>
                      </Form.Item>
                    )
                  }}
                />
              </div>

              {!currentTemplate?.hiddenFields?.includes("type") && (
                <Form.Field
                  control={form.control}
                  name="type"
                  render={({ field }) => {
                    return (
                      <Form.Item>
                        <Form.Label>{t("promotions.fields.type")}</Form.Label>
                        <Form.Control>
                          <RadioGroup
                            className="flex gap-y-3"
                            {...field}
                            onValueChange={field.onChange}
                          >
                            <RadioGroup.ChoiceBox
                              value={"standard"}
                              label={t("promotions.form.type.standard.title")}
                              description={t(
                                "promotions.form.type.standard.description"
                              )}
                              className={clx("basis-1/2")}
                            />

                            <RadioGroup.ChoiceBox
                              value={"buyget"}
                              label={t("promotions.form.type.buyget.title")}
                              description={t(
                                "promotions.form.type.buyget.description"
                              )}
                              className={clx("basis-1/2")}
                            />
                          </RadioGroup>
                        </Form.Control>
                        <Form.ErrorMessage />
                      </Form.Item>
                    )
                  }}
                />
              )}

              <Divider />

              <RulesFormField form={form} ruleType={"rules"} />

              <Divider />

              {!currentTemplate?.hiddenFields?.includes(
                "application_method.type"
              ) && (
                <Form.Field
                  control={form.control}
                  name="application_method.type"
                  render={({ field }) => {
                    return (
                      <Form.Item>
                        <Form.Label>
                          {t("promotions.fields.value_type")}
                        </Form.Label>
                        <Form.Control>
                          <RadioGroup
                            className="flex gap-y-3"
                            {...field}
                            onValueChange={field.onChange}
                          >
                            <RadioGroup.ChoiceBox
                              value={"fixed"}
                              label={t(
                                "promotions.form.value_type.fixed.title"
                              )}
                              description={t(
                                "promotions.form.value_type.fixed.description"
                              )}
                              className={clx("basis-1/2")}
                            />

                            <RadioGroup.ChoiceBox
                              value={"percentage"}
                              label={t(
                                "promotions.form.value_type.percentage.title"
                              )}
                              description={t(
                                "promotions.form.value_type.percentage.description"
                              )}
                              className={clx("basis-1/2")}
                            />
                          </RadioGroup>
                        </Form.Control>
                        <Form.ErrorMessage />
                      </Form.Item>
                    )
                  }}
                />
              )}

              <div className="flex gap-y-4 gap-x-2">
                {!currentTemplate?.hiddenFields?.includes(
                  "application_method.value"
                ) && (
                  <Form.Field
                    control={form.control}
                    name="application_method.value"
                    render={({ field: { onChange, value, ...field } }) => {
                      const currencyCode =
                        form.getValues().application_method.currency_code

                      return (
                        <Form.Item className="basis-1/2">
                          <Form.Label
                            tooltip={
                              currencyCode || !isFixedValueType
                                ? undefined
                                : t("promotions.fields.amount.tooltip")
                            }
                          >
                            {t("promotions.form.value.title")}
                          </Form.Label>

                          <Form.Control>
                            {isFixedValueType ? (
                              <CurrencyInput
                                {...field}
                                min={0}
                                onValueChange={(value) => {
                                  onChange(value ? parseInt(value) : "")
                                }}
                                code={currencyCode}
                                symbol={
                                  currencyCode
                                    ? getCurrencySymbol(currencyCode)
                                    : ""
                                }
                                value={value}
                                disabled={!currencyCode}
                              />
                            ) : (
                              <PercentageInput
                                key="amount"
                                className="text-right"
                                min={0}
                                max={100}
                                {...field}
                                value={value}
                                onChange={(e) => {
                                  onChange(
                                    e.target.value === ""
                                      ? null
                                      : parseInt(e.target.value)
                                  )
                                }}
                              />
                            )}
                          </Form.Control>
                          <Text
                            size="small"
                            leading="compact"
                            className="text-ui-fg-subtle"
                          >
                            <Trans
                              t={t}
                              i18nKey={
                                isFixedValueType
                                  ? "promotions.form.value_type.fixed.description"
                                  : "promotions.form.value_type.percentage.description"
                              }
                              components={[<br key="break" />]}
                            />
                          </Text>
                          <Form.ErrorMessage />
                        </Form.Item>
                      )
                    }}
                  />
                )}

                {isTypeStandard && watchAllocation === "each" && (
                  <Form.Field
                    control={form.control}
                    name="application_method.max_quantity"
                    render={({ field }) => {
                      return (
                        <Form.Item className="basis-1/2">
                          <Form.Label>
                            {t("promotions.form.max_quantity.title")}
                          </Form.Label>

                          <Form.Control>
                            <Input
                              {...form.register(
                                "application_method.max_quantity",
                                { valueAsNumber: true }
                              )}
                              type="number"
                              min={1}
                              placeholder="3"
                            />
                          </Form.Control>

                          <Text
                            size="small"
                            leading="compact"
                            className="text-ui-fg-subtle"
                          >
                            <Trans
                              t={t}
                              i18nKey="promotions.form.max_quantity.description"
                              components={[<br key="break" />]}
                            />
                          </Text>
                        </Form.Item>
                      )
                    }}
                  />
                )}
              </div>

              {isTypeStandard &&
                !currentTemplate?.hiddenFields?.includes(
                  "application_method.allocation"
                ) && (
                  <Form.Field
                    control={form.control}
                    name="application_method.allocation"
                    render={({ field }) => {
                      return (
                        <Form.Item>
                          <Form.Label>
                            {t("promotions.fields.allocation")}
                          </Form.Label>

                          <Form.Control>
                            <RadioGroup
                              className="flex gap-y-3"
                              {...field}
                              onValueChange={field.onChange}
                            >
                              <RadioGroup.ChoiceBox
                                value={"each"}
                                label={t(
                                  "promotions.form.allocation.each.title"
                                )}
                                description={t(
                                  "promotions.form.allocation.each.description"
                                )}
                                className={clx("basis-1/2")}
                              />

                              <RadioGroup.ChoiceBox
                                value={"across"}
                                label={t(
                                  "promotions.form.allocation.across.title"
                                )}
                                description={t(
                                  "promotions.form.allocation.across.description"
                                )}
                                className={clx("basis-1/2")}
                              />
                            </RadioGroup>
                          </Form.Control>
                          <Form.ErrorMessage />
                        </Form.Item>
                      )
                    }}
                  />
                )}

              {!isTypeStandard && (
                <>
                  <RulesFormField
                    form={form}
                    ruleType={"buy-rules"}
                    scope="application_method.buy_rules"
                  />
                </>
              )}

              {!isTargetTypeOrder && (
                <>
                  <Divider />
                  <RulesFormField
                    form={form}
                    ruleType={"target-rules"}
                    scope="application_method.target_rules"
                  />
                </>
              )}
            </ProgressTabs.Content>

            <ProgressTabs.Content
              value={Tab.CAMPAIGN}
              className="flex flex-col items-center"
            >
              <AddCampaignPromotionFields
                form={form}
                campaigns={campaigns || []}
              />
            </ProgressTabs.Content>
          </RouteFocusModal.Body>
        </ProgressTabs>
      </form>
    </RouteFocusModal.Form>
  )
}
