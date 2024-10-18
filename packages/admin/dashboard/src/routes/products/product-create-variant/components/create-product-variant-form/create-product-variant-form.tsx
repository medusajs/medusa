import { zodResolver } from "@hookform/resolvers/zod"
import { Button, ProgressStatus, ProgressTabs, toast } from "@medusajs/ui"
import { useEffect, useMemo, useState } from "react"
import { useFieldArray, useForm, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { z } from "zod"

import { AdminCreateProductVariantPrice, HttpTypes } from "@medusajs/types"
import {
  RouteDrawer,
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/modals"
import { KeyboundForm } from "../../../../../components/utilities/keybound-form"
import { useRegions } from "../../../../../hooks/api"
import { useCreateProductVariant } from "../../../../../hooks/api/products"
import { castNumber } from "../../../../../lib/cast-number"
import { partialFormValidation } from "../../../../../lib/validation"
import {
  CreateProductVariantSchema,
  CreateVariantDetailsFields,
  CreateVariantDetailsSchema,
  CreateVariantPriceFields,
  CreateVariantPriceSchema,
} from "./constants"
import DetailsTab from "./details-tab"
import InventoryKitTab from "./inventory-kit-tab"
import PricingTab from "./pricing-tab"

enum Tab {
  DETAIL = "detail",
  PRICE = "price",
  INVENTORY = "inventory",
}

type TabState = Record<Tab, ProgressStatus>

const initialTabState: TabState = {
  [Tab.DETAIL]: "in-progress",
  [Tab.PRICE]: "not-started",
  [Tab.INVENTORY]: "not-started",
}

type CreateProductVariantFormProps = {
  product: HttpTypes.AdminProduct
}

export const CreateProductVariantForm = ({
  product,
}: CreateProductVariantFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const [tab, setTab] = useState<Tab>(Tab.DETAIL)
  const [tabState, setTabState] = useState<TabState>(initialTabState)

  const form = useForm<z.infer<typeof CreateProductVariantSchema>>({
    defaultValues: {
      sku: "",
      title: "",
      manage_inventory: false,
      allow_backorder: false,
      inventory_kit: false,
      options: {},
    },
    resolver: zodResolver(CreateProductVariantSchema),
  })

  const { mutateAsync, isPending } = useCreateProductVariant(product.id)

  const { regions } = useRegions({ limit: 9999 })

  const regionsCurrencyMap = useMemo(() => {
    if (!regions?.length) {
      return {}
    }

    return regions.reduce((acc, reg) => {
      acc[reg.id] = reg.currency_code
      return acc
    }, {} as Record<string, string>)
  }, [regions])

  const isManageInventoryEnabled = useWatch({
    control: form.control,
    name: "manage_inventory",
  })

  const isInventoryKitEnabled = useWatch({
    control: form.control,
    name: "inventory_kit",
  })

  const inventoryField = useFieldArray({
    control: form.control,
    name: `inventory`,
  })

  const inventoryTabEnabled = isManageInventoryEnabled && isInventoryKitEnabled

  const tabOrder = useMemo(() => {
    if (inventoryTabEnabled) {
      return [Tab.DETAIL, Tab.PRICE, Tab.INVENTORY] as const
    }

    return [Tab.DETAIL, Tab.PRICE] as const
  }, [inventoryTabEnabled])

  useEffect(() => {
    if (isInventoryKitEnabled && inventoryField.fields.length === 0) {
      inventoryField.append({
        inventory_item_id: "",
        required_quantity: undefined,
      })
    }
  }, [isInventoryKitEnabled])

  const handleChangeTab = (update: Tab) => {
    if (tab === update) {
      return
    }

    if (tabOrder.indexOf(update) < tabOrder.indexOf(tab)) {
      const isCurrentTabDirty = false // isTabDirty(tab) TODO

      setTabState((prev) => ({
        ...prev,
        [tab]: isCurrentTabDirty ? prev[tab] : "not-started",
        [update]: "in-progress",
      }))

      setTab(update)
      return
    }

    // get the tabs from the current tab to the update tab including the current tab
    const tabs = tabOrder.slice(0, tabOrder.indexOf(update))

    // validate all the tabs from the current tab to the update tab if it fails on any of tabs then set that tab as current tab
    for (const tab of tabs) {
      if (tab === Tab.DETAIL) {
        if (
          !partialFormValidation<z.infer<typeof CreateProductVariantSchema>>(
            form,
            CreateVariantDetailsFields,
            CreateVariantDetailsSchema
          )
        ) {
          setTabState((prev) => ({
            ...prev,
            [tab]: "in-progress",
          }))
          setTab(tab)
          return
        }

        setTabState((prev) => ({
          ...prev,
          [tab]: "completed",
        }))
      } else if (tab === Tab.PRICE) {
        if (
          !partialFormValidation<z.infer<typeof CreateProductVariantSchema>>(
            form,
            CreateVariantPriceFields,
            CreateVariantPriceSchema
          )
        ) {
          setTabState((prev) => ({
            ...prev,
            [tab]: "in-progress",
          }))
          setTab(tab)

          return
        }

        setTabState((prev) => ({
          ...prev,
          [tab]: "completed",
        }))
      }
    }

    setTabState((prev) => ({
      ...prev,
      [tab]: "completed",
      [update]: "in-progress",
    }))
    setTab(update)
  }

  const handleNextTab = (tab: Tab) => {
    if (tabOrder.indexOf(tab) + 1 >= tabOrder.length) {
      return
    }

    const nextTab = tabOrder[tabOrder.indexOf(tab) + 1]
    handleChangeTab(nextTab)
  }

  const handleSubmit = form.handleSubmit(async (data) => {
    const { allow_backorder, manage_inventory, sku, title } = data

    await mutateAsync(
      {
        title,
        sku: sku || undefined,
        allow_backorder,
        manage_inventory,
        options: data.options,
        prices: Object.entries(data.prices ?? {})
          .map(([currencyOrRegion, value]) => {
            if (value === "" || value === undefined) {
              return undefined
            }

            const ret: AdminCreateProductVariantPrice = {}
            const amount = castNumber(value)

            if (currencyOrRegion.startsWith("reg_")) {
              ret.rules = { region_id: currencyOrRegion }
              ret.currency_code = regionsCurrencyMap[currencyOrRegion]
            } else {
              ret.currency_code = currencyOrRegion
            }

            ret.amount = amount

            return ret
          })
          .filter(Boolean),
        inventory_items: (data.inventory || [])
          .map((i) => {
            if (!i.required_quantity || !i.inventory_item_id) {
              return false
            }

            return {
              ...i,
              required_quantity: castNumber(i.required_quantity),
            }
          })
          .filter(Boolean),
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

  return (
    <RouteFocusModal.Form form={form}>
      <ProgressTabs
        value={tab}
        onValueChange={(tab) => handleChangeTab(tab as Tab)}
        className="flex h-full flex-col overflow-hidden"
      >
        <KeyboundForm
          onSubmit={handleSubmit}
          className="flex h-full flex-col overflow-hidden"
        >
          <RouteFocusModal.Header>
            <div className="flex w-full items-center justify-between gap-x-4">
              <div className="-my-2 w-full max-w-[600px] border-l">
                <ProgressTabs.List className="grid w-full grid-cols-3">
                  <ProgressTabs.Trigger
                    status={tabState.detail}
                    value={Tab.DETAIL}
                  >
                    {t("priceLists.create.tabs.details")}
                  </ProgressTabs.Trigger>
                  <ProgressTabs.Trigger
                    status={tabState.price}
                    value={Tab.PRICE}
                  >
                    {t("priceLists.create.tabs.prices")}
                  </ProgressTabs.Trigger>
                  {!!inventoryTabEnabled && (
                    <ProgressTabs.Trigger
                      status={tabState.inventory}
                      value={Tab.INVENTORY}
                    >
                      {t("products.create.tabs.inventory")}
                    </ProgressTabs.Trigger>
                  )}
                </ProgressTabs.List>
              </div>
            </div>
          </RouteFocusModal.Header>
          <RouteFocusModal.Body className="size-full overflow-hidden">
            <ProgressTabs.Content
              className="size-full overflow-y-auto"
              value={Tab.DETAIL}
            >
              <DetailsTab form={form} product={product} />
            </ProgressTabs.Content>
            <ProgressTabs.Content
              className="size-full overflow-y-auto"
              value={Tab.PRICE}
            >
              <PricingTab form={form} />
            </ProgressTabs.Content>
            {!!inventoryTabEnabled && (
              <ProgressTabs.Content
                className="size-full overflow-hidden"
                value={Tab.INVENTORY}
              >
                <InventoryKitTab form={form} />
              </ProgressTabs.Content>
            )}
          </RouteFocusModal.Body>
          <RouteFocusModal.Footer>
            <div className="flex items-center justify-end gap-x-2">
              <RouteDrawer.Close asChild>
                <Button variant="secondary" size="small">
                  {t("actions.cancel")}
                </Button>
              </RouteDrawer.Close>
              <PrimaryButton
                tab={tab}
                next={handleNextTab}
                isLoading={isPending}
                inventoryTabEnabled={!!inventoryTabEnabled}
              />
            </div>
          </RouteFocusModal.Footer>
        </KeyboundForm>
      </ProgressTabs>
    </RouteFocusModal.Form>
  )
}

type PrimaryButtonProps = {
  tab: Tab
  next: (tab: Tab) => void
  isLoading?: boolean
  inventoryTabEnabled: boolean
}

const PrimaryButton = ({
  tab,
  next,
  isLoading,
  inventoryTabEnabled,
}: PrimaryButtonProps) => {
  const { t } = useTranslation()

  if (
    (inventoryTabEnabled && tab === Tab.INVENTORY) ||
    (!inventoryTabEnabled && tab === Tab.PRICE)
  ) {
    return (
      <Button
        key="submit-button"
        type="submit"
        variant="primary"
        size="small"
        isLoading={isLoading}
      >
        {t("actions.save")}
      </Button>
    )
  }

  return (
    <Button
      key="next-button"
      type="button"
      variant="primary"
      size="small"
      onClick={() => next(tab)}
    >
      {t("actions.continue")}
    </Button>
  )
}
