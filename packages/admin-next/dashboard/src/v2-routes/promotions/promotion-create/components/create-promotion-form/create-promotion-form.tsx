import { zodResolver } from "@hookform/resolvers/zod"
import {
  Alert,
  Button,
  CurrencyInput,
  Input,
  ProgressTabs,
  RadioGroup,
  Text,
} from "@medusajs/ui"
import { useEffect, useMemo, useState } from "react"
import { useFieldArray, useForm, useWatch } from "react-hook-form"
import { Trans, useTranslation } from "react-i18next"
import { z } from "zod"

import { Form } from "../../../../../components/common/form"
import { PercentageInput } from "../../../../../components/common/percentage-input"
import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/route-modal"
import { useCreatePromotion } from "../../../../../hooks/api/promotions"
import { getCurrencySymbol } from "../../../../../lib/currencies"
import { RulesFormField } from "../../../edit-rules/components/edit-rules-form"
import { AddCampaignPromotionFields } from "../../../promotion-add-campaign/components/add-campaign-promotion-form"
import { Tab } from "./constants"
import { CreatePromotionContext } from "./context"
import { CreatePromotionSchema } from "./form-schema"
import { templates } from "./templates"

export const CreatePromotionForm = ({
  ruleAttributes,
  targetRuleAttributes,
  buyRuleAttributes,
  operators,
  rules,
  targetRules,
  buyRules,
  campaigns,
}) => {
  const [tab, setTab] = useState<Tab>(Tab.TYPE)
  const [detailsValidated, setDetailsValidated] = useState(false)

  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const generateRuleAttributes = (rules) =>
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
      existing: "true",
      is_automatic: "false",
      code: "",
      type: "standard",
      rules: generateRuleAttributes(rules),
      application_method: {
        value: 100,
        allocation: "each",
        type: "fixed",
        target_type: "items",
        max_quantity: 1,
        target_rules: generateRuleAttributes(targetRules),
        buy_rules: generateRuleAttributes(buyRules),
      },
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
        existing,
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

      const disguisedRuleAttributes = [
        ...targetRules.filter((r) => !!r.disguised),
        ...buyRules.filter((r) => !!r.disguised),
      ].map((r) => r.attribute)

      const attr: Record<any, any> = {}

      for (const rule of [...targetRulesData, ...buyRulesData]) {
        if (disguisedRuleAttributes.includes(rule.attribute)) {
          attr[rule.attribute] = rule.values
        }
      }

      createPromotion({
        ...promotionData,
        rules: rules.map((rule) => ({
          operator: rule.operator,
          attribute: rule.attribute,
          values: rule.values,
        })),
        application_method: {
          ...applicationMethodData,
          ...attr,
          target_rules: targetRulesData
            .filter((r) => !disguisedRuleAttributes.includes(r.attribute))
            .map((rule) => ({
              operator: rule.operator,
              attribute: rule.attribute,
              values: rule.values,
            })),
          buy_rules: buyRulesData
            .filter((r) => !disguisedRuleAttributes.includes(r.attribute))
            .map((rule) => ({
              operator: rule.operator,
              attribute: rule.attribute,
              values: rule.values,
            })),
        },
        is_automatic: is_automatic === "true",
      }).then(() => handleSuccess())
    },
    async (error) => {
      console.log("error - ", error)
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
          console.log("subKey - ", subKey)
          console.log("subValue - ", subValue)
          form.setValue(subKey, subValue)
        }
      } else {
        console.log("key - ", key)
        console.log("value - ", value)
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

  return (
    <CreatePromotionContext.Provider
      value={useMemo(
        () => ({
          custom: {
            items: () => {},
            remove: () => {},
            update: () => {},
          },
          variants: {
            items: () => {},
            remove: () => {},
            update: () => {},
            rebase: () => {},
          },
          form,
        }),
        []
      )}
    >
      <RouteFocusModal.Form form={form}>
        <form
          className="flex h-full flex-col overflow-scroll"
          onSubmit={handleSubmit}
        >
          <ProgressTabs
            value={tab}
            onValueChange={(tab) => handleTabChange(tab as Tab)}
            className=""
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

                    <ProgressTabs.Trigger
                      className="w-full"
                      value={Tab.CAMPAIGN}
                    >
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

            <RouteFocusModal.Body className="w-[800px] mx-auto my-20">
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
                className="flex flex-col gap-10 flex-1"
              >
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
                              className="basis-1/2"
                              value={"false"}
                              label={t("promotions.form.method.code.title")}
                              description={t(
                                "promotions.form.method.code.description"
                              )}
                            />
                            <RadioGroup.ChoiceBox
                              className="basis-1/2"
                              value={"true"}
                              label={t(
                                "promotions.form.method.automatic.title"
                              )}
                              description={t(
                                "promotions.form.method.automatic.description"
                              )}
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
                              className="basis-1/2"
                              value={"fixed"}
                              label={t(
                                "promotions.form.value_type.fixed.title"
                              )}
                              description={t(
                                "promotions.form.value_type.fixed.description"
                              )}
                            />

                            <RadioGroup.ChoiceBox
                              className="basis-1/2"
                              value={"percentage"}
                              label={t(
                                "promotions.form.value_type.percentage.title"
                              )}
                              description={t(
                                "promotions.form.value_type.percentage.description"
                              )}
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
                    render={({ field: { onChange, ...field } }) => {
                      return (
                        <Form.Item className="basis-1/2">
                          <Form.Label>
                            {isFixedValueType
                              ? t("fields.amount")
                              : t("fields.percentage")}
                          </Form.Label>
                          <Form.Control>
                            {isFixedValueType ? (
                              <CurrencyInput
                                min={0}
                                onValueChange={onChange}
                                code={"USD"}
                                symbol={getCurrencySymbol("USD")}
                                {...field}
                                value={field.value}
                              />
                            ) : (
                              <PercentageInput
                                key="amount"
                                className="text-right"
                                min={0}
                                max={100}
                                {...field}
                                value={field.value}
                                onChange={(e) => {
                                  onChange(
                                    e.target.value === ""
                                      ? null
                                      : e.target.value
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
                              className="basis-1/2"
                              value={"standard"}
                              label={t("promotions.form.type.standard.title")}
                              description={t(
                                "promotions.form.type.standard.description"
                              )}
                            />

                            <RadioGroup.ChoiceBox
                              className="basis-1/2"
                              value={"buyget"}
                              label={t("promotions.form.type.buyget.title")}
                              description={t(
                                "promotions.form.type.buyget.description"
                              )}
                            />
                          </RadioGroup>
                        </Form.Control>
                        <Form.ErrorMessage />
                      </Form.Item>
                    )
                  }}
                />

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
                                className="basis-1/2"
                                value={"each"}
                                label={t(
                                  "promotions.form.allocation.each.title"
                                )}
                                description={t(
                                  "promotions.form.allocation.each.description"
                                )}
                              />

                              <RadioGroup.ChoiceBox
                                className="basis-1/2"
                                value={"across"}
                                label={t(
                                  "promotions.form.allocation.across.title"
                                )}
                                description={t(
                                  "promotions.form.allocation.across.description"
                                )}
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
                                  {
                                    valueAsNumber: true,
                                  }
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
    </CreatePromotionContext.Provider>
  )
}
