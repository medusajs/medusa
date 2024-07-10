import { zodResolver } from "@hookform/resolvers/zod"
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
import { z } from "zod"

import { MagnifyingGlass } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { useTranslation } from "react-i18next"
import { Divider } from "../../../../../components/common/divider"
import { Form } from "../../../../../components/common/form"
import { SwitchBox } from "../../../../../components/common/switch-box"
import { PercentageInput } from "../../../../../components/inputs/percentage-input"
import {
  RouteFocusModal,
  StackedFocusModal,
  useRouteModal,
  useStackedModal,
} from "../../../../../components/modals"
import { useCreateTaxRate } from "../../../../../hooks/api/tax-rates"
import { TargetForm } from "../../../common/components/target-form/target-form"
import { TargetItem } from "../../../common/components/target-item/target-item"
import { TaxRateRuleReferenceType } from "../../../common/constants"
import {
  TaxRateRuleReference,
  TaxRateRuleReferenceSchema,
} from "../../../common/schemas"
import { createTaxRulePayload } from "../../../common/utils"

const TaxRegionCreateTaxOverrideSchema = z.object({
  name: z.string().min(1),
  code: z.string().optional(),
  rate: z
    .object({
      float: z.number().optional(),
      value: z.string().optional(),
    })
    .optional(),
  is_combinable: z.boolean().optional(),
  enabled_rules: z.object({
    products: z.boolean(),
    product_collections: z.boolean(),
    product_tags: z.boolean(),
    product_types: z.boolean(),
    customer_groups: z.boolean(),
  }),
  products: z.array(TaxRateRuleReferenceSchema).optional(),
  product_collections: z.array(TaxRateRuleReferenceSchema).optional(),
  product_tags: z.array(TaxRateRuleReferenceSchema).optional(),
  product_types: z.array(TaxRateRuleReferenceSchema).optional(),
  customer_groups: z.array(TaxRateRuleReferenceSchema).optional(),
})

type TaxRegionCreateTaxOverrideFormProps = {
  taxRegion: HttpTypes.AdminTaxRegion
}

const STACKED_MODAL_ID = "tr"
const getStackedModalId = (type: TaxRateRuleReferenceType) =>
  `${STACKED_MODAL_ID}-${type}`

