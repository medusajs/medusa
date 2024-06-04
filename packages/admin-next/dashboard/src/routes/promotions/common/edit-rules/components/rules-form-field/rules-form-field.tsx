import { XMarkMini } from "@medusajs/icons"
import { PromotionRuleResponse } from "@medusajs/types"
import { Badge, Button, Heading, Select, Text } from "@medusajs/ui"
import { Fragment, useEffect } from "react"
import { useFieldArray, UseFormReturn, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { Form } from "../../../../../../components/common/form"
import {
  usePromotionRuleAttributes,
  usePromotionRuleOperators,
  usePromotionRules,
} from "../../../../../../hooks/api/promotions"
import { CreatePromotionSchemaType } from "../../../../promotion-create/components/create-promotion-form/form-schema"
import { RuleValueFormField } from "../rule-value-form-field"
import { requiredProductRule } from "./constants"

type RulesFormFieldType = {
  promotionId?: string
  form: UseFormReturn<CreatePromotionSchemaType>
  ruleType: "rules" | "target-rules" | "buy-rules"
  setRulesToRemove?: any
  rulesToRemove?: any
  scope?:
    | "application_method.buy_rules"
    | "rules"
    | "application_method.target_rules"
}

const generateRuleAttributes = (rules?: PromotionRuleResponse[]) =>
  (rules || []).map((rule) => ({
    id: rule.id,
    required: rule.required,
    field_type: rule.field_type,
    disguised: rule.disguised,
    attribute: rule.attribute!,
    operator: rule.operator!,
    values:
      rule.field_type === "number"
        ? rule.values
        : rule?.values?.map((v: { value: string }) => v.value!),
  }))

export const RulesFormField = ({
  form,
  ruleType,
  setRulesToRemove,
  rulesToRemove,
  scope = "rules",
  promotionId,
}: RulesFormFieldType) => {
  const { t } = useTranslation()
  const formData = form.getValues()
  const { attributes } = usePromotionRuleAttributes(ruleType, formData.type)
  const { operators } = usePromotionRuleOperators()

  const { fields, append, remove, update, replace } = useFieldArray({
    control: form.control,
    name: scope,
    keyName: scope,
  })

  const promotionType: string = useWatch({
    control: form.control,
    name: "type",
  })

  const query: Record<string, string> = promotionType
    ? { promotion_type: promotionType }
    : {}

  const { rules, isLoading } = usePromotionRules(
    promotionId || null,
    ruleType,
    query
  )

  useEffect(() => {
    if (isLoading) {
      return
    }

    if (ruleType === "rules" && !fields.length) {
      replace(generateRuleAttributes(rules) as any)
    }

    if (ruleType === "rules" && promotionType === "standard") {
      form.resetField("application_method.buy_rules")
      form.resetField("application_method.target_rules")
    }

    if (
      ["buy-rules", "target-rules"].includes(ruleType) &&
      promotionType === "standard"
    ) {
      form.resetField(scope)
      replace([])
    }

    if (
      ["buy-rules", "target-rules"].includes(ruleType) &&
      promotionType === "buyget"
    ) {
      form.resetField(scope)
      const rulesToAppend = promotionId
        ? rules
        : [...rules, requiredProductRule]

      replace(generateRuleAttributes(rulesToAppend) as any)
    }
  }, [promotionType, isLoading])

  return (
    <div className="flex flex-col">
      <Heading level="h2" className="mb-2">
        {t(`promotions.fields.conditions.${ruleType}.title`)}
      </Heading>

      <Text className="text-ui-fg-subtle txt-small mb-10">
        {t(`promotions.fields.conditions.${ruleType}.description`)}
      </Text>

      {fields.map((fieldRule: any, index) => {
        const identifier = fieldRule.id
        const { ref: attributeRef, ...attributeField } = form.register(
          `${scope}.${index}.attribute`
        )
        const { ref: operatorRef, ...operatorsField } = form.register(
          `${scope}.${index}.operator`
        )
        const { ref: valuesRef, ...valuesField } = form.register(
          `${scope}.${index}.values`
        )

        return (
          <Fragment key={`${fieldRule.id}.${index}.${fieldRule.attribute}`}>
            <div className="bg-ui-bg-subtle border-ui-border-base flex flex-row gap-2 rounded-xl border px-2 py-2">
              <div className="grow">
                <Form.Field
                  key={`${identifier}.${scope}.${attributeField.name}`}
                  {...attributeField}
                  render={({ field: { onChange, ref, ...field } }) => {
                    const existingAttributes =
                      fields?.map((field: any) => field.attribute) || []
                    const attributeOptions =
                      attributes?.filter((attr) => {
                        if (attr.value === fieldRule.attribute) {
                          return true
                        }

                        return !existingAttributes.includes(attr.value)
                      }) || []

                    return (
                      <Form.Item className="mb-2">
                        {fieldRule.required && (
                          <p className="text text-ui-fg-muted txt-small">
                            {t("promotions.form.required")}
                          </p>
                        )}

                        <Form.Control>
                          <Select
                            {...field}
                            onValueChange={(e) => {
                              update(index, { ...fieldRule, values: [] })
                              onChange(e)
                            }}
                            disabled={fieldRule.disguised}
                          >
                            <Select.Trigger
                              ref={attributeRef}
                              className="bg-ui-bg-base"
                            >
                              <Select.Value
                                placeholder={t(
                                  "promotions.form.selectAttribute"
                                )}
                              />
                            </Select.Trigger>

                            <Select.Content>
                              {attributeOptions?.map((c, i) => (
                                <Select.Item
                                  key={`${identifier}-attribute-option-${i}`}
                                  value={c.value}
                                >
                                  <span className="text-ui-fg-subtle">
                                    {c.label}
                                  </span>
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

                <div className="flex gap-2">
                  <Form.Field
                    key={`${identifier}.${scope}.${operatorsField.name}`}
                    {...operatorsField}
                    render={({ field: { onChange, ref, ...field } }) => {
                      return (
                        <Form.Item className="basis-1/2">
                          <Form.Control>
                            <Select
                              {...field}
                              onValueChange={onChange}
                              disabled={fieldRule.disguised}
                            >
                              <Select.Trigger
                                ref={operatorRef}
                                className="bg-ui-bg-base"
                              >
                                <Select.Value placeholder="Select Operator" />
                              </Select.Trigger>

                              <Select.Content>
                                {operators?.map((c, i) => (
                                  <Select.Item
                                    key={`${identifier}-operator-option-${i}`}
                                    value={c.value}
                                  >
                                    <span className="text-ui-fg-subtle">
                                      {c.label}
                                    </span>
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

                  <RuleValueFormField
                    form={form}
                    identifier={identifier}
                    scope={scope}
                    valuesField={valuesField}
                    operatorsField={operatorsField}
                    valuesRef={valuesRef}
                    fieldRule={fieldRule}
                    attributes={attributes}
                    ruleType={ruleType}
                  />
                </div>
              </div>

              <div className="flex-none self-center px-1">
                <XMarkMini
                  className={`text-ui-fg-muted cursor-pointer ${
                    fieldRule.required ? "invisible" : "visible"
                  }`}
                  onClick={() => {
                    if (!fieldRule.required) {
                      fieldRule.id &&
                        setRulesToRemove &&
                        setRulesToRemove([...rulesToRemove, fieldRule])

                      remove(index)
                    }
                  }}
                />
              </div>
            </div>

            {index < fields.length - 1 && (
              <div className="relative px-6 py-3">
                <div className="border-ui-border-strong absolute bottom-0 left-[40px] top-0 z-[-1] w-px bg-[linear-gradient(var(--border-strong)_33%,rgba(255,255,255,0)_0%)] bg-[length:1px_3px] bg-repeat-y"></div>

                <Badge size="2xsmall" className=" text-xs">
                  {t("promotions.form.and")}
                </Badge>
              </div>
            )}
          </Fragment>
        )
      })}

      <div className="mt-8">
        <Button
          type="button"
          variant="secondary"
          className="inline-block"
          onClick={() => {
            append({
              attribute: "",
              operator: "",
              values: [],
              required: false,
            } as any)
          }}
        >
          {t("promotions.fields.addCondition")}
        </Button>

        <Button
          type="button"
          variant="transparent"
          className="text-ui-fg-muted hover:text-ui-fg-subtle ml-2 inline-block"
          onClick={() => {
            const indicesToRemove = fields
              .map((field: any, index) => (field.required ? null : index))
              .filter((f) => f !== null)

            setRulesToRemove &&
              setRulesToRemove(fields.filter((field: any) => !field.required))
            remove(indicesToRemove)
          }}
        >
          {t("promotions.fields.clearAll")}
        </Button>
      </div>
    </div>
  )
}
