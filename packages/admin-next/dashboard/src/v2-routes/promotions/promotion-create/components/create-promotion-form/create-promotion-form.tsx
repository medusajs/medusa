import { zodResolver } from "@hookform/resolvers/zod"
import {
  Alert,
  Button,
  clx,
  CurrencyInput,
  Heading,
  Input,
  ProgressTabs,
  RadioGroup,
  Text,
} from "@medusajs/ui"
import { useEffect, useMemo, useState } from "react"
import { useFieldArray, useForm, useWatch } from "react-hook-form"
import { Trans, useTranslation } from "react-i18next"
import { z } from "zod"

import {
  CampaignResponse,
  PromotionRuleOperatorValues,
  PromotionRuleResponse,
  RuleAttributeOptionsResponse,
  RuleOperatorOptionsResponse,
} from "@medusajs/types"
import { Divider } from "../../../../../components/common/divider"
import { Form } from "../../../../../components/common/form"
import { PercentageInput } from "../../../../../components/inputs/percentage-input"
import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/route-modal"
import { useCreatePromotion } from "../../../../../hooks/api/promotions"
import { getCurrencySymbol } from "../../../../../lib/currencies"
import { defaultCampaignValues } from "../../../../campaigns/campaign-create/components/create-campaign-form"
import { RulesFormField } from "../../../common/edit-rules/components/rules-form-field"
import { AddCampaignPromotionFields } from "../../../promotion-add-campaign/components/add-campaign-promotion-form"
import { Tab } from "./constants"
import { CreatePromotionSchema } from "./form-schema"
import { templates } from "./templates"

type CreatePromotionFormProps = {
  ruleAttributes: RuleAttributeOptionsResponse[]
  targetRuleAttributes: RuleAttributeOptionsResponse[]
  buyRuleAttributes: RuleAttributeOptionsResponse[]
  operators: RuleOperatorOptionsResponse[]
  rules: PromotionRuleResponse[]
  targetRules: PromotionRuleResponse[]
  buyRules: PromotionRuleResponse[]
  campaigns: CampaignResponse[]
}

