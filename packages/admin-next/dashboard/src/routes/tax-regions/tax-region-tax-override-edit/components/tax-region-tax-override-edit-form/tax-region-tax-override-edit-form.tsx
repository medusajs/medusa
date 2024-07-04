import { zodResolver } from "@hookform/resolvers/zod"
import { MagnifyingGlass } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import {
    Button,
    Heading,
    Hint,
    Input,
    Label,
    Select,
    Text,
    clx,
    toast,
} from "@medusajs/ui"
import { useFieldArray, useForm, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { z } from "zod"
import { Divider } from "../../../../../components/common/divider"
import { Form } from "../../../../../components/common/form"
import { SwitchBox } from "../../../../../components/common/switch-box"
import { PercentageInput } from "../../../../../components/inputs/percentage-input"
import {
    RouteDrawer,
    StackedDrawer,
    useRouteModal,
    useStackedModal,
} from "../../../../../components/modals"
import { useUpdateTaxRate } from "../../../../../hooks/api/tax-rates"
import { RuleReferenceType } from "../../../common/constants"
import {
    TaxRateRuleValue,
    TaxRateRuleValueSchema,
} from "../../../common/schemas"
import { createTaxRulePayload } from "../../../common/utils"
import { TargetForm } from "../../../tax-region-tax-override-create/components/tax-region-override-create-form/target-form"
import { TargetItem } from "../../../tax-region-tax-override-create/components/tax-region-override-create-form/target-item"
import { InitialRuleValues } from "../../types"

type TaxRegionTaxOverrideEditFormProps = {
  taxRate: HttpTypes.AdminTaxRate
  initialValues: InitialRuleValues
  isCombinable?: boolean
}
const STACKED_MODAL_ID = "tr"

const TaxRegionTaxRateEditSchema = z.object({
  name: z.string().min(1),
  code: z.string().optional(),
  rate: z.object({
    float: z.number().optional(),
    value: z.string().optional(),
  }),
  is_combinable: z.boolean().optional(),
  enabled_rules: z.object({
    products: z.boolean(),
    product_collections: z.boolean(),
    product_tags: z.boolean(),
    product_types: z.boolean(),
    customer_groups: z.boolean(),
  }),
  products: z.array(TaxRateRuleValueSchema).optional(),
  product_collections: z.array(TaxRateRuleValueSchema).optional(),
  product_tags: z.array(TaxRateRuleValueSchema).optional(),
  product_types: z.array(TaxRateRuleValueSchema).optional(),
  customer_groups: z.array(TaxRateRuleValueSchema).optional(),
})

export const TaxRegionTaxOverrideEditForm = ({
  taxRate,
  isCombinable = false,
  initialValues,
}: TaxRegionTaxOverrideEditFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()
  const { setIsOpen } = useStackedModal()

  const form = useForm<z.infer<typeof TaxRegionTaxRateEditSchema>>({
    defaultValues: {
      name: taxRate.name,
      code: taxRate.code || "",
      rate: {
        value: taxRate.rate?.toString() || "",
      },
      is_combinable: taxRate.is_combinable,
      enabled_rules: {
        products: initialValues.products.length > 0,
        product_collections: initialValues.product_collections.length > 0,
        product_tags: initialValues.product_tags.length > 0,
        product_types: initialValues.product_types.length > 0,
        customer_groups: initialValues.customer_groups.length > 0,
      },
      products: initialValues.products,
      product_collections: initialValues.product_collections,
      product_tags: initialValues.product_tags,
      product_types: initialValues.product_types,
      customer_groups: initialValues.customer_groups,
    },
    resolver: zodResolver(TaxRegionTaxRateEditSchema),
  })

  const { mutateAsync, isPending } = useUpdateTaxRate(taxRate.id)

  const handleSubmit = form.handleSubmit(async (values) => {
    const {
      products,
      customer_groups,
      product_collections,
      product_tags,
      product_types,
    } = values

    const productRules = createTaxRulePayload({
      reference_type: RuleReferenceType.PRODUCT,
      references: products || [],
    })
    const customerGroupRules = createTaxRulePayload({
      reference_type: RuleReferenceType.CUSTOMER_GROUP,
      references: customer_groups || [],
    })
    const productCollectionRules = createTaxRulePayload({
      reference_type: RuleReferenceType.PRODUCT_COLLECTION,
      references: product_collections || [],
    })
    const productTagRules = createTaxRulePayload({
      reference_type: RuleReferenceType.PRODUCT_TAG,
      references: product_tags || [],
    })
    const productTypeRules = createTaxRulePayload({
      reference_type: RuleReferenceType.PRODUCT_TYPE,
      references: product_types || [],
    })

    const rules = [
      productRules,
      customerGroupRules,
      productCollectionRules,
      productTagRules,
      productTypeRules,
    ]
      .filter((rule) => Boolean(rule))
      .flatMap((r) => r) as HttpTypes.AdminCreateTaxRate["rules"]

    await mutateAsync(
      {
        name: values.name,
        code: values.code || null,
        rate: values.rate?.float,
        is_combinable: values.is_combinable,
        rules,
      },
      {
        onSuccess: () => {
          toast.success(t("taxRegions.taxRates.edit.successToast"))
          handleSuccess()
        },
        onError: (error) => {
          toast.error(error.message)
        },
      }
    )
  })

  const products = useFieldArray({
    control: form.control,
    name: "products",
  })

  const productCollections = useFieldArray({
    control: form.control,
    name: "product_collections",
  })

  const productTags = useFieldArray({
    control: form.control,
    name: "product_tags",
  })

  const productTypes = useFieldArray({
    control: form.control,
    name: "product_types",
  })

  const customerGroups = useFieldArray({
    control: form.control,
    name: "customer_groups",
  })

  const getControls = (type: RuleReferenceType) => {
    switch (type) {
      case RuleReferenceType.PRODUCT:
        return products
      case RuleReferenceType.PRODUCT_COLLECTION:
        return productCollections
      case RuleReferenceType.PRODUCT_TAG:
        return productTags
      case RuleReferenceType.PRODUCT_TYPE:
        return productTypes
      case RuleReferenceType.CUSTOMER_GROUP:
        return customerGroups
    }
  }

  const referenceTypeOptions = [
    {
      value: RuleReferenceType.PRODUCT,
      label: t("taxRegions.fields.targets.options.product"),
    },
    {
      value: RuleReferenceType.PRODUCT_COLLECTION,
      label: t("taxRegions.fields.targets.options.productCollection"),
    },
    {
      value: RuleReferenceType.PRODUCT_TAG,
      label: t("taxRegions.fields.targets.options.productTag"),
    },
    {
      value: RuleReferenceType.PRODUCT_TYPE,
      label: t("taxRegions.fields.targets.options.productType"),
    },
    {
      value: RuleReferenceType.CUSTOMER_GROUP,
      label: t("taxRegions.fields.targets.options.customerGroup"),
    },
  ]

  const searchPlaceholders = {
    [RuleReferenceType.PRODUCT]: t(
      "taxRegions.fields.targets.placeholders.product"
    ),
    [RuleReferenceType.PRODUCT_COLLECTION]: t(
      "taxRegions.fields.targets.placeholders.productCollection"
    ),
    [RuleReferenceType.PRODUCT_TAG]: t(
      "taxRegions.fields.targets.placeholders.productTag"
    ),
    [RuleReferenceType.PRODUCT_TYPE]: t(
      "taxRegions.fields.targets.placeholders.productType"
    ),
    [RuleReferenceType.CUSTOMER_GROUP]: t(
      "taxRegions.fields.targets.placeholders.customerGroup"
    ),
  }

  const getFieldHandler = (type: RuleReferenceType) => {
    const { fields, remove, append } = getControls(type)

    return (references: TaxRateRuleValue[]) => {
      if (!references.length) {
        form.setValue(type, [])
        setIsOpen(STACKED_MODAL_ID, false)
        return
      }

      const newIds = references.map((reference) => reference.value)

      const fieldsToAdd = references.filter(
        (reference) => !fields.some((field) => field.value === reference.value)
      )

      for (const field of fields) {
        if (!newIds.includes(field.value)) {
          remove(fields.indexOf(field))
        }
      }

      append(fieldsToAdd)
      setIsOpen(STACKED_MODAL_ID, false)
    }
  }

  const displayOrder = new Set<RuleReferenceType>([RuleReferenceType.PRODUCT])

  const disableRule = (type: RuleReferenceType) => {
    form.setValue(type, [])
    form.setValue(`enabled_rules.${type}`, false)

    displayOrder.delete(type)
  }

  const enableRule = (type: RuleReferenceType) => {
    form.setValue(`enabled_rules.${type}`, true)
    form.setValue(type, [])

    displayOrder.add(type)
  }

  const watchedEnabledRules = useWatch({
    control: form.control,
    name: "enabled_rules",
  })

  const addRule = () => {
    const firstDisabledRule = Object.keys(watchedEnabledRules).find(
      (key) => !watchedEnabledRules[key as RuleReferenceType]
    )

    if (firstDisabledRule) {
      enableRule(firstDisabledRule as RuleReferenceType)
    }
  }

  const visibleRuleTypes = referenceTypeOptions
    .filter((option) => watchedEnabledRules[option.value])
    .sort((a, b) => {
      const orderArray = Array.from(displayOrder)
      return orderArray.indexOf(a.value) - orderArray.indexOf(b.value)
    })

  const getAvailableRuleTypes = (type: RuleReferenceType) => {
    return referenceTypeOptions.filter((option) => {
      return (
        !visibleRuleTypes.some(
          (visibleOption) => visibleOption.value === option.value
        ) || option.value === type
      )
    })
  }

  const showAddButton = Object.values(watchedEnabledRules).some(
    (value) => !value
  )

  return (
    <RouteDrawer.Form form={form}>
      <form
        className="flex flex-1 flex-col overflow-hidden"
        onSubmit={handleSubmit}
      >
        <RouteDrawer.Body className="flex flex-1 flex-col gap-y-6 overflow-auto">
          <div className="flex flex-col gap-y-4">
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
              name="code"
              render={({ field }) => {
                return (
                  <Form.Item>
                    <Form.Label>{t("taxRegions.fields.taxCode")}</Form.Label>
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
                    <Form.Label>{t("taxRegions.fields.taxRate")}</Form.Label>
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
          </div>
          {isCombinable && (
            <SwitchBox
              control={form.control}
              name="is_combinable"
              label={t("taxRegions.fields.isCombinable.label")}
              description={t("taxRegions.fields.isCombinable.hint")}
            />
          )}
          <div className="flex flex-col gap-y-3">
            <div className="flex items-center justify-between gap-x-4">
              <div className="flex flex-col">
                <div className="flex items-center gap-x-1">
                  <Label id="tax_region_rules_label" htmlFor="tax_region_rules">
                    {t("taxRegions.fields.targets.label")}
                  </Label>
                  <Text
                    size="small"
                    leading="compact"
                    className="text-ui-fg-muted"
                  >
                    ({t("fields.optional")})
                  </Text>
                </div>
                <Hint id="tax_region_rules_description" className="text-pretty">
                  {t("taxRegions.fields.targets.hint")}
                </Hint>
              </div>
              {showAddButton && (
                <Button
                  onClick={addRule}
                  type="button"
                  size="small"
                  variant="transparent"
                  className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover flex-shrink-0"
                >
                  {t("taxRegions.fields.targets.action")}
                </Button>
              )}
            </div>
            <div
              id="tax_region_rules"
              aria-labelledby="tax_region_rules_label"
              aria-describedby="tax_region_rules_description"
              role="application"
              className="flex flex-col gap-y-3"
            >
              {visibleRuleTypes.map((ruleType, index) => {
                const type = ruleType.value
                const label = ruleType.label
                const isLast = index === visibleRuleTypes.length - 1
                const searchPlaceholder = searchPlaceholders[type]

                const options = getAvailableRuleTypes(type)

                const { fields, remove } = getControls(type)
                const handler = getFieldHandler(type)

                const handleChangeType = (value: RuleReferenceType) => {
                  disableRule(type)
                  enableRule(value)
                }

                return (
                  <div key={type}>
                    <Form.Field
                      control={form.control}
                      name={ruleType.value}
                      render={({
                        field: { value: _value, onChange: _onChange, ...field },
                      }) => {
                        return (
                          <Form.Item className="space-y-0">
                            <Form.Label className="sr-only">{label}</Form.Label>
                            <div
                              className={clx(
                                "bg-ui-bg-component shadow-elevation-card-rest transition-fg grid gap-1.5 rounded-xl py-1.5",
                                "aria-[invalid='true']:shadow-borders-error"
                              )}
                              role="application"
                              {...field}
                            >
                              <div className="text-ui-fg-subtle grid gap-1.5 px-1.5 md:grid-cols-2">
                                {isLast ? (
                                  <Select
                                    value={type}
                                    onValueChange={handleChangeType}
                                  >
                                    <Select.Trigger className="bg-ui-bg-field-component hover:bg-ui-bg-field-component-hover">
                                      <Select.Value />
                                    </Select.Trigger>
                                    <Select.Content>
                                      {options.map((option) => {
                                        return (
                                          <Select.Item
                                            key={option.value}
                                            value={option.value}
                                          >
                                            {option.label}
                                          </Select.Item>
                                        )
                                      })}
                                    </Select.Content>
                                  </Select>
                                ) : (
                                  <div className="bg-ui-bg-field shadow-borders-base txt-compact-small rounded-md px-2 py-1.5">
                                    {label}
                                  </div>
                                )}
                                <div className="bg-ui-bg-field shadow-borders-base txt-compact-small rounded-md px-2 py-1.5">
                                  {t("taxRegions.fields.targets.operators.in")}
                                </div>
                              </div>
                              <div className="flex items-center gap-1.5 px-1.5">
                                <StackedDrawer id={STACKED_MODAL_ID}>
                                  <StackedDrawer.Trigger asChild>
                                    <button
                                      type="button"
                                      className="bg-ui-bg-field-component hover:bg-ui-bg-field-component-hover shadow-borders-base txt-compact-small text-ui-fg-muted transition-fg focus-visible:shadow-borders-interactive-with-active flex flex-1 items-center gap-x-2 rounded-md px-2 py-1.5 outline-none"
                                    >
                                      <MagnifyingGlass />
                                      {searchPlaceholder}
                                    </button>
                                  </StackedDrawer.Trigger>
                                  <StackedDrawer.Trigger asChild>
                                    <Button variant="secondary">
                                      {t("actions.browse")}
                                    </Button>
                                  </StackedDrawer.Trigger>
                                  <StackedDrawer.Content>
                                    <StackedDrawer.Header>
                                      <StackedDrawer.Title asChild>
                                        <Heading>
                                          {t(
                                            "taxRegions.fields.targets.modal.header"
                                          )}
                                        </Heading>
                                      </StackedDrawer.Title>
                                      <StackedDrawer.Description className="sr-only">
                                        {t("taxRegions.fields.targets.hint")}
                                      </StackedDrawer.Description>
                                    </StackedDrawer.Header>
                                    <TargetForm
                                      type="drawer"
                                      referenceType={type}
                                      state={fields}
                                      setState={handler}
                                    />
                                  </StackedDrawer.Content>
                                </StackedDrawer>
                                <Button
                                  variant="secondary"
                                  onClick={() => disableRule(type)}
                                  type="button"
                                >
                                  {t("actions.delete")}
                                </Button>
                              </div>
                              {fields.length > 0 ? (
                                <div className="flex flex-col gap-y-1.5">
                                  <Divider variant="dashed" />
                                  <div className="flex flex-col gap-y-1.5 px-1.5">
                                    {fields.map((field, index) => {
                                      return (
                                        <TargetItem
                                          key={field.id}
                                          index={index}
                                          label={field.label}
                                          onRemove={remove}
                                        />
                                      )
                                    })}
                                  </div>
                                </div>
                              ) : null}
                            </div>
                            <Form.ErrorMessage className="mt-2" />
                          </Form.Item>
                        )
                      }}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        </RouteDrawer.Body>
        <RouteDrawer.Footer className="shrink-0">
          <div className="flex items-center justify-end gap-x-2">
            <RouteDrawer.Close asChild>
              <Button size="small" variant="secondary">
                {t("actions.cancel")}
              </Button>
            </RouteDrawer.Close>
            <Button size="small" type="submit" isLoading={isPending}>
              {t("actions.save")}
            </Button>
          </div>
        </RouteDrawer.Footer>
      </form>
    </RouteDrawer.Form>
  )
}
