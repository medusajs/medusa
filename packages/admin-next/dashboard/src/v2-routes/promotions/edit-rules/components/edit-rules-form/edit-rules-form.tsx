import { zodResolver } from "@hookform/resolvers/zod"
import { XMarkMini } from "@medusajs/icons"
import { PromotionDTO } from "@medusajs/types"
import { Badge, Button, Heading, Select, Text } from "@medusajs/ui"
import { useFieldArray, useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as zod from "zod"
import { Combobox } from "../../../../../components/common/combobox"

import { Fragment } from "react"
import { Form } from "../../../../../components/common/form"
import {
  RouteDrawer,
  useRouteModal,
} from "../../../../../components/route-modal"
import { useV2PostPromotion } from "../../../../../lib/api-v2"

type EditPromotionFormProps = {
  promotion: PromotionDTO
  ruleType: string
}

const ruleValidation = zod.object({
  id: zod.string().optional(),
  attribute: zod.string().min(1, { message: "Required field" }),
  operator: zod.string().min(1, { message: "Required field" }),
  values: zod.string().array().min(1, { message: "Required field" }),
  required: zod.boolean(),
  frontend_id: zod.string().optional(),
})

const EditRules = zod.object({
  rules: zod.array(ruleValidation),
})

export const EditRulesForm = ({
  promotion,
  ruleType,
}: EditPromotionFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()
  const { rules = [] } = promotion

  const form = useForm<zod.infer<typeof EditRules>>({
    defaultValues: {
      rules: rules.map((rule) => ({
        id: rule.id,
        required: rule.attribute === "currency.code",
        attribute: rule.attribute!,
        operator: rule.operator!,
        values: rule.values.map((v) => v.value!),
      })),
    },
    resolver: zodResolver(EditRules),
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "rules",
  })

  const { mutateAsync, isLoading } = useV2PostPromotion(promotion.id)

  const handleSubmit = form.handleSubmit(async (data) => {
    // TODO: update rules
    await mutateAsync(
      {},
      {
        onSuccess: () => {
          handleSuccess()
        },
      }
    )
  })

  // TODO: Replace with an endpoint
  const attributes = [
    {
      required: true,
      title: "Currency Code",
      value: "currency.code",
    },
    {
      title: "Customer Group",
      value: "customer_group.id",
    },
    {
      title: "Region",
      value: "region.id",
    },
    {
      title: "Country",
      value: "address.country_code",
    },
    {
      title: "Sales Channel",
      value: "sales_channel_id",
    },
  ]

  const operators = [
    {
      title: "In",
      value: "in",
    },
    {
      title: "Equals",
      value: "eq",
    },
    {
      title: "Not In",
      value: "nin",
    },
  ]

  const values = [
    {
      title: "France",
      value: "region_id",
    },
    {
      title: "USD",
      value: "usd",
    },
    {
      title: "Customer Group",
      value: "cusgro_id",
    },
  ]

  const attributesMap = {
    rules: attributes,
  }

  const operatorMap = {
    rules: operators,
  }

  const valuesMap = {
    rules: values,
  }

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

            {fields.map((rule, index) => {
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
                <Fragment key={rule.id || rule.frontend_id}>
                  <div className="flex flex-row gap-2 bg-ui-bg-subtle py-2 px-2 rounded-xl border border-ui-border-base">
                    <div className="grow">
                      <Form.Field
                        {...attributeFields}
                        render={({ field: { onChange, ref, ...field } }) => {
                          return (
                            <Form.Item className="mb-2">
                              {rule.required && (
                                <p className="text text-ui-fg-muted txt-small">
                                  Required
                                </p>
                              )}

                              <Form.Control>
                                <Select
                                  {...field}
                                  onValueChange={onChange}
                                  disabled={rule.required}
                                >
                                  <Select.Trigger
                                    ref={ref}
                                    className="bg-ui-bg-base"
                                  >
                                    <Select.Value placeholder="Select Attribute" />
                                  </Select.Trigger>

                                  <Select.Content>
                                    {attributesMap["rules"].map((c) => (
                                      <Select.Item
                                        key={`${
                                          rule.id || rule.frontend_id
                                        }-${c.title.split(" ").join("-")}`}
                                        value={c.value}
                                      >
                                        <span className="text-ui-fg-subtle">
                                          {c.title}
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
                          {...operatorFields}
                          render={({ field: { onChange, ref, ...field } }) => {
                            return (
                              <Form.Item className="basis-1/2">
                                <Form.Control>
                                  <Select
                                    {...field}
                                    onValueChange={onChange}
                                    disabled={rule.required}
                                  >
                                    <Select.Trigger
                                      ref={ref}
                                      className="bg-ui-bg-base"
                                    >
                                      <Select.Value placeholder="Select Operator" />
                                    </Select.Trigger>

                                    <Select.Content>
                                      {operatorMap["rules"].map((c) => (
                                        <Select.Item
                                          key={`${
                                            rule.id || rule.frontend_id
                                          }-${c.title.split(" ").join("-")}`}
                                          value={c.value}
                                        >
                                          <span className="text-ui-fg-subtle">
                                            {c.title}
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
                          {...valuesFields}
                          render={({ field: { onChange, ref, ...field } }) => {
                            return (
                              <Form.Item className="basis-1/2">
                                <Form.Control>
                                  <Combobox
                                    options={valuesMap["rules"].map((v) => ({
                                      label: v.title,
                                      value: v.value,
                                    }))}
                                    placeholder="Select Values"
                                    {...field}
                                    onChange={onChange}
                                    className="bg-ui-bg-base placeholder:text-green-200"
                                  />
                                </Form.Control>
                                <Form.ErrorMessage />
                              </Form.Item>
                            )
                          }}
                        />
                      </div>
                    </div>

                    <div className="flex-none self-center px-1">
                      <XMarkMini
                        className={`text-ui-fg-muted cursor-pointer ${
                          rule.required ? "invisible" : "visible"
                        }`}
                        onClick={() => {
                          if (!rule.required) {
                            remove(index)
                          }
                        }}
                      />
                    </div>
                  </div>

                  {index < fields.length - 1 && (
                    <div className="relative px-6 py-3">
                      <div className="absolute top-0 bottom-0 left-[40px] z-[-1] border-ui-border-strong w-px bg-[linear-gradient(var(--border-strong)_33%,rgba(255,255,255,0)_0%)] bg-[length:1px_3px] bg-repeat-y"></div>

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
                    // TODO: come up with a better way to handle this
                    frontend_id: Math.floor(Math.random() * 100).toString(),
                  })
                }}
              >
                Add condition
              </Button>

              <Button
                type="button"
                variant="transparent"
                className="inline-block text-ui-fg-muted hover:text-ui-fg-subtle ml-2"
                onClick={() => {
                  const indicesToRemove = fields
                    .map((field, index) => (field.required ? null : index))
                    .filter((f) => f !== null)

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

            <Button size="small" type="submit" isLoading={isLoading}>
              {t("actions.save")}
            </Button>
          </div>
        </RouteDrawer.Footer>
      </form>
    </RouteDrawer.Form>
  )
}
