import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useSearchParams } from "react-router-dom"

import {
  Discount,
  DiscountCondition,
  DiscountConditionType,
} from "@medusajs/medusa"
import { Button, DropdownMenu, Heading, Text } from "@medusajs/ui"
import { adminDiscountKeys } from "medusa-react"
import { useForm, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as zod from "zod"

import { medusa, queryClient } from "../../../../../lib/medusa"

import { ListSummary } from "../../../../../components/common/list-summary"
import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/route-modal"

import { SplitView } from "../../../../../components/layout/split-view"
import { ConditionsDrawer } from "../../../common/components/conditions-drawer"
import { ConditionEntities } from "../../../common/constants"
import { ConditionsOption } from "../../../common/types"

enum DiscountConditionOperator {
  IN = "in",
  NOT_IN = "not_in",
}

type ConditionProps = {
  labels: string[]
  isInOperator: boolean
  type: ConditionEntities
  onClick: (op: DiscountConditionOperator) => void
}

type EditDiscountFormProps = {
  discount: Discount
}

const N = 1

const getDefault = (conditionType: ConditionEntities, labelProp: string) => {
  return (conditions: DiscountCondition[]) => {
    const condition = conditions.find(
      (c) => c.type === (conditionType as unknown as DiscountConditionType)
    )

    if (!condition || !condition[conditionType]) {
      return []
    }

    return condition[conditionType].map((p) => ({
      label: p[labelProp as keyof typeof p] as string,
      value: p.id,
    }))
  }
}

const getOperator = (conditionType: ConditionEntities) => {
  return (conditions: DiscountCondition[]) => {
    return conditions.find((c) => c.type === (conditionType as any))?.operator
  }
}

const SelectedConditionTypesSchema = zod.object({
  [ConditionEntities.PRODUCT]: zod.boolean().optional(),
  [ConditionEntities.PRODUCT_TAG]: zod.boolean().optional(),
  [ConditionEntities.PRODUCT_TYPE]: zod.boolean().optional(),
  [ConditionEntities.PRODUCT_COLLECTION]: zod.boolean().optional(),
  [ConditionEntities.CUSTOMER_GROUP]: zod.boolean().optional(),
})

type SelectedContionTypeKey =
  (typeof ConditionEntities)[keyof typeof ConditionEntities]

const EditDiscountConditionsSchema = zod.object({
  products: zod.array(
    zod.object({
      label: zod.string(),
      value: zod.string(),
    })
  ),
  product_types: zod.array(
    zod.object({
      label: zod.string(),
      value: zod.string(),
    })
  ),
  customer_groups: zod.array(
    zod.object({
      label: zod.string(),
      value: zod.string(),
    })
  ),
  product_collections: zod.array(
    zod.object({
      label: zod.string(),
      value: zod.string(),
    })
  ),
  product_tags: zod.array(
    zod.object({
      label: zod.string(),
      value: zod.string(),
    })
  ),
  products_operator: zod.nativeEnum(DiscountConditionOperator).optional(),
  product_tags_operator: zod.nativeEnum(DiscountConditionOperator).optional(),
  product_collections_operator: zod
    .nativeEnum(DiscountConditionOperator)
    .optional(),
  product_types_operator: zod.nativeEnum(DiscountConditionOperator).optional(),
  customer_groups_operator: zod
    .nativeEnum(DiscountConditionOperator)
    .optional(),
  selected_condition_types: SelectedConditionTypesSchema,
})

export const EditDiscountConditionsForm = ({
  discount,
}: EditDiscountFormProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const [conditionType, setConditionType] = useState<ConditionEntities | null>(
    null
  )

  const [, setSearchParams] = useSearchParams()

  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const conditions = discount.rule.conditions?.sort((c1, c2) =>
    c1.type.localeCompare(c2.type)
  ) // TODO: memo

  const form = useForm<zod.infer<typeof EditDiscountConditionsSchema>>({
    defaultValues: {
      products: getDefault(
        ConditionEntities.PRODUCT,
        "title"
      )(discount.rule.conditions),
      products_operator: getOperator(ConditionEntities.PRODUCT)(
        discount.rule.conditions
      ),
      product_types: getDefault(
        ConditionEntities.PRODUCT_TYPE,
        "value"
      )(discount.rule.conditions),
      product_types_operator: getOperator(ConditionEntities.PRODUCT_TYPE)(
        discount.rule.conditions
      ),
      product_collections: getDefault(
        ConditionEntities.PRODUCT_COLLECTION,
        "title"
      )(discount.rule.conditions),
      product_collections_operator: getOperator(
        ConditionEntities.PRODUCT_COLLECTION
      )(discount.rule.conditions),
      product_tags: getDefault(
        ConditionEntities.PRODUCT_TAG,
        "value"
      )(discount.rule.conditions),
      product_tags_operator: getOperator(ConditionEntities.PRODUCT_TAG)(
        discount.rule.conditions
      ),
      customer_groups: getDefault(
        ConditionEntities.CUSTOMER_GROUP,
        "name"
      )(discount.rule.conditions),
      customer_groups_operator: getOperator(ConditionEntities.CUSTOMER_GROUP)(
        discount.rule.conditions
      ),
      selected_condition_types: {
        [ConditionEntities.CUSTOMER_GROUP]: !!conditions.find(
          (c) => c.type === (ConditionEntities.CUSTOMER_GROUP as any)
        ),
        [ConditionEntities.PRODUCT_TYPE]: !!conditions.find(
          (c) => c.type === (ConditionEntities.PRODUCT_TYPE as any)
        ),
        [ConditionEntities.PRODUCT_TAG]: !!conditions.find(
          (c) => c.type === (ConditionEntities.PRODUCT_TAG as any)
        ),
        [ConditionEntities.PRODUCT_COLLECTION]: !!conditions.find(
          (c) => c.type === (ConditionEntities.PRODUCT_COLLECTION as any)
        ),
        [ConditionEntities.PRODUCT]: !!conditions.find(
          (c) => c.type === (ConditionEntities.PRODUCT as any)
        ),
      },
    },
    resolver: zodResolver(EditDiscountConditionsSchema),
  })

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
        [ConditionEntities.PRODUCT_TAG]: false,
        [ConditionEntities.PRODUCT_TYPE]: false,
        [ConditionEntities.PRODUCT_COLLECTION]: false,
        [ConditionEntities.CUSTOMER_GROUP]: false,
      },
      {
        shouldDirty: true,
        shouldTouch: true,
      }
    )
  }

  const selectedConditionTypes = useWatch({
    name: "selected_condition_types",
    control: form.control,
  })

  const selectedTypes = Object.keys(selectedConditionTypes)
    .filter(
      (k) => selectedConditionTypes[k as keyof typeof selectedConditionTypes]
    )
    .sort() as ConditionEntities[]

  const selectedProducts = useWatch({
    control: form.control,
    name: "products",
  })

  const selectedProductTypes = useWatch({
    control: form.control,
    name: "product_types",
  })

  const selectedCustomerGroups = useWatch({
    control: form.control,
    name: "customer_groups",
  })

  const selectedProductCollections = useWatch({
    control: form.control,
    name: "product_collections",
  })

  const selectedProductTags = useWatch({
    control: form.control,
    name: "product_tags",
  })

  const handleSubmit = form.handleSubmit(async (data) => {
    setIsLoading(true)

    const handleCondition = async (selectedType: string) => {
      if (
        !selectedConditionTypes[
          selectedType as keyof typeof selectedConditionTypes
        ]
      ) {
        return
      }

      const currentCondition = conditions.find((c) => c.type === selectedType)

      if (currentCondition) {
        // delete condition first (in case operator changed since we cannot update that trough API)
        await medusa.admin.discounts.deleteCondition(
          discount.id,
          currentCondition.id
        )
      }

      const payload = data[selectedType as SelectedContionTypeKey]

      if (payload?.length) {
        await medusa.admin.discounts.createCondition(discount.id, {
          operator: data[
            `${selectedType}_operator` as keyof typeof data
          ] as DiscountConditionOperator,
          [selectedType]: payload.map((d) => d.value),
        })
      }
    }

    const deleteUnselectedConditions = async () => {
      const unselectedConditions = conditions.filter(
        (c) => !selectedConditionTypes[c.type]
      )
      const deletePromises = unselectedConditions.map((c) =>
        medusa.admin.discounts.deleteCondition(discount.id, c.id)
      )
      await Promise.all(deletePromises)
    }

    for (const selectedType of Object.keys(selectedConditionTypes)) {
      await handleCondition(selectedType)
    }

    await deleteUnselectedConditions()

    await queryClient.invalidateQueries(adminDiscountKeys.detail(discount.id))

    setIsLoading(false)
    handleSuccess()
  })

  const handleOpenDrawer = (
    type: ConditionEntities,
    operator: DiscountConditionOperator
  ) => {
    form.setValue(`${type}_operator`, operator)
    setConditionType(type)
    setOpen(true)
  }

  const handleSaveConditions = (type: ConditionEntities) => {
    return (options: ConditionsOption[]) => {
      form.setValue(type, options, {
        shouldDirty: true,
        shouldTouch: true,
      })

      setOpen(false)
    }
  }

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
      <form
        className="flex h-full flex-col overflow-hidden"
        onSubmit={handleSubmit}
      >
        <RouteFocusModal.Header>
          <div className="flex items-center justify-end gap-x-2">
            <RouteFocusModal.Close asChild>
              <Button variant="secondary" size="small">
                {t("actions.cancel")}
              </Button>
            </RouteFocusModal.Close>
            <Button type="submit" size="small" isLoading={isLoading}>
              {t("actions.save")}
            </Button>
          </div>
        </RouteFocusModal.Header>
        <RouteFocusModal.Body className="flex h-full w-full flex-col items-center overflow-hidden">
          <SplitView open={open} onOpenChange={handleOpenChange}>
            <SplitView.Content>
              <div className="flex size-full flex-col items-center px-16">
                <div className="flex w-full max-w-[720px] flex-col gap-y-8 py-16">
                  <div>
                    <Heading>{t("discounts.conditions.editHeader")}</Heading>
                    <Text
                      size="small"
                      className="text-ui-fg-subtle text-pretty"
                    >
                      {t("discounts.conditions.editHint")}
                    </Text>
                  </div>
                  {selectedTypes.length > 0 && (
                    <div className="flex flex-col items-start gap-y-4">
                      {selectedTypes.map((t) => {
                        if (t in selectedConditionTypes) {
                          const field = form.getValues(t)
                          const operator = form.getValues(`${t}_operator`)

                          return field ? (
                            <Condition
                              key={t}
                              type={t}
                              labels={field.map((f) => f.label)}
                              isInOperator={operator === "in"}
                              onClick={(op) => handleOpenDrawer(t, op)}
                            />
                          ) : (
                            <Condition
                              key={t}
                              type={t}
                              isInOperator
                              labels={[]}
                              onClick={(op) => handleOpenDrawer(t, op)}
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
              </div>
            </SplitView.Content>
            <SplitView.Drawer>
              <ConditionsDrawer
                product={{
                  selected: selectedProducts,
                  onSave: handleSaveConditions(ConditionEntities.PRODUCT),
                }}
                productType={{
                  selected: selectedProductTypes,
                  onSave: handleSaveConditions(ConditionEntities.PRODUCT_TYPE),
                }}
                productCollection={{
                  selected: selectedProductCollections,
                  onSave: handleSaveConditions(
                    ConditionEntities.PRODUCT_COLLECTION
                  ),
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

function Condition({ labels, isInOperator, type, onClick }: ConditionProps) {
  const { t } = useTranslation()

  const isInButtonDisabled = !!labels.length && !isInOperator
  const isExButtonDisabled = !!labels.length && isInOperator

  return (
    <div className="text-center">
      <div className="bg-ui-bg-field shadow-borders-base inline-flex items-center divide-x overflow-hidden rounded-md">
        <Text
          as="span"
          size="small"
          leading="compact"
          weight="plus"
          className="text-ui-fg-muted shrink-0 px-2 py-1"
        >
          {t("discounts.conditions.edit.appliesTo")}
        </Text>
        <div className="text-ui-fg-subtle max-w-[240px] shrink-0">
          <Button
            type="button"
            variant="transparent"
            size="small"
            disabled={isInButtonDisabled}
            onClick={() => onClick("in" as DiscountConditionOperator)}
            className="txt-compact-small-plus disabled:text-ui-fg-subtle rounded-none"
          >
            {isInOperator && labels.length ? (
              <ListSummary
                inline
                n={N}
                className="!txt-compact-small-plus max-w-[200px]"
                list={labels}
              />
            ) : (
              t(labels.length ? "fields.all" : "fields.none")
            )}
          </Button>
        </div>

        <Text
          as="span"
          size="small"
          leading="compact"
          weight="plus"
          className="text-ui-fg-muted shrink-0 px-2 py-1"
        >
          {t(`discounts.conditions.edit.except.${type}`, {
            count: labels.length > 1 ? labels.length - 1 : labels.length,
          })}
        </Text>

        <div className="text-ui-fg-subtle shrink-0 overflow-hidden">
          <Button
            type="button"
            variant="transparent"
            size="small"
            disabled={isExButtonDisabled}
            onClick={() => onClick("not_in" as DiscountConditionOperator)}
            className="txt-compact-small-plus disabled:text-ui-fg-subtle max-w-[200px] rounded-none"
          >
            {!isInOperator && labels.length ? (
              <ListSummary
                inline
                n={N}
                className="!txt-compact-small-plus"
                list={labels}
              />
            ) : (
              t("fields.none")
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
