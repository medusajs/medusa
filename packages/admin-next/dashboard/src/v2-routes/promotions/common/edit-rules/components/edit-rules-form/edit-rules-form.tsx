import { zodResolver } from "@hookform/resolvers/zod"
import { XMarkMini } from "@medusajs/icons"
import { PromotionDTO, PromotionRuleDTO } from "@medusajs/types"
import { Badge, Button, Heading, Input, Select, Text } from "@medusajs/ui"
import i18n from "i18next"
import { Fragment, useState } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as zod from "zod"
import { Form } from "../../../../../../components/common/form"
import { Combobox } from "../../../../../../components/inputs/combobox"
import { RouteDrawer } from "../../../../../../components/route-modal"
import { usePromotionRuleValues } from "../../../../../../hooks/api/promotions"
import { RuleTypeValues } from "../../edit-rules"
import { getDisguisedRules } from "./utils"

type EditPromotionFormProps = {
  promotion: PromotionDTO
  rules: PromotionRuleDTO[]
  ruleType: RuleTypeValues
  attributes: any[]
  operators: any[]
  handleSubmit: any
  isSubmitting: boolean
}

const EditRules = zod.object({
  rules: zod.array(
    zod.object({
      id: zod.string().optional(),
      attribute: zod
        .string()
        .min(1, { message: i18n.t("promotions.form.required") }),
      operator: zod
        .string()
        .min(1, { message: i18n.t("promotions.form.required") }),
      values: zod.union([
        zod.number().min(1, { message: i18n.t("promotions.form.required") }),
        zod.string().min(1, { message: i18n.t("promotions.form.required") }),
        zod
          .array(zod.string())
          .min(1, { message: i18n.t("promotions.form.required") }),
      ]),
      required: zod.boolean().optional(),
      field_type: zod.string().optional(),
    })
  ),
})

const RuleValueFormField = ({
  identifier,
  scope,
  valuesFields,
  valuesRef,
  fieldRule,
  attributes,
  ruleType,
}) => {
  const attribute = attributes?.find(
    (attr) => attr.value === fieldRule.attribute
  )
  const { values: options = [] } = usePromotionRuleValues(
    ruleType,
    attribute?.id,
    {
      enabled: !!attribute?.id && !attribute.disguised,
    }
  )

  return (
    <Form.Field
      key={`${identifier}.${scope}.${valuesFields.name}-${fieldRule.attribute}`}
      {...valuesFields}
      render={({ field: { onChange, ref, ...field } }) => {
        if (fieldRule.field_type === "number") {
          return (
            <Form.Item className="basis-1/2">
              <Form.Control>
                <Input
                  {...field}
                  type="number"
                  onChange={onChange}
                  className="bg-ui-bg-base"
                  ref={valuesRef}
                  min={1}
                />
              </Form.Control>
              <Form.ErrorMessage />
            </Form.Item>
          )
        } else if (fieldRule.field_type === "text") {
          return (
            <Form.Item className="basis-1/2">
              <Form.Control>
                <Input
                  {...field}
                  onChange={onChange}
                  className="bg-ui-bg-base"
                />
              </Form.Control>
              <Form.ErrorMessage />
            </Form.Item>
          )
        } else {
          return (
            <Form.Item className="basis-1/2">
              <Form.Control>
                <Combobox
                  {...field}
                  placeholder="Select Values"
                  options={options}
                  onChange={onChange}
                  className="bg-ui-bg-base"
                />
              </Form.Control>

              <Form.ErrorMessage />
            </Form.Item>
          )
        }
      }}
    />
  )
}

