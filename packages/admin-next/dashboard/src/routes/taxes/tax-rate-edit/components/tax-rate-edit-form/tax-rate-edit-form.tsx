import { zodResolver } from "@hookform/resolvers/zod"
import {
  Button,
  clx,
  DropdownMenu,
  Heading,
  Input,
  Switch,
  Text,
} from "@medusajs/ui"
import { useForm, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as zod from "zod"

import { TaxRateResponse, TaxRegionResponse } from "@medusajs/types"
import { useState } from "react"
import { useSearchParams } from "react-router-dom"
import { Form } from "../../../../../components/common/form"
import { DeprecatedPercentageInput } from "../../../../../components/inputs/percentage-input"
import { SplitView } from "../../../../../components/layout/split-view"
import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/route-modal"
import { useUpdateTaxRate } from "../../../../../hooks/api/tax-rates"
import { ConditionsDrawer } from "../../../common/components/conditions-drawer"
import { ConditionEntities, Operators } from "../../../common/constants"
import { ConditionsOption } from "../../../common/types"
import { Condition } from "../../../tax-rate-create/components"

const SelectedConditionTypesSchema = zod.object({
  [ConditionEntities.PRODUCT]: zod.boolean(),
  [ConditionEntities.PRODUCT_TYPE]: zod.boolean(),
  [ConditionEntities.PRODUCT_COLLECTION]: zod.boolean(),
  [ConditionEntities.PRODUCT_TAG]: zod.boolean(),
  [ConditionEntities.CUSTOMER_GROUP]: zod.boolean(),
})

const ResourceSchema = zod.array(
  zod.object({
    label: zod.string(),
    value: zod.string(),
  })
)

const UpdateTaxRateSchema = zod.object({
  name: zod.string().optional(),
  code: zod.string().optional(),
  rate: zod.number().optional(),
  is_combinable: zod.boolean().optional(),
  selected_condition_types: SelectedConditionTypesSchema,
  products: ResourceSchema,
  product_types: ResourceSchema,
  product_collections: ResourceSchema,
  product_tags: ResourceSchema,
  customer_groups: ResourceSchema,
})

export const TaxRateEditForm = ({
  taxRegion,
  taxRate,
}: {
  taxRegion: TaxRegionResponse
  taxRate: TaxRateResponse
}) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()
  const productRules = taxRate.rules?.filter((r) => r.reference == "product")
  const productTypeRules = taxRate.rules?.filter(
    (r) => r.reference == "product_type"
  )
  const productCollectionRules = taxRate.rules?.filter(
    (r) => r.reference == "product_collection"
  )
  const productTagRules = taxRate.rules?.filter(
    (r) => r.reference == "product_tag"
  )
  const customerGroupRules = taxRate.rules?.filter(
    (r) => r.reference == "customer_group"
  )

  const form = useForm<zod.infer<typeof UpdateTaxRateSchema>>({
    defaultValues: {
      name: taxRate.name,
      code: taxRate.code || undefined,
      rate: taxRate.rate || undefined,
      is_combinable: taxRate.is_combinable,
      selected_condition_types: {
        [ConditionEntities.PRODUCT]: !!productRules?.length,
        [ConditionEntities.PRODUCT_TYPE]: !!productTypeRules?.length,
        [ConditionEntities.PRODUCT_COLLECTION]:
          !!productCollectionRules?.length,
        [ConditionEntities.PRODUCT_TAG]: !!productTagRules?.length,
        [ConditionEntities.CUSTOMER_GROUP]: !!customerGroupRules?.length,
      },
      products: productRules.map((r) => ({
        label: r.reference,
        value: r.reference_id,
      })),
      product_types: productTypeRules.map((r) => ({
        label: r.reference,
        value: r.reference_id,
      })),
      product_collections: productCollectionRules.map((r) => ({
        label: r.reference,
        value: r.reference_id,
      })),
      product_tags: productTagRules.map((r) => ({
        label: r.reference,
        value: r.reference_id,
      })),
      customer_groups: customerGroupRules.map((r) => ({
        label: r.reference,
        value: r.reference_id,
      })),
    },
    resolver: zodResolver(UpdateTaxRateSchema),
  })

  const { mutateAsync, isPending } = useUpdateTaxRate(taxRate.id)

  const buildRules = (key: string, data: { value: string }[]) =>
    data?.map((product) => ({
      reference: key,
      reference_id: product.value,
    })) || []

  const handleSubmit = form.handleSubmit(async (data) => {
    const rules = [
      ...buildRules("product", data.products),
      ...buildRules("product_type", data.product_types),
      ...buildRules("product_collection", data.product_collections),
      ...buildRules("product_tag", data.product_tags),
      ...buildRules("customer_group", data.customer_groups),
    ]

    await mutateAsync(
      {
        name: data.name,
        code: data.code || undefined,
        rate: data.rate,
        is_combinable: data.is_combinable,
        rules,
      },
      {
        onSuccess: () => handleSuccess(`/settings/taxes/${taxRegion.id}`),
      }
    )
  })

  const [open, setOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [conditionType, setConditionType] = useState<ConditionEntities | null>(
    null
  )
  const selectedConditionTypes = useWatch({
    name: "selected_condition_types",
    control: form.control,
  })

  const selectedProducts = useWatch({
    control: form.control,
    name: "products",
  })

  const selectedProductCollections = useWatch({
    control: form.control,
    name: "product_collections",
  })

  const selectedProductTypes = useWatch({
    control: form.control,
    name: "product_types",
  })

  const selectedProductTags = useWatch({
    control: form.control,
    name: "product_tags",
  })

  const selectedCustomerGroups = useWatch({
    control: form.control,
    name: "customer_groups",
  })

  const handleSaveConditions = (type: ConditionEntities) => {
    return (options: ConditionsOption[]) => {
      form.setValue(type, options, {
        shouldDirty: true,
        shouldTouch: true,
      })

      setOpen(false)
    }
  }

  const selectedTypes = Object.keys(selectedConditionTypes || {})
    .filter(
      (k) => selectedConditionTypes[k as keyof typeof selectedConditionTypes]
    )
    .sort() as ConditionEntities[]

  const handleOpenDrawer = (type: ConditionEntities, operator: Operators) => {
    setConditionType(type)
    setOpen(true)
  }

  const toggleSelectedConditionTypes = (type: ConditionEntities) => {
    const state = { ...form.getValues().selected_condition_types }
    if (state[type]) {
      delete state[type]
    } else {
      state[type] = true
    }

    form.setValue("selected_condition_types", state, {
      shouldDirty: true,
      shouldTouch: true,
    })
  }

  const clearAllSelectedConditions = () => {
    form.setValue(
      "selected_condition_types",
      {
        [ConditionEntities.PRODUCT]: false,
        [ConditionEntities.PRODUCT_TYPE]: false,
        [ConditionEntities.PRODUCT_COLLECTION]: false,
        [ConditionEntities.PRODUCT_TAG]: false,
        [ConditionEntities.CUSTOMER_GROUP]: false,
      },
      {
        shouldDirty: true,
        shouldTouch: true,
      }
    )
  }

  const [, setSearchParams] = useSearchParams()
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setConditionType(null)
      setSearchParams(
        {},
        {
          replace: true,
        }
      )
    }

    setOpen(open)
  }

  return (
    <RouteFocusModal.Form form={form}>
      <form onSubmit={handleSubmit} className="flex h-full flex-col">
        <RouteFocusModal.Header>
          <div className="flex items-center justify-end gap-x-2">
            <RouteFocusModal.Close asChild>
              <Button variant="secondary" size="small">
                {t("actions.cancel")}
              </Button>
            </RouteFocusModal.Close>
            <Button type="submit" size="small" isLoading={isPending}>
              {t("actions.save")}
            </Button>
          </div>
        </RouteFocusModal.Header>

        <RouteFocusModal.Body className="flex h-full w-full flex-col items-center overflow-hidden">
          <SplitView open={open} onOpenChange={handleOpenChange}>
            <SplitView.Content>
              <div
                className={clx("flex flex-col overflow-auto", {
                  "items-center": !open,
                })}
              >
                <div className="flex w-full max-w-[720px] flex-col gap-y-8 py-16">
                  <div>
                    <Heading className="text-left">
                      {t("taxRates.edit.title")}
                    </Heading>

                    <Text className="text-ui-fg-subtle txt-small">
                      {t("taxRates.edit.description")}
                    </Text>
                  </div>

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
                        </Form.Item>
                      )
                    }}
                  />

                  <Form.Field
                    control={form.control}
                    name="rate"
                    render={({ field }) => {
                      return (
                        <Form.Item>
                          <Form.Label>{t("fields.rate")}</Form.Label>

                          <Form.Control>
                            <DeprecatedPercentageInput
                              {...field}
                              value={field.value}
                              onChange={(e) => {
                                if (e.target.value) {
                                  field.onChange(parseInt(e.target.value))
                                }
                              }}
                            />
                          </Form.Control>
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
                          <Form.Label>{t("fields.code")}</Form.Label>

                          <Form.Control>
                            <Input {...field} />
                          </Form.Control>
                        </Form.Item>
                      )
                    }}
                  />

                  {taxRate.tax_region?.parent_id && (
                    <Form.Field
                      control={form.control}
                      name="is_combinable"
                      render={({
                        field: { ref, onChange, value, ...field },
                      }) => {
                        return (
                          <Form.Item>
                            <Form.Label>
                              {t("taxRates.fields.isCombinable")}
                            </Form.Label>

                            <Form.Control>
                              <Switch
                                {...field}
                                checked={value}
                                onCheckedChange={onChange}
                              />
                            </Form.Control>
                          </Form.Item>
                        )
                      }}
                    />
                  )}

                  {!taxRate.is_default && (
                    <div className="flex flex-col gap-y-8">
                      {selectedTypes.length > 0 && (
                        <div className="flex flex-col items-start gap-y-4">
                          {selectedTypes.map((selectedType) => {
                            if (
                              selectedType in (selectedConditionTypes || {})
                            ) {
                              const field = form.getValues(selectedType) || []

                              return (
                                <Condition
                                  key={selectedType}
                                  type={selectedType}
                                  labels={field.map((f) => f.value)}
                                  onClick={() => {
                                    setConditionType(selectedType)
                                    setOpen(true)
                                  }}
                                />
                              )
                            }
                          })}
                        </div>
                      )}

                      <div className="flex items-center gap-x-2">
                        <DropdownMenu
                          open={isDropdownOpen}
                          onOpenChange={(v) => {
                            v && setIsDropdownOpen(v)
                          }}
                        >
                          <DropdownMenu.Trigger asChild>
                            <Button variant="secondary" size="small">
                              {t("discounts.conditions.manageTypesAction")}
                            </Button>
                          </DropdownMenu.Trigger>

                          <DropdownMenu.Content
                            onInteractOutside={() => setIsDropdownOpen(false)}
                          >
                            {Object.values(ConditionEntities).map((type) => (
                              <DropdownMenu.CheckboxItem
                                key={type}
                                checked={selectedConditionTypes[type]}
                                onCheckedChange={() =>
                                  toggleSelectedConditionTypes(type)
                                }
                              >
                                <Text
                                  size="small"
                                  weight={
                                    selectedConditionTypes[type]
                                      ? "plus"
                                      : "regular"
                                  }
                                >
                                  {t(`fields.${type}`)}
                                </Text>
                              </DropdownMenu.CheckboxItem>
                            ))}
                          </DropdownMenu.Content>
                        </DropdownMenu>

                        {selectedTypes.length > 0 && (
                          <Button
                            variant="transparent"
                            size="small"
                            type="button"
                            onClick={clearAllSelectedConditions}
                            className="text-ui-fg-muted hover:text-ui-fg-subtle"
                          >
                            {t("actions.clearAll")}
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </SplitView.Content>

            <SplitView.Drawer>
              <ConditionsDrawer
                product={{
                  selected: selectedProducts,
                  onSave: handleSaveConditions(ConditionEntities.PRODUCT),
                }}
                productCollection={{
                  selected: selectedProductCollections,
                  onSave: handleSaveConditions(
                    ConditionEntities.PRODUCT_COLLECTION
                  ),
                }}
                productType={{
                  selected: selectedProductTypes,
                  onSave: handleSaveConditions(ConditionEntities.PRODUCT_TYPE),
                }}
                productTag={{
                  selected: selectedProductTags,
                  onSave: handleSaveConditions(ConditionEntities.PRODUCT_TAG),
                }}
                customerGroup={{
                  selected: selectedCustomerGroups,
                  onSave: handleSaveConditions(
                    ConditionEntities.CUSTOMER_GROUP
                  ),
                }}
                selected={conditionType}
              />
            </SplitView.Drawer>
          </SplitView>
        </RouteFocusModal.Body>
      </form>
    </RouteFocusModal.Form>
  )
}
