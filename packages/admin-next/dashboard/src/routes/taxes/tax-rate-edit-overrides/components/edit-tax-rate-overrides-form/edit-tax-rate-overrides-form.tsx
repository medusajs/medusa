import { TaxRate } from "@medusajs/medusa"
import { Button, Heading, Switch, Text, clx } from "@medusajs/ui"
import * as Collapsible from "@radix-ui/react-collapsible"
import { useAdminUpdateTaxRate } from "medusa-react"
import { useState } from "react"
import { useForm, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { z } from "zod"

import { zodResolver } from "@hookform/resolvers/zod"
import { useSearchParams } from "react-router-dom"
import { SplitView } from "../../../../../components/layout/split-view"
import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/route-modal"
import { OverrideGrid } from "../../../common/components/override-grid"
import { OverrideTable } from "../../../common/components/overrides-drawer/overrides-drawer"
import { Override } from "../../../common/constants"
import { OverrideOption, OverrideState } from "../../../common/types"

type EditTaxRateOverridesFormProps = {
  taxRate: TaxRate
}

const EditTaxRateOverridesSchema = z.object({
  products: z.array(
    z.object({
      label: z.string(),
      value: z.string(),
    })
  ),
  product_types: z.array(
    z.object({
      label: z.string(),
      value: z.string(),
    })
  ),
  shipping_options: z.array(
    z.object({
      label: z.string(),
      value: z.string(),
    })
  ),
})

export const EditTaxRateOverridesForm = ({
  taxRate,
}: EditTaxRateOverridesFormProps) => {
  const [open, setOpen] = useState(false)

  const [override, setOverride] = useState<Override | null>(null)
  const [state, setState] = useState<OverrideState>({
    [Override.PRODUCT]: taxRate.products?.length > 0,
    [Override.PRODUCT_TYPE]: taxRate.product_types?.length > 0,
    [Override.SHIPPING_OPTION]: taxRate.shipping_options?.length > 0,
  })

  const [, setSearchParams] = useSearchParams()

  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<z.infer<typeof EditTaxRateOverridesSchema>>({
    defaultValues: {
      products:
        taxRate.products?.map((p) => ({
          label: p.title,
          value: p.id,
        })) || [],
      product_types:
        taxRate.product_types?.map((pt) => ({
          label: pt.value,
          value: pt.id,
        })) || [],
      shipping_options:
        taxRate.shipping_options?.map((so) => ({
          label: so.name,
          value: so.id,
        })) || [],
    },
    resolver: zodResolver(EditTaxRateOverridesSchema),
  })

  const selectedProducts = useWatch({
    control: form.control,
    name: "products",
  })
  const selectedProductTypes = useWatch({
    control: form.control,
    name: "product_types",
  })

  const selectedShippingOptions = useWatch({
    control: form.control,
    name: "shipping_options",
  })

  const { mutateAsync, isLoading } = useAdminUpdateTaxRate(taxRate.id)
  const handleSubmit = form.handleSubmit(async (data) => {
    const { products, product_types, shipping_options } = data

    const productsPaylaod = state[Override.PRODUCT]
      ? products.map((p) => p.value)
      : []

    const productTypesPayload = state[Override.PRODUCT_TYPE]
      ? product_types.map((p) => p.value)
      : []

    const shippingOptionsPayload = state[Override.SHIPPING_OPTION]
      ? shipping_options.map((p) => p.value)
      : []

    await mutateAsync(
      {
        products: productsPaylaod,
        product_types: productTypesPayload,
        shipping_options: shippingOptionsPayload,
      },
      {
        onSuccess: () => {
          handleSuccess()
        },
      }
    )
  })

  const handleOpenDrawer = (override: Override) => {
    setOverride(override)
    setOpen(true)
  }

  const handleSaveOverrides = (override: Override) => {
    let field: "products" | "product_types" | "shipping_options"

    switch (override) {
      case Override.PRODUCT:
        field = "products"
        break
      case Override.PRODUCT_TYPE:
        field = "product_types"
        break
      case Override.SHIPPING_OPTION:
        field = "shipping_options"
        break
    }

    return (options: OverrideOption[]) => {
      form.setValue(field, options, {
        shouldDirty: true,
        shouldTouch: true,
      })

      setOpen(false)
    }
  }

  const handleRemoveOverride = (override: Override) => {
    let field: "products" | "product_types" | "shipping_options"

    switch (override) {
      case Override.PRODUCT:
        field = "products"
        break
      case Override.PRODUCT_TYPE:
        field = "product_types"
        break
      case Override.SHIPPING_OPTION:
        field = "shipping_options"
        break
    }

    return (value: string) => {
      const current = form.getValues(field)

      const newValue = current.filter((c: OverrideOption) => c.value !== value)

      form.setValue(field, newValue, {
        shouldDirty: true,
        shouldTouch: true,
      })
    }
  }

  const handleClearOverrides = (override: Override) => {
    let field: "products" | "product_types" | "shipping_options"

    switch (override) {
      case Override.PRODUCT:
        field = "products"
        break
      case Override.PRODUCT_TYPE:
        field = "product_types"
        break
      case Override.SHIPPING_OPTION:
        field = "shipping_options"
        break
    }

    return () => {
      form.setValue(field, [], {
        shouldDirty: true,
        shouldTouch: true,
      })
    }
  }

  const handleStateChange = (override: Override) => {
    return (enabled: boolean) => {
      setState((prev) => ({
        ...prev,
        [override]: enabled,
      }))
    }
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setOverride(null)
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
              <div
                className={clx(
                  "flex h-full w-full flex-col items-center overflow-y-auto p-16"
                )}
              >
                <div className="flex w-full max-w-[720px] flex-col gap-y-8">
                  <div>
                    <Heading>{t("taxes.taxRate.editOverridesTitle")}</Heading>
                    <Text size="small" className="text-ui-fg-subtle">
                      {t("taxes.taxRate.editOverridesHint")}
                    </Text>
                  </div>
                  <Collapsible.Root
                    open={state[Override.PRODUCT]}
                    onOpenChange={handleStateChange(Override.PRODUCT)}
                  >
                    <div className="grid grid-cols-[1fr_32px] items-start gap-x-4">
                      <div className="flex flex-col">
                        <Text size="small" weight="plus" leading="compact">
                          {t("taxes.taxRate.productOverridesLabel")}
                        </Text>
                        <Text size="small" className="text-ui-fg-subtle">
                          {t("taxes.taxRate.productOverridesHint")}
                        </Text>
                      </div>
                      <Collapsible.Trigger asChild>
                        <Switch className="data-[state=open]:bg-ui-bg-interactive" />
                      </Collapsible.Trigger>
                    </div>
                    <Collapsible.Content>
                      <div className="flex flex-col gap-y-4 pt-4">
                        <OverrideGrid
                          overrides={selectedProducts}
                          onClear={handleClearOverrides(Override.PRODUCT)}
                          onRemove={handleRemoveOverride(Override.PRODUCT)}
                        />
                        <div className="flex items-center justify-end">
                          <Button
                            size="small"
                            type="button"
                            variant="secondary"
                            onClick={() => handleOpenDrawer(Override.PRODUCT)}
                          >
                            {t("taxes.taxRate.addProductOverridesAction")}
                          </Button>
                        </div>
                      </div>
                    </Collapsible.Content>
                  </Collapsible.Root>
                  <div className="bg-ui-border-base h-px w-full" />
                  <Collapsible.Root
                    open={state[Override.PRODUCT_TYPE]}
                    onOpenChange={handleStateChange(Override.PRODUCT_TYPE)}
                  >
                    <div className="grid grid-cols-[1fr_32px] items-start gap-x-4">
                      <div className="flex flex-col">
                        <Text size="small" weight="plus" leading="compact">
                          {t("taxes.taxRate.productTypeOverridesLabel")}
                        </Text>
                        <Text size="small" className="text-ui-fg-subtle">
                          {t("taxes.taxRate.productTypeOverridesHint")}
                        </Text>
                      </div>
                      <Collapsible.Trigger asChild>
                        <Switch className="data-[state=open]:bg-ui-bg-interactive" />
                      </Collapsible.Trigger>
                    </div>
                    <Collapsible.Content>
                      <div className="flex flex-col gap-y-4 pt-4">
                        <OverrideGrid
                          overrides={selectedProductTypes}
                          onClear={handleClearOverrides(Override.PRODUCT_TYPE)}
                          onRemove={handleRemoveOverride(Override.PRODUCT_TYPE)}
                        />
                        <div className="flex items-center justify-end">
                          <Button
                            size="small"
                            type="button"
                            variant="secondary"
                            onClick={() =>
                              handleOpenDrawer(Override.PRODUCT_TYPE)
                            }
                          >
                            {t("taxes.taxRate.addProductTypeOverridesAction")}
                          </Button>
                        </div>
                      </div>
                    </Collapsible.Content>
                  </Collapsible.Root>
                  <div className="bg-ui-border-base h-px w-full" />
                  <Collapsible.Root
                    open={state[Override.SHIPPING_OPTION]}
                    onOpenChange={handleStateChange(Override.SHIPPING_OPTION)}
                  >
                    <div className="grid grid-cols-[1fr_32px] items-start gap-x-4">
                      <div className="flex flex-col">
                        <Text size="small" weight="plus" leading="compact">
                          {t("taxes.taxRate.shippingOptionOverridesLabel")}
                        </Text>
                        <Text size="small" className="text-ui-fg-subtle">
                          {t("taxes.taxRate.shippingOptionOverridesHint")}
                        </Text>
                      </div>
                      <Collapsible.Trigger asChild>
                        <Switch className="data-[state=open]:bg-ui-bg-interactive" />
                      </Collapsible.Trigger>
                    </div>
                    <Collapsible.Content>
                      <div className="flex flex-col gap-y-4 pt-4">
                        <OverrideGrid
                          overrides={selectedShippingOptions}
                          onClear={handleClearOverrides(
                            Override.SHIPPING_OPTION
                          )}
                          onRemove={handleRemoveOverride(
                            Override.SHIPPING_OPTION
                          )}
                        />
                        <div className="flex items-center justify-end">
                          <Button
                            size="small"
                            type="button"
                            variant="secondary"
                            onClick={() =>
                              handleOpenDrawer(Override.SHIPPING_OPTION)
                            }
                          >
                            {t(
                              "taxes.taxRate.addShippingOptionOverridesAction"
                            )}
                          </Button>
                        </div>
                      </div>
                    </Collapsible.Content>
                  </Collapsible.Root>
                </div>
              </div>
            </SplitView.Content>
            <SplitView.Drawer>
              <OverrideTable
                product={{
                  selected: selectedProducts,
                  onSave: handleSaveOverrides(Override.PRODUCT),
                }}
                productType={{
                  selected: selectedProductTypes,
                  onSave: handleSaveOverrides(Override.PRODUCT_TYPE),
                }}
                shippingOption={{
                  selected: selectedShippingOptions,
                  onSave: handleSaveOverrides(Override.SHIPPING_OPTION),
                }}
                regionId={taxRate.region_id}
                selected={override}
              />
            </SplitView.Drawer>
          </SplitView>
        </RouteFocusModal.Body>
      </form>
    </RouteFocusModal.Form>
  )
}