export const TaxRegionCreateTaxOverrideForm = ({
  taxRegion,
}: TaxRegionCreateTaxOverrideFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()
  const { setIsOpen } = useStackedModal()

  const form = useForm<z.infer<typeof TaxRegionCreateTaxOverrideSchema>>({
    defaultValues: {
      name: "",
      code: "",
      is_combinable: false,
      rate: {
        value: "",
      },
      enabled_rules: {
        products: true,
        product_collections: false,
        product_tags: false,
        product_types: false,
        customer_groups: false,
      },
      products: [],
      product_collections: [],
      product_tags: [],
      product_types: [],
      customer_groups: [],
    },
    resolver: zodResolver(TaxRegionCreateTaxOverrideSchema),
  })

  const { mutateAsync, isPending } = useCreateTaxRate()

  const handleSubmit = form.handleSubmit(async (values) => {
    const {
      products,
      customer_groups,
      product_collections,
      product_tags,
      product_types,
    } = values

    const productRules = createTaxRulePayload({
      reference_type: TaxRateRuleReferenceType.PRODUCT,
      references: products || [],
    })
    const customerGroupRules = createTaxRulePayload({
      reference_type: TaxRateRuleReferenceType.CUSTOMER_GROUP,
      references: customer_groups || [],
    })
    const productCollectionRules = createTaxRulePayload({
      reference_type: TaxRateRuleReferenceType.PRODUCT_COLLECTION,
      references: product_collections || [],
    })
    const productTagRules = createTaxRulePayload({
      reference_type: TaxRateRuleReferenceType.PRODUCT_TAG,
      references: product_tags || [],
    })
    const productTypeRules = createTaxRulePayload({
      reference_type: TaxRateRuleReferenceType.PRODUCT_TYPE,
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

    mutateAsync(
      {
        name: values.name,
        tax_region_id: taxRegion.id,
        rate: values.rate?.float,
        code: values.code,
        is_combinable: values.is_combinable,
        rules: rules,
        is_default: false,
      },
      {
        onSuccess: () => {
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

  const getControls = (type: TaxRateRuleReferenceType) => {
    switch (type) {
      case TaxRateRuleReferenceType.PRODUCT:
        return products
      case TaxRateRuleReferenceType.PRODUCT_COLLECTION:
        return productCollections
      case TaxRateRuleReferenceType.PRODUCT_TAG:
        return productTags
      case TaxRateRuleReferenceType.PRODUCT_TYPE:
        return productTypes
      case TaxRateRuleReferenceType.CUSTOMER_GROUP:
        return customerGroups
    }
  }

  const referenceTypeOptions = [
    {
      value: TaxRateRuleReferenceType.PRODUCT,
      label: t("taxRegions.fields.targets.options.product"),
    },
    {
      value: TaxRateRuleReferenceType.PRODUCT_COLLECTION,
      label: t("taxRegions.fields.targets.options.productCollection"),
    },
    {
      value: TaxRateRuleReferenceType.PRODUCT_TAG,
      label: t("taxRegions.fields.targets.options.productTag"),
    },
    {
      value: TaxRateRuleReferenceType.PRODUCT_TYPE,
      label: t("taxRegions.fields.targets.options.productType"),
    },
    {
      value: TaxRateRuleReferenceType.CUSTOMER_GROUP,
      label: t("taxRegions.fields.targets.options.customerGroup"),
    },
  ]

  const searchPlaceholders = {
    [TaxRateRuleReferenceType.PRODUCT]: t(
      "taxRegions.fields.targets.placeholders.product"
    ),
    [TaxRateRuleReferenceType.PRODUCT_COLLECTION]: t(
      "taxRegions.fields.targets.placeholders.productCollection"
    ),
    [TaxRateRuleReferenceType.PRODUCT_TAG]: t(
      "taxRegions.fields.targets.placeholders.productTag"
    ),
    [TaxRateRuleReferenceType.PRODUCT_TYPE]: t(
      "taxRegions.fields.targets.placeholders.productType"
    ),
    [TaxRateRuleReferenceType.CUSTOMER_GROUP]: t(
      "taxRegions.fields.targets.placeholders.customerGroup"
    ),
  }

  const getFieldHandler = (type: TaxRateRuleReferenceType) => {
    const { fields, remove, append } = getControls(type)
    const modalId = getStackedModalId(type)

    return (references: TaxRateRuleReference[]) => {
      if (!references.length) {
        form.setValue(type, [], {
          shouldDirty: true,
        })
        setIsOpen(modalId, false)
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
      setIsOpen(modalId, false)
    }
  }

  const displayOrder = new Set<TaxRateRuleReferenceType>([
    TaxRateRuleReferenceType.PRODUCT,
  ])

  const disableRule = (type: TaxRateRuleReferenceType) => {
    form.setValue(type, [], {
      shouldDirty: true,
    })
    form.setValue(`enabled_rules.${type}`, false, {
      shouldDirty: true,
    })

    displayOrder.delete(type)
  }

  const enableRule = (type: TaxRateRuleReferenceType) => {
    form.setValue(`enabled_rules.${type}`, true, {
      shouldDirty: true,
    })
    form.setValue(type, [], {
      shouldDirty: true,
    })

    displayOrder.add(type)
  }

  const watchedEnabledRules = useWatch({
    control: form.control,
    name: "enabled_rules",
  })

  const addRule = () => {
    const firstDisabledRule = Object.keys(watchedEnabledRules).find(
      (key) => !watchedEnabledRules[key as TaxRateRuleReferenceType]
    )

    if (firstDisabledRule) {
      enableRule(firstDisabledRule as TaxRateRuleReferenceType)
    }
  }

  const visibleRuleTypes = referenceTypeOptions
    .filter((option) => watchedEnabledRules[option.value])
    .sort((a, b) => {
      const orderArray = Array.from(displayOrder)
      return orderArray.indexOf(b.value) - orderArray.indexOf(a.value)
    })

  const getAvailableRuleTypes = (type: TaxRateRuleReferenceType) => {
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
    <RouteFocusModal.Form form={form}>
      <form
        onSubmit={handleSubmit}
        className="flex h-full flex-col overflow-hidden"
      >
        <RouteFocusModal.Header />
        <RouteFocusModal.Body className="flex flex-1 flex-col overflow-hidden">
          <div className="flex flex-1 flex-col items-center overflow-y-auto">
            <div className="flex w-full max-w-[720px] flex-col gap-y-8 px-2 py-16">
              <div>
                <RouteFocusModal.Title asChild>
                  <Heading>
                    {t("taxRegions.taxOverrides.create.header")}
                  </Heading>
                </RouteFocusModal.Title>
                <RouteFocusModal.Description asChild>
                  <Text size="small" className="text-ui-fg-subtle">
                    {t("taxRegions.taxOverrides.create.hint")}
                  </Text>
                </RouteFocusModal.Description>
              </div>
              <div className="flex flex-col gap-4">
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
                                placeholder="0.00"
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
                            <Form.Label optional>
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
                </div>
              </div>
              <SwitchBox
                control={form.control}
                name="is_combinable"
                label={t("taxRegions.fields.isCombinable.label")}
                description={t("taxRegions.fields.isCombinable.hint")}
              />
              <div className="flex flex-col gap-y-3">
                <div className="flex items-center justify-between gap-x-4">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-x-1">
                      <Label
                        id="tax_region_rules_label"
                        htmlFor="tax_region_rules"
                      >
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
                    <Hint
                      id="tax_region_rules_description"
                      className="text-pretty"
                    >
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

                    const modalId = getStackedModalId(type)

                    const handleChangeType = (
                      value: TaxRateRuleReferenceType
                    ) => {
                      disableRule(type)
                      enableRule(value)
                    }

                    return (
                      <div key={type}>
                        <Form.Field
                          control={form.control}
                          name={ruleType.value}
                          render={({
                            field: {
                              value: _value,
                              onChange: _onChange,
                              ...field
                            },
                          }) => {
                            return (
                              <Form.Item className="space-y-0">
                                <Form.Label className="sr-only">
                                  {label}
                                </Form.Label>
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
                                      {t(
                                        "taxRegions.fields.targets.operators.in"
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-1.5 px-1.5">
                                    <StackedFocusModal id={modalId}>
                                      <StackedFocusModal.Trigger asChild>
                                        <button
                                          type="button"
                                          className="bg-ui-bg-field-component hover:bg-ui-bg-field-component-hover shadow-borders-base txt-compact-small text-ui-fg-muted transition-fg focus-visible:shadow-borders-interactive-with-active flex flex-1 items-center gap-x-2 rounded-md px-2 py-1.5 outline-none"
                                        >
                                          <MagnifyingGlass />
                                          {searchPlaceholder}
                                        </button>
                                      </StackedFocusModal.Trigger>
                                      <StackedFocusModal.Trigger asChild>
                                        <Button variant="secondary">
                                          {t("actions.browse")}
                                        </Button>
                                      </StackedFocusModal.Trigger>
                                      <StackedFocusModal.Content>
                                        <StackedFocusModal.Header>
                                          <StackedFocusModal.Title asChild>
                                            <Heading className="sr-only">
                                              {t(
                                                "taxRegions.fields.targets.modal.header"
                                              )}
                                            </Heading>
                                          </StackedFocusModal.Title>
                                          <StackedFocusModal.Description className="sr-only">
                                            {t(
                                              "taxRegions.fields.targets.hint"
                                            )}
                                          </StackedFocusModal.Description>
                                        </StackedFocusModal.Header>
                                        <TargetForm
                                          type="focus"
                                          referenceType={type}
                                          state={fields}
                                          setState={handler}
                                        />
                                      </StackedFocusModal.Content>
                                    </StackedFocusModal>
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
            </div>
          </div>
        </RouteFocusModal.Body>
        <RouteFocusModal.Footer>
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
        </RouteFocusModal.Footer>
      </form>
    </RouteFocusModal.Form>
  )
}
