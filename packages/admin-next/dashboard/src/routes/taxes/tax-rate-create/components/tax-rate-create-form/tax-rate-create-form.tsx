import { zodResolver } from "@hookform/resolvers/zod"
import {
  Button,
  clx,
  DropdownMenu,
  Heading,
  Input,
  Select,
  Switch,
  Text,
} from "@medusajs/ui"
import { useForm, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as zod from "zod"

import { TaxRegionResponse } from "@medusajs/types"
import { useState } from "react"
import { useSearchParams } from "react-router-dom"
import { Form } from "../../../../../components/common/form"
import { DeprecatedPercentageInput } from "../../../../../components/inputs/percentage-input"
import { SplitView } from "../../../../../components/layout/split-view"
import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/route-modal"
import { useCreateTaxRate } from "../../../../../hooks/api/tax-rates"
import { useTaxRegions } from "../../../../../hooks/api/tax-regions"
import { ConditionsDrawer } from "../../../common/components/conditions-drawer"
import { ConditionEntities } from "../../../common/constants"
import {
  ConditionEntitiesValues,
  ConditionsOption,
} from "../../../common/types"
import { Condition } from "../condition"

const SelectedConditionTypesSchema = zod.object({
  [ConditionEntities.PRODUCT]: zod.boolean(),
  [ConditionEntities.PRODUCT_COLLECTION]: zod.boolean(),
  [ConditionEntities.PRODUCT_TAG]: zod.boolean(),
  [ConditionEntities.PRODUCT_TYPE]: zod.boolean(),
  [ConditionEntities.CUSTOMER_GROUP]: zod.boolean(),
})

const ConditionSchema = zod.array(
  zod.object({
    label: zod.string(),
    value: zod.string(),
  })
)

const CreateTaxRateSchema = zod.object({
  tax_region_id: zod.string(),
  name: zod.string(),
  code: zod.string(),
  rate: zod.number(),
  is_combinable: zod.boolean().default(false),
  selected_condition_types: SelectedConditionTypesSchema,
  products: ConditionSchema,
  product_types: ConditionSchema,
  product_collections: ConditionSchema,
  product_tags: ConditionSchema,
  customer_groups: ConditionSchema,
})

export const TaxRateCreateForm = ({
  taxRegion,
}: {
  taxRegion: TaxRegionResponse
}) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<zod.infer<typeof CreateTaxRateSchema>>({
    defaultValues: {
      tax_region_id: taxRegion.id,
      selected_condition_types: {
        [ConditionEntities.PRODUCT]: true,
        [ConditionEntities.PRODUCT_TYPE]: false,
        [ConditionEntities.PRODUCT_COLLECTION]: false,
        [ConditionEntities.PRODUCT_TAG]: false,
        [ConditionEntities.CUSTOMER_GROUP]: false,
      },
      products: [],
      product_types: [],
      product_collections: [],
      product_tags: [],
      customer_groups: [],
    },
    resolver: zodResolver(CreateTaxRateSchema),
  })

  const { tax_regions: taxRegions } = useTaxRegions({
    parent_id: taxRegion.id,
    province_code: { $ne: "null" },
  })

  const { mutateAsync, isPending } = useCreateTaxRate()

  const handleSubmit = form.handleSubmit(async (data) => {
    await mutateAsync(
      {
        name: data.name,
        code: data.code,
        rate: data.rate,
        is_combinable: data.is_combinable,
        tax_region_id: data.tax_region_id || taxRegion.id,
        rules:
          data.products?.map((product) => ({
            reference: "product",
            reference_id: product.value,
          })) || [],
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

  const handleSaveConditions = (type: ConditionEntitiesValues) => {
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
                className={clx("flex flex-col overflow-auto py-16", {
                  "items-center": !open,
                })}
              >
                <div className="flex w-full max-w-[720px] flex-col gap-y-8">
                  <div>
                    <Heading className="text-left">
                      {t("taxRates.create.title")}
                    </Heading>

                    <Text className="text-ui-fg-subtle txt-small">
                      {t("taxRates.create.description")}
                    </Text>
                  </div>

                  <Form.Field
                    control={form.control}
                    name="tax_region_id"
                    render={({ field: { ref, onChange, ...field } }) => {
                      return (
                        <Form.Item>
                          <Form.Label>{t("fields.province")}</Form.Label>

                          <Form.Control>
                            <Select {...field} onValueChange={onChange}>
                              <Select.Trigger ref={ref}>
                                <Select.Value />
                              </Select.Trigger>

                              <Select.Content>
                                {taxRegions?.map((taxRegion) => (
                                  <Select.Item
                                    key={taxRegion.id}
                                    value={taxRegion.id}
                                  >
                                    {taxRegion.province_code}
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

                  {taxRegion.parent_id && (
                    <Form.Field
                      control={form.control}
                      name="is_combinable"
                      render={({ field: { value, onChange, ...field } }) => {
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

                  <div className="flex flex-col gap-y-8">
                    {selectedTypes.length > 0 && (
                      <div className="flex flex-col items-start gap-y-4">
                        {selectedTypes.map((selectedType) => {
                          if (selectedType in (selectedConditionTypes || {})) {
                            const field = form.getValues(selectedType) || []

                            return (
                              <Condition
                                key={selectedType}
                                type={selectedType}
                                labels={field.map((f) => f.label)}
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
                          onInteractOutside={(e) => {
                            setIsDropdownOpen(true)
                          }}
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
