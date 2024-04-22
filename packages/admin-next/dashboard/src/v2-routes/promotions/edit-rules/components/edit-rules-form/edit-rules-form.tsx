import { zodResolver } from "@hookform/resolvers/zod"
import { XMarkMini } from "@medusajs/icons"
import { PromotionDTO, PromotionRuleDTO } from "@medusajs/types"
import { Badge, Button, Heading, Input, Select, Text } from "@medusajs/ui"
import { Fragment, useState } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as zod from "zod"
import { Form } from "../../../../../components/common/form"
import { Combobox } from "../../../../../components/inputs/combobox"
import {
  RouteDrawer,
  useRouteModal,
} from "../../../../../components/route-modal"
import {
  usePromotionAddRules,
  usePromotionRemoveRules,
  usePromotionRuleValues,
  usePromotionUpdateRules,
  useUpdatePromotion,
} from "../../../../../hooks/api/promotions"
import { RuleTypeValues } from "../../edit-rules"
import { getDisguisedRules } from "./utils"

type EditPromotionFormProps = {
  promotion: PromotionDTO
  rules: PromotionRuleDTO[]
  ruleType: RuleTypeValues
  attributes: any[]
  operators: any[]
}

const EditRules = zod.object({
  rules: zod.array(
    zod.object({
      id: zod.string().optional(),
      attribute: zod.string().min(1, { message: "Required field" }),
      operator: zod.string().min(1, { message: "Required field" }),
      values: zod.union([
        zod.number().min(1, { message: "Required field" }),
        zod.string().min(1, { message: "Required field" }),
        zod.array(zod.string()).min(1, { message: "Required field" }),
      ]),
      required: zod.boolean().optional(),
      field_type: zod.string().optional(),
    })
  ),
})

const fetchOptionsForRule = (ruleType: string, attribute: string) => {
  const { values } = usePromotionRuleValues(ruleType, attribute)

  return values || []
}

export const EditRulesForm = ({
  promotion,
  rules,
  ruleType,
  attributes,
  operators,
}: EditPromotionFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()
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

  const { mutateAsync: updatePromotion } = useUpdatePromotion(promotion.id)
  const { mutateAsync: addPromotionRules } = usePromotionAddRules(
    promotion.id,
    ruleType
  )

  const { mutateAsync: removePromotionRules } = usePromotionRemoveRules(
    promotion.id,
    ruleType
  )

  const { mutateAsync: updatePromotionRules } = usePromotionUpdateRules(
    promotion.id,
    ruleType
  )

  const handleSubmit = form.handleSubmit(async (data) => {
    const applicationMethodData: Record<any, any> = {}
    const { rules: allRules = [] } = data

    const disguisedRulesData = allRules.filter((rule) =>
      disguisedRules.map((maskedRule) => maskedRule.id).includes(rule.id!)
    )

    // For all the rules that were disguised, convert them to actual values in the
    // database, they are currently all under application_method. If more of these are coming
    // up, abstract this away.
    for (const rule of disguisedRulesData) {
      applicationMethodData[rule.id!] = parseInt(rule.values as string)
    }

    // This variable will contain the rules that are actual rule objects, without the disguised
    // objects
    const rulesData = allRules.filter(
      (rule) =>
        !disguisedRules.map((maskedRule) => maskedRule.id).includes(rule.id!)
    )

    const rulesToCreate = rulesData.filter((rule) => !("id" in rule))
    const rulesToUpdate = rulesData.filter(
      (rule) => typeof rule.id === "string"
    )

    if (Object.keys(applicationMethodData).length) {
      await updatePromotion({ application_method: applicationMethodData })
    }

    rulesToCreate.length &&
      (await addPromotionRules({
        rules: rulesToCreate.map((rule) => {
          return {
            attribute: rule.attribute,
            operator: rule.operator,
            values: rule.values,
          } as any
        }),
      }))

    rulesToRemove.length &&
      (await removePromotionRules({
        rule_ids: rulesToRemove.map((r) => r.id!),
      }))

    rulesToUpdate.length &&
      (await updatePromotionRules({
        rules: rulesToUpdate.map((rule) => {
          return {
            id: rule.id!,
            attribute: rule.attribute,
            operator: rule.operator,
            values: rule.values,
          } as any
        }),
      }))

    handleSuccess()
  })

  return (
    <RouteDrawer.Form form={form}>
      <form onSubmit={handleSubmit} className="flex h-full flex-col">
        <RouteDrawer.Body>
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
                `rules.${index}.attribute`
              )
              const { ref: operatorRef, ...operatorFields } = form.register(
                `rules.${index}.operator`
              )
              const { ref: valuesRef, ...valuesFields } = form.register(
                `rules.${index}.values`
              )

              return (
                <Fragment key={index}>
                  <div className="bg-ui-bg-subtle border-ui-border-base flex flex-row gap-2 rounded-xl border px-2 py-2">
                    <div className="grow">
                      <Form.Field
                        key={`${identifier}.${attributeFields.name}`}
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
                                  Required
                                </p>
                              )}

                              <Form.Control>
                                <Select
                                  {...field}
                                  onValueChange={(e) => {
                                    update(index, { ...fieldRule, values: [] })
                                    onChange(e)
                                  }}
                                  disabled={fieldRule.required}
                                >
                                  <Select.Trigger
                                    ref={attributeRef}
                                    className="bg-ui-bg-base"
                                  >
                                    <Select.Value placeholder="Select Attribute" />
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
                          key={`${identifier}.${operatorFields.name}`}
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

                        <Form.Field
                          key={`${identifier}.${valuesFields.name}-${fieldRule.attribute}`}
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
                              const attribute = attributes?.find(
                                (attr) => attr.value === fieldRule.attribute
                              )
                              const options = attribute
                                ? fetchOptionsForRule(ruleType, attribute.id)
                                : []

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
                      </div>
                    </div>

                    <div className="flex-none self-center px-1">
                      <XMarkMini
                        className={`text-ui-fg-muted cursor-pointer ${
                          fieldRule.required ? "invisible" : "visible"
                        }`}
                        onClick={() => {
                          if (!fieldRule.required) {
                            if (fieldRule.id) {
                              setRulesToRemove([...rulesToRemove, fieldRule])
                            }

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
                        AND
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
                  })
                }}
              >
                Add condition
              </Button>

              <Button
                type="button"
                variant="transparent"
                className="text-ui-fg-muted hover:text-ui-fg-subtle ml-2 inline-block"
                onClick={() => {
                  const indicesToRemove = fields
                    .map((field, index) => (field.required ? null : index))
                    .filter((f) => f !== null)

                  setRulesToRemove(fields.filter((f) => !f.required))
                  remove(indicesToRemove)
                }}
              >
                Clear all
              </Button>
            </div>
          </div>
        </RouteDrawer.Body>

        <RouteDrawer.Footer>
          <div className="flex items-center justify-end gap-x-2">
            <RouteDrawer.Close asChild>
              <Button size="small" variant="secondary">
                {t("actions.cancel")}
              </Button>
            </RouteDrawer.Close>

            <Button size="small" type="submit">
              {t("actions.save")}
            </Button>
          </div>
        </RouteDrawer.Footer>
      </form>
    </RouteDrawer.Form>
  )
}
