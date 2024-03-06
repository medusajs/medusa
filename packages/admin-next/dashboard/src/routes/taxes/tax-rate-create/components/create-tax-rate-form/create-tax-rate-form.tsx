import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Heading, Input, Switch, Text, clx } from "@medusajs/ui"
import * as Collapsible from "@radix-ui/react-collapsible"
import { useAdminCreateTaxRate } from "medusa-react"
import { useState } from "react"
import { useForm, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
import { z } from "zod"

import { Form } from "../../../../../components/common/form"
import { PercentageInput } from "../../../../../components/common/percentage-input"
import { SplitView } from "../../../../../components/layout/split-view"
import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/route-modal"
import { OverrideTable } from "../../../common/components/overrides-drawer/overrides-drawer"
import { Override } from "../../../common/constants"
import { OverrideOption } from "../../../common/types"

const CreateTaxRateSchema = z.object({
  name: z.string().min(1),
  code: z.string().min(1),
  rate: z.union([z.string(), z.number()]).refine((value) => {
    if (value === "") {
      return false
    }

    const num = Number(value)

    if (num >= 0 && num <= 100) {
      return true
    }

    return false
  }, "Tax rate must be a number between 0 and 100"),
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

export const CreateTaxRateForm = () => {
  const [open, setOpen] = useState(false)
  const [override, setOverride] = useState<Override | null>(null)

  const { id } = useParams()
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<z.infer<typeof CreateTaxRateSchema>>({
    defaultValues: {
      name: "",
      code: "",
      rate: "",
      products: [],
      product_types: [],
      shipping_options: [],
    },
    resolver: zodResolver(CreateTaxRateSchema),
  })

  const selectedProducts = useWatch({
    control: form.control,
    name: "products",
    defaultValue: [],
  })
  const selectedProductTypes = useWatch({
    control: form.control,
    name: "product_types",
    defaultValue: [],
  })

  const selectedShippingOptions = useWatch({
    control: form.control,
    name: "shipping_options",
    defaultValue: [],
  })

  const { mutateAsync, isLoading } = useAdminCreateTaxRate()

  const handleSubmit = form.handleSubmit(async (data) => {
    const { rate, products, product_types, shipping_options, ...rest } = data

    await mutateAsync(
      {
        region_id: id!,
        rate: Number(rate),
        products:
          products.length > 0 ? products.map((p) => p.value) : undefined,
        product_types:
          product_types.length > 0
            ? product_types.map((p) => p.value)
            : undefined,
        shipping_options:
          shipping_options.length > 0
            ? shipping_options.map((p) => p.value)
            : undefined,
        ...rest,
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

  return (
    <RouteFocusModal.Form form={form}>
      <form
        className="flex h-full flex-col overflow-hidden"
        onSubmit={handleSubmit}
      >
        <RouteFocusModal.Header>
          <div className="flex items-center justify-end gap-x-2">
            <RouteFocusModal.Close asChild>
              <Button size="small" variant="secondary">
                {t("actions.cancel")}
              </Button>
            </RouteFocusModal.Close>
            <Button size="small" type="submit" isLoading={isLoading}>
              {t("actions.save")}
            </Button>
          </div>
        </RouteFocusModal.Header>
        <RouteFocusModal.Body className="flex overflow-hidden">
          <SplitView open={open} onOpenChange={setOpen}>
            <SplitView.Content>
              <div
                className={clx(
                  "flex h-full w-full flex-col items-center overflow-y-auto p-16"
                )}
                id="form-section"
              >
                <div className="flex w-full max-w-[720px] flex-col gap-y-8">
                  <div>
                    <Heading>{t("taxes.taxRate.createTaxRate")}</Heading>
                    <Text size="small" className="text-ui-fg-subtle">
                      {t("taxes.taxRate.createTaxRateHint")}
                    </Text>
                  </div>
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
                        render={({ field }) => {
                          return (
                            <Form.Item>
                              <Form.Label>{t("fields.rate")}</Form.Label>
                              <Form.Control>
                                <PercentageInput {...field} />
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
                              <Form.Label>{t("fields.code")}</Form.Label>
                              <Form.Control>
                                <Input type="number" {...field} />
                              </Form.Control>
                              <Form.ErrorMessage />
                            </Form.Item>
                          )
                        }}
                      />
                    </div>
                  </div>
                  <div className="bg-ui-border-base h-px w-full" />
                  <Collapsible.Root>
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
                        <Switch />
                      </Collapsible.Trigger>
                    </div>
                    <Collapsible.Content>
                      <div className="flex flex-col gap-y-4 pt-4">
                        {selectedProducts && (
                          <pre>{JSON.stringify(selectedProducts, null, 2)}</pre>
                        )}
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
                  <Collapsible.Root>
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
                        <Switch />
                      </Collapsible.Trigger>
                    </div>
                    <Collapsible.Content>
                      <div className="flex flex-col gap-y-4 pt-4">
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
                  <Collapsible.Root>
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
                        <Switch />
                      </Collapsible.Trigger>
                    </div>
                    <Collapsible.Content>
                      <div className="flex flex-col gap-y-4 pt-4">
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
                regionId={id!}
                selected={override}
              />
            </SplitView.Drawer>
          </SplitView>
        </RouteFocusModal.Body>
      </form>
    </RouteFocusModal.Form>
  )
}