export const RulesFormField = ({
  form,
  ruleType,
  fields,
  attributes,
  operators,
  removeRule,
  updateRule,
  appendRule,
  setRulesToRemove,
  rulesToRemove,
  scope = "rules",
}) => {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col">
      <Heading level="h2" className="mb-2">
        {t(`promotions.fields.conditions.${ruleType}.title`)}
      </Heading>

      <Text className="text-ui-fg-subtle txt-small mb-10">
        {t(`promotions.fields.conditions.${ruleType}.description`)}
      </Text>

      {fields.map((fieldRule, index) => {
        const identifier = fieldRule.id
        const { ref: attributeRef, ...attributeFields } = form.register(
          `${scope}.${index}.attribute`
        )
        const { ref: operatorRef, ...operatorFields } = form.register(
          `${scope}.${index}.operator`
        )
        const { ref: valuesRef, ...valuesFields } = form.register(
          `${scope}.${index}.values`
        )

        return (
          <Fragment key={`${fieldRule.id}.${index}`}>
            <div className="bg-ui-bg-subtle border-ui-border-base flex flex-row gap-2 rounded-xl border px-2 py-2">
              <div className="grow">
                <Form.Field
                  key={`${identifier}.${scope}.${attributeFields.name}`}
                  {...attributeFields}
                  render={({ field: { onChange, ref, ...field } }) => {
                    const existingAttributes =
                      fields?.map((field) => field.attribute) || []
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
                              updateRule(index, { ...fieldRule, values: [] })
                              onChange(e)
                            }}
                            disabled={fieldRule.required}
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
                    key={`${identifier}.${scope}.${operatorFields.name}`}
                    {...operatorFields}
                    render={({ field: { onChange, ref, ...field } }) => {
                      return (
                        <Form.Item className="basis-1/2">
                          <Form.Control>
                            <Select
                              {...field}
                              onValueChange={onChange}
                              disabled={fieldRule.required}
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
                    identifier={identifier}
                    scope={scope}
                    valuesFields={valuesFields}
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

                      removeRule(index)
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
            appendRule({
              attribute: "",
              operator: "",
              values: [],
              required: false,
            })
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
              .map((field, index) => (field.required ? null : index))
              .filter((f) => f !== null)

            setRulesToRemove &&
              setRulesToRemove(fields.filter((f) => !f.required))
            removeRule(indicesToRemove)
          }}
        >
          {t("promotions.fields.clearAll")}
        </Button>
      </div>
    </div>
  )
}

export const EditRulesForm = ({
  promotion,
  rules,
  ruleType,
  attributes,
  operators,
  handleSubmit,
  isSubmitting,
}: EditPromotionFormProps) => {
  const { t } = useTranslation()
  const requiredAttributes = attributes?.filter((ra) => ra.required) || []
  const requiredAttributeValues = requiredAttributes?.map((ra) => ra.value)
  const disguisedRules =
    getDisguisedRules(promotion, requiredAttributes, ruleType) || []
  const [rulesToRemove, setRulesToRemove] = useState([])

  const form = useForm<zod.infer<typeof EditRules>>({
    defaultValues: {
      rules: [...disguisedRules, ...rules].map((rule) => ({
        id: rule.id,
        required: requiredAttributeValues.includes(rule.attribute),
        field_type: rule.field_type,
        attribute: rule.attribute!,
        operator: rule.operator!,
        values: rule?.values?.map((v: { value: string }) => v.value!),
      })),
    },
    resolver: zodResolver(EditRules),
  })

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "rules",
    keyName: "rules_id",
  })

  const handleFormSubmit = form.handleSubmit(handleSubmit(rulesToRemove))

  return (
    <RouteDrawer.Form form={form}>
      <form onSubmit={handleFormSubmit} className="flex h-full flex-col">
        <RouteDrawer.Body>
          <RulesFormField
            form={form}
            ruleType={ruleType}
            attributes={attributes}
            operators={operators}
            fields={fields}
            setRulesToRemove={setRulesToRemove}
            rulesToRemove={rulesToRemove}
            appendRule={append}
            removeRule={remove}
            updateRule={update}
          />
        </RouteDrawer.Body>

        <RouteDrawer.Footer>
          <div className="flex items-center justify-end gap-x-2">
            <RouteDrawer.Close asChild>
              <Button size="small" variant="secondary" disabled={isSubmitting}>
                {t("actions.cancel")}
              </Button>
            </RouteDrawer.Close>

            <Button size="small" type="submit" isLoading={isSubmitting}>
              {t("actions.save")}
            </Button>
          </div>
        </RouteDrawer.Footer>
      </form>
    </RouteDrawer.Form>
  )
}
