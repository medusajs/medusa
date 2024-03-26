import { zodResolver } from "@hookform/resolvers/zod"
import { Customer, Region } from "@medusajs/medusa"
import { Button, ProgressTabs } from "@medusajs/ui"
import { useAdminCreateDraftOrder } from "medusa-react"
import { useCallback, useMemo, useState } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useSearchParams } from "react-router-dom"
import { z } from "zod"

import { SplitView } from "../../../../../components/layout/split-view"
import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/route-modal"
import { getDbAmount } from "../../../../../lib/money-amount-helpers"

import { PricedVariant } from "@medusajs/medusa/dist/types/pricing"
import { castNumber } from "../../../../../lib/cast-number"
import { CreateDraftOrderSchema, View } from "./constants"
import { CreateDraftOrderContext } from "./context"
import { CreateDraftOrderDetails } from "./create-draft-order-details"
import { CreateDraftOrderDrawer } from "./create-draft-order-drawer"
import { CreateDraftOrderSummary } from "./create-draft-order-summary"
import { CustomItem, ExistingItem } from "./types"

enum Tab {
  DETAILS = "details",
  SUMMARY = "summary",
}

export const CreateDraftOrderForm = () => {
  const [open, setOpen] = useState(false)

  const [view, setView] = useState<View | null>(null)
  const [tab, setTab] = useState<Tab>(Tab.DETAILS)
  const [detailsValidated, setDetailsValidated] = useState(false)

  const [region, setRegion] = useState<Region | null>(null)
  const [customer, setCustomer] = useState<Customer | null>(null)

  const [sameAsShipping, setSameAsShipping] = useState(true)

  const { t } = useTranslation()
  const [, setSearchParams] = useSearchParams()
  const { handleSuccess } = useRouteModal()

  const form = useForm<z.infer<typeof CreateDraftOrderSchema>>({
    defaultValues: {
      email: "",
      region_id: "",
      shipping_method: {
        amount: "",
        custom_amount: "",
        option_id: "",
        option_title: "",
      },
      shipping_address: {
        address_1: "",
        address_2: "",
        city: "",
        company: "",
        country_code: "",
        first_name: "",
        last_name: "",
        phone: "",
        postal_code: "",
        province: "",
      },
      billing_address: null,
      existing_items: [],
      custom_items: [],
      customer_id: "",
      notification_order: true,
    },
    resolver: zodResolver(CreateDraftOrderSchema),
  })

  const {
    clearErrors,
    formState: { isDirty },
  } = form

  const {
    append: createCustomItem,
    remove: deleteCustomItem,
    fields: customItems,
  } = useFieldArray({
    control: form.control,
    name: "custom_items",
    keyName: "ci_id",
  })

  const {
    append: createExistingItem,
    remove: deleteExistingItem,
    update: updateExistingItem,
    fields: existingItems,
  } = useFieldArray({
    control: form.control,
    name: "existing_items",
    keyName: "ei_id",
  })

  const { mutateAsync, isLoading } = useAdminCreateDraftOrder()

  const handleSubmit = form.handleSubmit(async (values) => {
    let {
      shipping_address,
      billing_address,
      existing_items,
      custom_items,
      shipping_method,
      email,
      notification_order,
      ...rest
    } = values

    const emailValue = email || customer?.email

    if (!emailValue) {
      form.setError("email", {
        type: "manual",
        message: "Email is required",
      })

      form.setError("customer_id", {
        type: "manual",
        message: "Customer is required",
      })

      return
    }

    if (!billing_address) {
      billing_address = shipping_address
    }

    const preparedExistingItems =
      existing_items?.map((item) => {
        const { custom_unit_price, variant_id, quantity } = item

        const customUnitPriceCast = Number(custom_unit_price)
        const customUnitPriceValue = !isNaN(customUnitPriceCast)
          ? getDbAmount(customUnitPriceCast, region?.currency_code!)
          : undefined

        return {
          variant_id,
          quantity,
          unit_price: customUnitPriceValue,
        }
      }) || []

    const preparedCustomItems =
      custom_items?.map((item) => {
        const { unit_price, quantity, title } = item

        const unitPriceCast = castNumber(unit_price)
        const unitPriceValue = !isNaN(unitPriceCast)
          ? getDbAmount(unitPriceCast, region?.currency_code!)
          : undefined

        return {
          title,
          quantity,
          unit_price: unitPriceValue,
        }
      }) || []

    const items = [...preparedExistingItems, ...preparedCustomItems]

    const preparedShippingMethods = [
      {
        option_id: shipping_method.option_id,
        price: shipping_method.custom_amount
          ? getDbAmount(
              castNumber(shipping_method.custom_amount),
              region?.currency_code!
            )
          : undefined,
      },
    ]

    await mutateAsync(
      {
        ...rest,
        email: emailValue,
        shipping_address,
        billing_address,
        items: items,
        shipping_methods: preparedShippingMethods,
        no_notification_order: !notification_order,
      },
      {
        onSuccess: ({ draft_order }) => {
          handleSuccess(`../${draft_order.id}`)
        },
      }
    )
  })

  const clearItemErrors = useCallback(() => {
    clearErrors("custom_items")
    clearErrors("existing_items")
  }, [clearErrors])

  const handleUpdateExistingItems = useCallback(
    (items: ExistingItem[]) => {
      handleUpdateEntities(
        items,
        existingItems,
        deleteExistingItem,
        createExistingItem,
        "variant_id"
      )

      setView(null)
      setOpen(false)
      clearItemErrors()
    },
    [createExistingItem, deleteExistingItem, existingItems, clearItemErrors]
  )

  const handleCreateCustomItem = useCallback(
    (item: CustomItem) => {
      createCustomItem(item)

      setView(null)
      setOpen(false)
      clearItemErrors()
    },
    [createCustomItem, clearItemErrors]
  )

  const handleOpenDrawer = (view: View) => {
    setView(view)
    setOpen(true)
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setView(null)
      setSearchParams(
        {},
        {
          replace: true,
        }
      )
    }

    setOpen(open)
  }

  const handleContinue = form.handleSubmit(() => {
    setTab(Tab.SUMMARY)
    setDetailsValidated(true)
  })

  const handleRebaseUnitPrices = useCallback(
    (variants: PricedVariant[]) => {
      if (!variants.length) {
        return
      }

      for (const variant of variants) {
        const index = existingItems.findIndex(
          (item) => item.variant_id === variant.id
        )

        if (index === -1) {
          continue
        }

        updateExistingItem(index, {
          ...existingItems[index],
          unit_price: variant.original_price!,
        })
      }
    },
    [updateExistingItem, existingItems]
  )

  const handleTabChange = (tab: Tab) => {
    switch (tab) {
      case Tab.DETAILS:
        setDetailsValidated(false)
        setTab(tab)
        break
      case Tab.SUMMARY:
        handleContinue()
        break
    }
  }

  const detailsProgress = useMemo(() => {
    if (detailsValidated) {
      return "completed"
    }

    if (isDirty) {
      return "in-progress"
    }

    return "not-started"
  }, [detailsValidated, isDirty])

  return (
    <CreateDraftOrderContext.Provider
      value={useMemo(
        () => ({
          custom: {
            items: customItems,
            remove: deleteCustomItem,
            update: handleCreateCustomItem,
          },
          variants: {
            items: existingItems,
            remove: deleteExistingItem,
            update: handleUpdateExistingItems,
            rebase: handleRebaseUnitPrices,
          },
          form,
          region,
          setRegion,
          customer,
          setCustomer,
          sameAsShipping,
          setSameAsShipping,
          onOpenDrawer: handleOpenDrawer,
        }),
        [
          customItems,
          deleteCustomItem,
          handleCreateCustomItem,
          existingItems,
          deleteExistingItem,
          handleUpdateExistingItems,
          handleRebaseUnitPrices,
          form,
          customer,
          region,
          sameAsShipping,
        ]
      )}
    >
      <RouteFocusModal.Form form={form}>
        <form
          className="flex h-full flex-col overflow-hidden"
          onSubmit={handleSubmit}
        >
          <ProgressTabs
            value={tab}
            onValueChange={(tab) => handleTabChange(tab as Tab)}
            className="flex h-full flex-col overflow-hidden"
          >
            <RouteFocusModal.Header>
              <div className="flex w-full items-center justify-between gap-x-4">
                <div className="-my-2 w-full max-w-[400px] border-l">
                  <ProgressTabs.List className="grid w-full grid-cols-2">
                    <ProgressTabs.Trigger
                      className="w-full"
                      value={Tab.DETAILS}
                      status={detailsProgress}
                    >
                      {t("fields.details")}
                    </ProgressTabs.Trigger>
                    <ProgressTabs.Trigger
                      className="w-full"
                      value={Tab.SUMMARY}
                    >
                      {t("fields.summary")}
                    </ProgressTabs.Trigger>
                  </ProgressTabs.List>
                </div>
                <div className="flex items-center gap-x-2">
                  <RouteFocusModal.Close asChild>
                    <Button variant="secondary" size="small">
                      {t("actions.cancel")}
                    </Button>
                  </RouteFocusModal.Close>
                  {tab === Tab.SUMMARY ? (
                    <Button
                      key="save-btn"
                      type="submit"
                      size="small"
                      isLoading={isLoading}
                    >
                      {t("actions.save")}
                    </Button>
                  ) : (
                    <Button
                      key="continue-btn"
                      type="button"
                      onClick={handleContinue}
                      size="small"
                    >
                      {t("actions.continue")}
                    </Button>
                  )}
                </div>
              </div>
            </RouteFocusModal.Header>
            <RouteFocusModal.Body className="size-full overflow-hidden">
              <ProgressTabs.Content
                value={Tab.DETAILS}
                className="size-full overflow-hidden"
              >
                <SplitView open={open} onOpenChange={handleOpenChange}>
                  <SplitView.Content>
                    <CreateDraftOrderDetails />
                  </SplitView.Content>
                  <SplitView.Drawer>
                    <CreateDraftOrderDrawer view={view} />
                  </SplitView.Drawer>
                </SplitView>
              </ProgressTabs.Content>
              <ProgressTabs.Content
                value={Tab.SUMMARY}
                className="flex h-full w-full flex-col items-center overflow-hidden"
              >
                <CreateDraftOrderSummary />
              </ProgressTabs.Content>
            </RouteFocusModal.Body>
          </ProgressTabs>
        </form>
      </RouteFocusModal.Form>
    </CreateDraftOrderContext.Provider>
  )
}

const handleUpdateEntities = <T,>(
  newEntities: T[],
  existingEntities: T[],
  deleteEntity: (indices: number[]) => void,
  createEntity: (entities: T[]) => void,
  entityIdKey: keyof T
) => {
  const newEntitiesIdMap = newEntities.map((e) => e[entityIdKey])
  const existingEntitiesIdMap = existingEntities.map((e) => e[entityIdKey])

  const indicesToDelete = existingEntities.reduce((acc, e, i) => {
    if (!newEntitiesIdMap.includes(e[entityIdKey])) {
      acc.push(i)
    }
    return acc
  }, [] as number[])

  const entitiesToAdd = newEntities.filter(
    (e) => !existingEntitiesIdMap.includes(e[entityIdKey])
  )

  deleteEntity(indicesToDelete)
  createEntity(entitiesToAdd)
}
