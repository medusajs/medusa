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

import { TaxRegionResponse } from "@medusajs/types"
import { useState } from "react"
import { useSearchParams } from "react-router-dom"
import { Form } from "../../../../components/common/form"
import { PercentageInput } from "../../../../components/common/percentage-input"
import { SplitView } from "../../../../components/layout/split-view"
import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../components/route-modal"
import { useCreateTaxRate } from "../../../../hooks/api/tax-rates"
import { ConditionsDrawer } from "../../common/components/conditions-drawer"
import { ConditionsOption } from "../../common/types"
import {
  Condition,
  ConditionEntities,
  DiscountConditionOperator,
} from "./condition"

const SelectedConditionTypesSchema = zod
  .object({
    [ConditionEntities.PRODUCT]: zod.boolean().optional(),
  })
  .optional()

const CreateTaxRateSchema = zod.object({
  name: zod.string(),
  code: zod.string(),
  rate: zod.number(),
  is_combinable: zod.boolean().default(false),
  selected_condition_types: SelectedConditionTypesSchema,
  products: zod.array(
    zod.object({
      label: zod.string(),
      value: zod.string(),
    })
  ),
  products_operator: zod.enum(["in", "not_in"]).optional(),
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
      selected_condition_types: {
        [ConditionEntities.PRODUCT]: true,
      },
      products: [],
    },
    resolver: zodResolver(CreateTaxRateSchema),
  })

  const { mutateAsync } = useCreateTaxRate()

  const handleSubmit = form.handleSubmit(async (data) => {
    console.log("data - ", data)
    await mutateAsync(
      {
        name: data.name,
        code: data.code,
        rate: data.rate,
        is_combinable: data.is_combinable,
        tax_region_id: taxRegion.id,
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

  const [isLoading, setIsLoading] = useState(false)
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

  const handleSaveConditions = (type: ConditionEntities) => {
    return (options: ConditionsOption[]) => {
      form.setValue(type, options, {
        shouldDirty: true,
        shouldTouch: true,
      })

      setOpen(false)
    }
  }

  const selectedTypes = Object.keys(selectedConditionTypes)
    .filter(
      (k) => selectedConditionTypes[k as keyof typeof selectedConditionTypes]
    )
    .sort() as ConditionEntities[]

  const handleOpenDrawer = (
    type: ConditionEntities,
    operator: DiscountConditionOperator
  ) => {
    form.setValue(`${type}_operator`, operator)
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
            <Button type="submit" size="small" isLoading={isLoading}>
              {t("actions.save")}
            </Button>
          </div>
        </RouteFocusModal.Header>

        <RouteFocusModal.Body className="flex h-full w-full flex-col items-center overflow-hidden">
          <SplitView open={open} onOpenChange={handleOpenChange}>
            <SplitView.Content>
              <div
                className={clx("flex flex-col overflow-auto p-16", {
                  "items-center": !open,
                })}
              >
                <div className="flex flex-col gap-y-8 md:min-w-[400px]">
                  <div>
                    <Heading className="text-left">
                      {t("taxRates.create.title")}
                    </Heading>

                    <Text className="text-ui-fg-subtle txt-small">
                      Creates a tax rates for a tax region
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
                            <PercentageInput
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
                      render={({ field }) => {
                        return (
                          <Form.Item>
                            <Form.Label>Is combinable?</Form.Label>

                            <Form.Control>
                              <Switch
                                {...field}
                                checked={!!field.value}
                                onCheckedChange={field.onChange}
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
                        {selectedTypes.map((t) => {
                          if (t in (selectedConditionTypes || {})) {
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
              </div>
            </SplitView.Content>

            <SplitView.Drawer>
              <ConditionsDrawer
                product={{
                  selected: selectedProducts,
                  onSave: handleSaveConditions(ConditionEntities.PRODUCT),
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
