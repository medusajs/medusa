import { zodResolver } from "@hookform/resolvers/zod"
import { HttpTypes } from "@medusajs/types"
import { Button, ProgressStatus, ProgressTabs, toast } from "@medusajs/ui"
import { useState } from "react"
import { FieldPath, useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { z } from "zod"

import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/modals"
import { useBatchPriceListPrices } from "../../../../../hooks/api/price-lists"
import { exctractPricesFromProducts } from "../../../common/utils"
import { PriceListPricesAddPricesForm } from "./price-list-prices-add-prices-form"
import { PriceListPricesAddProductIdsForm } from "./price-list-prices-add-product-ids-form"
import {
  PriceListPricesAddProductIdsSchema,
  PriceListPricesAddProductsFields,
  PriceListPricesAddProductsIdsFields,
  PriceListPricesAddSchema,
} from "./schema"

type PriceListPricesAddFormProps = {
  priceList: HttpTypes.AdminPriceList
  currencies: HttpTypes.AdminStoreCurrency[]
  regions: HttpTypes.AdminRegion[]
  pricePreferences: HttpTypes.AdminPricePreference[]
}

enum Tab {
  PRODUCT = "product",
  PRICE = "price",
}

const tabOrder = [Tab.PRODUCT, Tab.PRICE] as const

type TabState = Record<Tab, ProgressStatus>

const initialTabState: TabState = {
  [Tab.PRODUCT]: "in-progress",
  [Tab.PRICE]: "not-started",
}

export const PriceListPricesAddForm = ({
  priceList,
  regions,
  currencies,
  pricePreferences,
}: PriceListPricesAddFormProps) => {
  const [tab, setTab] = useState<Tab>(Tab.PRODUCT)
  const [tabState, setTabState] = useState<TabState>(initialTabState)

  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<PriceListPricesAddSchema>({
    defaultValues: {
      products: {},
      product_ids: [],
    },
    resolver: zodResolver(PriceListPricesAddSchema),
  })

  const { mutateAsync, isPending } = useBatchPriceListPrices(priceList.id)

  const handleSubmit = form.handleSubmit(async (values) => {
    const { products } = values

    const prices = exctractPricesFromProducts(products, regions)

    await mutateAsync(
      {
        create: prices,
      },
      {
        onSuccess: () => {
          toast.success(t("priceLists.products.add.successToast"))
          handleSuccess()
        },
        onError: (e) => toast.error(e.message),
      }
    )
  })

  const partialFormValidation = (
    fields: FieldPath<PriceListPricesAddSchema>[],
    schema: z.ZodSchema<any>
  ) => {
    form.clearErrors(fields)

    const values = fields.reduce(
      (acc, key) => {
        acc[key] = form.getValues(key)
        return acc
      },
      {} as Record<string, unknown>
    )

    const validationResult = schema.safeParse(values)

    if (!validationResult.success) {
      validationResult.error.errors.forEach(({ path, message, code }) => {
        form.setError(path.join(".") as keyof PriceListPricesAddSchema, {
          type: code,
          message,
        })
      })

      return false
    }

    return true
  }

  const isTabDirty = (tab: Tab) => {
    switch (tab) {
      case Tab.PRODUCT: {
        const fields = PriceListPricesAddProductsIdsFields

        return fields.some((field) => {
          return form.getFieldState(field).isDirty
        })
      }
      case Tab.PRICE: {
        const fields = PriceListPricesAddProductsFields

        return fields.some((field) => {
          return form.getFieldState(field).isDirty
        })
      }
    }
  }

  const handleChangeTab = (update: Tab) => {
    if (tab === update) {
      return
    }

    if (tabOrder.indexOf(update) < tabOrder.indexOf(tab)) {
      const isCurrentTabDirty = isTabDirty(tab)

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
      if (tab === Tab.PRODUCT) {
        if (
          !partialFormValidation(
            PriceListPricesAddProductsIdsFields,
            PriceListPricesAddProductIdsSchema
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

  return (
    <RouteFocusModal.Form form={form}>
      <ProgressTabs
        value={tab}
        onValueChange={(tab) => handleChangeTab(tab as Tab)}
        className="flex h-full flex-col overflow-hidden"
      >
        <form onSubmit={handleSubmit} className="flex h-full flex-col">
          <RouteFocusModal.Header>
            <div className="flex w-full items-center justify-between gap-x-4">
              <div className="-my-2 w-full max-w-[600px] border-l">
                <ProgressTabs.List className="grid w-full grid-cols-3">
                  <ProgressTabs.Trigger
                    status={tabState.product}
                    value={Tab.PRODUCT}
                  >
                    {t("priceLists.create.tabs.products")}
                  </ProgressTabs.Trigger>
                  <ProgressTabs.Trigger
                    status={tabState.price}
                    value={Tab.PRICE}
                  >
                    {t("priceLists.create.tabs.prices")}
                  </ProgressTabs.Trigger>
                </ProgressTabs.List>
              </div>
            </div>
          </RouteFocusModal.Header>
          <RouteFocusModal.Body className="size-full overflow-hidden">
            <ProgressTabs.Content
              className="size-full overflow-y-auto"
              value={Tab.PRODUCT}
            >
              <PriceListPricesAddProductIdsForm
                form={form}
                priceList={priceList}
              />
            </ProgressTabs.Content>
            <ProgressTabs.Content
              className="size-full overflow-hidden"
              value={Tab.PRICE}
            >
              <PriceListPricesAddPricesForm
                form={form}
                regions={regions}
                currencies={currencies}
                pricePreferences={pricePreferences}
              />
            </ProgressTabs.Content>
          </RouteFocusModal.Body>
          <RouteFocusModal.Footer>
            <div className="flex items-center justify-end gap-x-2">
              <RouteFocusModal.Close asChild>
                <Button variant="secondary" size="small">
                  {t("actions.cancel")}
                </Button>
              </RouteFocusModal.Close>
              <PrimaryButton
                tab={tab}
                next={handleNextTab}
                isLoading={isPending}
              />
            </div>
          </RouteFocusModal.Footer>
        </form>
      </ProgressTabs>
    </RouteFocusModal.Form>
  )
}

type PrimaryButtonProps = {
  tab: Tab
  next: (tab: Tab) => void
  isLoading?: boolean
}

const PrimaryButton = ({ tab, next, isLoading }: PrimaryButtonProps) => {
  const { t } = useTranslation()

  if (tab === Tab.PRICE) {
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
