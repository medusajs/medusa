import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Heading, Input, Switch, Text, clx } from "@medusajs/ui"
import * as Collapsible from "@radix-ui/react-collapsible"
import { useAdminCreateTaxRate } from "medusa-react"
import { useState } from "react"
import { useForm, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
import { z } from "zod"

import { OnChangeFn, RowSelectionState } from "@tanstack/react-table"
import { Form } from "../../../../../components/common/form"
import { PercentageInput } from "../../../../../components/common/percentage-input"
import { SplitView } from "../../../../../components/layout/split-view"
import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/route-modal"
import { OverrideTable } from "../../../common/components/overrides-drawer/overrides-drawer"
import { OVERRIDE } from "../../../common/constants"

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
  products: z.array(z.string()),
  product_types: z.array(z.string()),
  shipping_options: z.array(z.string()),
})

export const CreateTaxRateForm = () => {
  const [open, setOpen] = useState(false)
  const [override, setOverride] = useState<OVERRIDE | null>(null)

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

  const [productRowSelection, setProductRowSelection] =
    useState<RowSelectionState>({})

  const selectedProducts = useWatch({
    control: form.control,
    name: "products",
    defaultValue: [],
  })

  const [productTypeRowSelection, setProductTypeRowSelection] =
    useState<RowSelectionState>({})

  const selectedProductTypes = useWatch({
    control: form.control,
    name: "product_types",
    defaultValue: [],
  })

  const [shippingOptionRowSelection, setShippingOptionRowSelection] =
    useState<RowSelectionState>({})

  const selectedShippingOptions = useWatch({
    control: form.control,
    name: "shipping_options",
    defaultValue: [],
  })

  const { mutateAsync, isLoading } = useAdminCreateTaxRate()

  const handleSubmit = form.handleSubmit(async (data) => {
    const { rate, ...rest } = data

    await mutateAsync(
      {
        region_id: id!,
        rate: Number(rate),
        ...rest,
      },
      {
        onSuccess: () => {
          handleSuccess()
        },
      }
    )
  })

  const openOverrideDrawer = (override: OVERRIDE) => {
    setOverride(override)
    setOpen(true)
  }

  const handleOpenChange = (open: boolean) => {
    setOpen(open)

    if (!open) {
      let id: RowSelectionState | undefined = undefined
      let updater: OnChangeFn<RowSelectionState> | undefined = undefined

      switch (override) {
        case OVERRIDE.PRODUCT:
          id = selectedProducts.reduce((acc, c) => {
            acc[c] = true
            return acc
          }, {} as RowSelectionState)
          updater = setProductRowSelection
          break
        case OVERRIDE.PRODUCT_TYPE:
          id = selectedProductTypes.reduce((acc, c) => {
            acc[c] = true
            return acc
          }, {} as RowSelectionState)
          updater = setProductTypeRowSelection
          break
        case OVERRIDE.SHIPPING_OPTION:
          id = selectedShippingOptions.reduce((acc, c) => {
            acc[c] = true
            return acc
          }, {} as RowSelectionState)
          updater = setShippingOptionRowSelection
          break
        default:
          break
      }

      if (!id || !updater) {
        return
      }

      updater(id)
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
          <SplitView open={open} onOpenChange={handleOpenChange}>
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
                        <div className="flex items-center justify-end">
                          <Button
                            size="small"
                            type="button"
                            variant="secondary"
                            onClick={() => openOverrideDrawer(OVERRIDE.PRODUCT)}
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
                              openOverrideDrawer(OVERRIDE.PRODUCT_TYPE)
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
                              openOverrideDrawer(OVERRIDE.SHIPPING_OPTION)
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
              <div className="flex size-full flex-col overflow-hidden">
                <OverrideTable
                  product={{
                    updater: setProductRowSelection,
                    state: productRowSelection,
                  }}
                  productType={{
                    updater: setProductTypeRowSelection,
                    state: productTypeRowSelection,
                  }}
                  shippingOption={{
                    updater: setShippingOptionRowSelection,
                    state: shippingOptionRowSelection,
                  }}
                  regionId={id!}
                  selected={override}
                />
                <div className="flex items-center justify-end gap-x-2 border-t p-4">
                  <SplitView.Close type="button">
                    {t("actions.cancel")}
                  </SplitView.Close>
                  <Button size="small" type="button">
                    {t("actions.save")}
                  </Button>
                </div>
              </div>
            </SplitView.Drawer>
          </SplitView>
        </RouteFocusModal.Body>
      </form>
    </RouteFocusModal.Form>
  )
}