export const CreatePromotionForm = ({
  ruleAttributes,
  targetRuleAttributes,
  buyRuleAttributes,
  operators,
  rules,
  targetRules,
  buyRules,
  campaigns,
}: CreatePromotionFormProps) => {
  const [tab, setTab] = useState<Tab>(Tab.TYPE)
  const [detailsValidated, setDetailsValidated] = useState(false)

  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const generateRuleAttributes = (rules: PromotionRuleResponse[]) =>
    rules.map((rule) => ({
      id: rule.id,
      required: rule.required,
      field_type: rule.field_type,
      disguised: rule.disguised,
      attribute: rule.attribute!,
      operator: rule.operator!,
      values: rule?.values?.map((v: { value: string }) => v.value!),
    }))

  const form = useForm<z.infer<typeof CreatePromotionSchema>>({
    defaultValues: {
      campaign_id: undefined,
      template_id: templates[0].id!,
      campaign_choice: "none",
      is_automatic: "false",
      code: "",
      type: "standard",
      rules: generateRuleAttributes(rules),
      application_method: {
        allocation: "each",
        type: "fixed",
        target_type: "items",
        max_quantity: 1,
        target_rules: generateRuleAttributes(targetRules),
        buy_rules: generateRuleAttributes(buyRules),
      },
      campaign: undefined,
    },
    resolver: zodResolver(CreatePromotionSchema),
  })

  const {
    fields: ruleFields,
    append: appendRule,
    remove: removeRule,
    update: updateRule,
  } = useFieldArray({
    control: form.control,
    name: "rules",
    keyName: "rules_id",
  })

  const {
    fields: targetRuleFields,
    append: appendTargetRule,
    remove: removeTargetRule,
    update: updateTargetRule,
  } = useFieldArray({
    control: form.control,
    name: "application_method.target_rules",
    keyName: "target_rules_id",
  })

  const {
    fields: buyRuleFields,
    append: appendBuyRule,
    remove: removeBuyRule,
    update: updateBuyRule,
  } = useFieldArray({
    control: form.control,
    name: "application_method.buy_rules",
    keyName: "buy_rules_id",
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

      const buildRulesData = (rules: {
        operator: string,
        attribute: string,
        values: any[] | any,
        disguised?: boolean
      }[]) => {
        return rules
          .filter((r) => !r.disguised)
          .map((rule) => ({
            operator: rule.operator as PromotionRuleOperatorValues,
            attribute: rule.attribute,
            values: rule.values,
          })),
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
      }).then(() => handleSuccess())
    },
    async (error) => {
      // TODO: showcase error when something goes wrong
      // Wait for alert component and use it here
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

  useMemo(() => {
    const currentTemplate = templates.find(
      (template) => template.id === watchTemplateId
    )

    if (!currentTemplate) {
      return
    }

    for (const [key, value] of Object.entries(currentTemplate.defaults)) {
      if (typeof value === "object") {
        for (const [subKey, subValue] of Object.entries(value)) {
          form.setValue(`application_method.${subKey}`, subValue)
        }
      } else {
        form.setValue(key, value)
      }
    }
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

  const isAllocationEach = watchAllocation === "each"

  const watchType = useWatch({
    control: form.control,
    name: "type",
  })

  const isTypeStandard = watchType === "standard"

  useEffect(() => {
    if (isTypeStandard) {
      form.setValue("application_method.buy_rules", undefined)
    } else {
      form.setValue(
        "application_method.buy_rules",
        generateRuleAttributes(buyRules)
      )
    }
  }, [isTypeStandard])

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
          currency: formData.application_method.currency_code,
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
      form.setValue(
        "application_method.currency_code",
        watchCurrencyRule.values as string
      )
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
                    {t("fields.type")}
                  </ProgressTabs.Trigger>

                  <ProgressTabs.Trigger
                    className="w-full"
                    value={Tab.PROMOTION}
                  >
                    {t("fields.details")}
                  </ProgressTabs.Trigger>

                  <ProgressTabs.Trigger className="w-full" value={Tab.CAMPAIGN}>
                    {t("promotions.fields.campaign")}
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
                                className={clx("border", {
                                  "border border-ui-border-interactive":
                                    template.id === field.value,
                                })}
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
              className="flex flex-1 flex-col gap-10"
            >
              <Heading level="h2">{t(`promotions.sections.details`)}</Heading>

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
                            className={clx("basis-1/2 border", {
                              "border border-ui-border-interactive":
                                "false" === field.value,
                            })}
                          />

                          <RadioGroup.ChoiceBox
                            value={"true"}
                            label={t("promotions.form.method.automatic.title")}
                            description={t(
                              "promotions.form.method.automatic.description"
                            )}
                            className={clx("basis-1/2 border", {
                              "border border-ui-border-interactive":
                                "true" === field.value,
                            })}
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
                            className={clx("basis-1/2 border", {
                              "border border-ui-border-interactive":
                                "standard" === field.value,
                            })}
                          />

                          <RadioGroup.ChoiceBox
                            value={"buyget"}
                            label={t("promotions.form.type.buyget.title")}
                            description={t(
                              "promotions.form.type.buyget.description"
                            )}
                            className={clx("basis-1/2 border", {
                              "border border-ui-border-interactive":
                                "buyget" === field.value,
                            })}
                          />
                        </RadioGroup>
                      </Form.Control>
                      <Form.ErrorMessage />
                    </Form.Item>
                  )
                }}
              />

              <Divider />

              <RulesFormField
                form={form}
                ruleType={"rules"}
                attributes={ruleAttributes}
                operators={operators}
                fields={ruleFields}
                appendRule={appendRule}
                removeRule={removeRule}
                updateRule={updateRule}
              />

              <Divider />

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
                            label={t("promotions.form.value_type.fixed.title")}
                            description={t(
                              "promotions.form.value_type.fixed.description"
                            )}
                            className={clx("basis-1/2 border", {
                              "border border-ui-border-interactive":
                                "fixed" === field.value,
                            })}
                          />

                          <RadioGroup.ChoiceBox
                            value={"percentage"}
                            label={t(
                              "promotions.form.value_type.percentage.title"
                            )}
                            description={t(
                              "promotions.form.value_type.percentage.description"
                            )}
                            className={clx("basis-1/2 border", {
                              "border border-ui-border-interactive":
                                "percentage" === field.value,
                            })}
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
                          {isFixedValueType
                            ? t("fields.amount")
                            : t("fields.percentage")}
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
                        <Form.ErrorMessage />
                      </Form.Item>
                    )
                  }}
                />
              </div>

              {isTypeStandard && (
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
                              label={t("promotions.form.allocation.each.title")}
                              description={t(
                                "promotions.form.allocation.each.description"
                              )}
                              className={clx("basis-1/2 border", {
                                "border border-ui-border-interactive":
                                  "each" === field.value,
                              })}
                            />

                            <RadioGroup.ChoiceBox
                              value={"across"}
                              label={t(
                                "promotions.form.allocation.across.title"
                              )}
                              description={t(
                                "promotions.form.allocation.across.description"
                              )}
                              className={clx("basis-1/2 border", {
                                "border border-ui-border-interactive":
                                  "across" === field.value,
                              })}
                            />
                          </RadioGroup>
                        </Form.Control>
                        <Form.ErrorMessage />
                      </Form.Item>
                    )
                  }}
                />
              )}

              {isTypeStandard && isAllocationEach && (
                <div className="flex gap-y-4">
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
                </div>
              )}

              <Divider />

              <RulesFormField
                form={form}
                ruleType={"target-rules"}
                attributes={targetRuleAttributes}
                operators={operators}
                fields={targetRuleFields}
                appendRule={appendTargetRule}
                removeRule={removeTargetRule}
                updateRule={updateTargetRule}
                scope="application_method.target_rules"
              />

              <Divider />

              {!isTypeStandard && (
                <RulesFormField
                  form={form}
                  ruleType={"buy-rules"}
                  attributes={buyRuleAttributes}
                  operators={operators}
                  fields={buyRuleFields}
                  appendRule={appendBuyRule}
                  removeRule={removeBuyRule}
                  updateRule={updateBuyRule}
                  scope="application_method.buy_rules"
                />
              )}
            </ProgressTabs.Content>

            <ProgressTabs.Content
              value={Tab.CAMPAIGN}
              className="flex flex-col items-center"
            >
              <AddCampaignPromotionFields form={form} campaigns={campaigns} />
            </ProgressTabs.Content>
          </RouteFocusModal.Body>
        </ProgressTabs>
      </form>
    </RouteFocusModal.Form>
  )
}
