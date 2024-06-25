import { zodResolver } from "@hookform/resolvers/zod"
import { Button, ProgressStatus, ProgressTabs } from "@medusajs/ui"
import { FieldPath, useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"

import { PriceListStatus, PriceListType } from "@medusajs/types"
import { useState } from "react"
import { z } from "zod"
import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/route-modal"
import { useCreatePriceList } from "../../../../../hooks/api/price-lists"
import { castNumber } from "../../../../../lib/cast-number"
import {
  CreatePriceListPrice,
  PricingVariantsRecord,
} from "../../../common/schemas"
import { PricingDetailsForm } from "./pricing-details-form"
import { PricingPricesForm } from "./pricing-prices-form"
import { PricingProductsForm } from "./pricing-products-form"
import {
  PricingCreateSchema,
  PricingCreateSchemaType,
  PricingDetailsFields,
  PricingDetailsSchema,
  PricingPricesFields,
  PricingProductsFields,
  PricingProductsSchema,
} from "./schema"

enum Tab {
  DETAIL = "detail",
  PRODUCT = "product",
  PRICE = "price",
}

const tabOrder = [Tab.DETAIL, Tab.PRODUCT, Tab.PRICE] as const

type TabState = Record<Tab, ProgressStatus>

const initialTabState: TabState = {
  [Tab.DETAIL]: "in-progress",
  [Tab.PRODUCT]: "not-started",
  [Tab.PRICE]: "not-started",
}

export const PricingCreateForm = () => {
  const [tab, setTab] = useState<Tab>(Tab.DETAIL)
  const [tabState, setTabState] = useState<TabState>(initialTabState)

  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<PricingCreateSchemaType>({
    defaultValues: {
      type: "sale",
      status: "active",
      title: "",
      description: "",
      starts_at: null,
      ends_at: null,
      customer_group_ids: [],
      product_ids: [],
      products: {},
    },
    resolver: zodResolver(PricingCreateSchema),
  })

  const { mutateAsync, isPending } = useCreatePriceList()

  const extractPricesFromVariants = (
    variantId: string,
    variant: PricingVariantsRecord
  ) => {
    const extractPriceDetails = (
      price: CreatePriceListPrice,
      priceType: "region" | "currency",
      id: string
    ) => ({
      amount: castNumber(price.amount!),
      ...(priceType === "region" ? { rules: { region_id: id } } : {}),
      currency_code: priceType === "currency" ? id : undefined,
      variant_id: variantId,
    })

    const currencyPrices = Object.entries(
      variant.currency_prices || {}
    ).flatMap(([currencyCode, currencyPrice]) => {
      return currencyPrice?.amount
        ? [extractPriceDetails(currencyPrice, "currency", currencyCode)]
        : []
    })

    const regionPrices = Object.entries(variant.region_prices || {}).flatMap(
      ([regionId, regionPrice]) => {
        return regionPrice?.amount
          ? [extractPriceDetails(regionPrice, "region", regionId)]
          : []
      }
    )

    return [...currencyPrices, ...regionPrices]
  }

  const handleSubmit = form.handleSubmit(async (data) => {
    const { customer_group_ids, products } = data

    const rules = customer_group_ids?.length
      ? { customer_group_id: customer_group_ids.map((cg) => cg.id) }
      : undefined

    const prices = Object.values(products).flatMap(({ variants }) =>
      Object.entries(variants).flatMap(([variantId, variant]) =>
        extractPricesFromVariants(variantId, variant)
      )
    )

    await mutateAsync(
      {
        title: data.title,
        type: data.type as PriceListType,
        status: data.status as PriceListStatus,
        description: data.description,
        starts_at: data.starts_at ? data.starts_at.toISOString() : null,
        ends_at: data.ends_at ? data.ends_at.toISOString() : null,
        rules,
        prices,
      },
      {
        onSuccess: ({ price_list }) => {
          handleSuccess(`../${price_list.id}`)
        },
      }
    )
  })

  const partialFormValidation = (
    fields: FieldPath<PricingCreateSchemaType>[],
    schema: z.ZodSchema<any>
  ) => {
    form.clearErrors(fields)

    const values = fields.reduce((acc, key) => {
      acc[key] = form.getValues(key)
      return acc
    }, {} as Record<string, unknown>)

    const validationResult = schema.safeParse(values)

    if (!validationResult.success) {
      validationResult.error.errors.forEach(({ path, message, code }) => {
        form.setError(path.join(".") as keyof PricingCreateSchemaType, {
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
      case Tab.DETAIL: {
        const fields = PricingDetailsFields

        return fields.some((field) => {
          return form.getFieldState(field).isDirty
        })
      }
      case Tab.PRODUCT: {
        const fields = PricingProductsFields

        return fields.some((field) => {
          return form.getFieldState(field).isDirty
        })
      }
      case Tab.PRICE: {
        const fields = PricingPricesFields

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
      if (tab === Tab.DETAIL) {
        if (
          !partialFormValidation(PricingDetailsFields, PricingDetailsSchema)
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
      } else if (tab === Tab.PRODUCT) {
        if (
          !partialFormValidation(PricingProductsFields, PricingProductsSchema)
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
                    status={tabState.detail}
                    value={Tab.DETAIL}
                  >
                    {t("priceLists.create.tabs.details")}
                  </ProgressTabs.Trigger>
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
            </div>
          </RouteFocusModal.Header>
          <RouteFocusModal.Body className="size-full overflow-hidden">
            <ProgressTabs.Content
              className="size-full overflow-y-auto"
              value={Tab.DETAIL}
            >
              <PricingDetailsForm form={form} />
            </ProgressTabs.Content>
            <ProgressTabs.Content
              className="size-full overflow-y-auto"
              value={Tab.PRODUCT}
            >
              <PricingProductsForm form={form} />
            </ProgressTabs.Content>
            <ProgressTabs.Content
              className="size-full overflow-hidden"
              value={Tab.PRICE}
            >
              <PricingPricesForm form={form} />
            </ProgressTabs.Content>
          </RouteFocusModal.Body>
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
