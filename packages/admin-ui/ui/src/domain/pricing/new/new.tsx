import { zodResolver } from "@hookform/resolvers/zod"
import {
  Button,
  FocusModal,
  ProgressTabs,
  Text,
  usePrompt,
  type ProgressStatus,
} from "@medusajs/ui"
import * as React from "react"
import { useForm, useWatch } from "react-hook-form"
import * as z from "zod"

import { Product } from "@medusajs/medusa"
import { useAdminCreatePriceList } from "medusa-react"
import { Form } from "../../../components/helpers/form"
import useNotification from "../../../hooks/use-notification"
import { useFeatureFlag } from "../../../providers/feature-flag-provider"
import { getErrorMessage } from "../../../utils/error-messages"
import { nestedForm } from "../../../utils/nested-form"

import {
  PriceListDetailsForm,
  priceListDetailsSchema,
  PriceListStatus,
  PriceListType,
} from "../forms/price-list-details-form"

import {
  getDbSafeAmount,
  PriceListPricesForm,
  priceListPricesSchema,
  usePricesFormData,
  type PricePayload,
} from "../forms/price-list-prices-form"

import {
  PriceListProductPricesForm,
  priceListProductPricesSchema,
  type PriceListProductPricesSchema,
} from "../forms/price-list-product-prices-form"

import { ExclamationCircle, Spinner } from "@medusajs/icons"
import { useTranslation } from "react-i18next"
import {
  PriceListProductsForm,
  priceListProductsSchema,
} from "../forms/price-list-products-form"

enum Tab {
  DETAILS = "details",
  PRODUCTS = "products",
  PRICES = "prices",
  EDIT = "edit",
}

const priceListNewSchema = z.object({
  details: priceListDetailsSchema,
  products: priceListProductsSchema,
  prices: priceListPricesSchema,
})

type PriceListNewSchema = z.infer<typeof priceListNewSchema>

type StepStatus = {
  [key in Tab]: ProgressStatus
}

const PriceListNew = () => {
  const [open, setOpen] = React.useState(false)
  const [product, setProduct] = React.useState<Product | null>(null)

  const [selectedIds, setSelectedIds] = React.useState<string[]>([])

  const [tab, setTab] = React.useState<Tab>(Tab.DETAILS)
  const [status, setStatus] = React.useState<StepStatus>({
    [Tab.DETAILS]: "not-started",
    [Tab.PRODUCTS]: "not-started",
    [Tab.PRICES]: "not-started",
    [Tab.EDIT]: "not-started",
  })

  const { t } = useTranslation()

  const promptTitle = t("price-list-new-form-prompt-title", "Are you sure?")
  const promptExitDescription = t(
    "price-list-new-form-prompt-exit-description",
    "You have unsaved changes, are you sure you want to exit?"
  )
  const promptBackDescription = t(
    "price-list-new-form-prompt-back-description",
    "You have unsaved changes, are you sure you want to go back?"
  )

  const prompt = usePrompt()
  const notification = useNotification()

  const { isFeatureEnabled } = useFeatureFlag()
  const isTaxInclPricesEnabled = isFeatureEnabled("tax_inclusive_pricing")

  const form = useForm<PriceListNewSchema>({
    resolver: zodResolver(priceListNewSchema),
    defaultValues: {
      details: {
        type: {
          value: "sale",
        },
        general: {
          name: "",
          description: "",
          tax_inclusive: false,
        },
        customer_groups: {
          ids: [],
        },
        dates: {
          ends_at: null,
          starts_at: null,
        },
      },
      products: {
        ids: [],
      },
      prices: {
        products: {},
      },
    },
  })

  const {
    trigger,
    reset,
    getValues,
    setValue,
    setError,
    handleSubmit,
    formState: { isDirty },
  } = form

  const taxToggleState = useWatch({
    control: form.control,
    name: "details.general.tax_inclusive",
    defaultValue: false,
  })

  const {
    control: editControl,
    handleSubmit: handleEditSubmit,
    reset: resetEdit,
    formState: { isDirty: isEditDirty },
    setValue: setEditValue,
    getValues: getEditValues,
  } = useForm<PriceListProductPricesSchema>({
    resolver: zodResolver(priceListProductPricesSchema),
  })

  const { mutateAsync, isLoading: isSubmitting } = useAdminCreatePriceList()

  const { isLoading, isError, isNotFound, regions, currencies } =
    usePricesFormData({
      productIds: selectedIds,
      enable: {
        products: false,
      },
    })

  const onCloseModal = React.useCallback(() => {
    setOpen(false)
    setTab(Tab.DETAILS)
    setSelectedIds([])
    setStatus({
      [Tab.DETAILS]: "not-started",
      [Tab.PRODUCTS]: "not-started",
      [Tab.PRICES]: "not-started",
      [Tab.EDIT]: "not-started",
    })
    resetEdit()
    reset()
  }, [reset, resetEdit])

  const onModalStateChange = React.useCallback(
    async (open: boolean) => {
      if (!open && (isDirty || isEditDirty)) {
        const response = await prompt({
          title: promptTitle,
          description: promptExitDescription,
        })

        if (!response) {
          setOpen(true)
          return
        }

        onCloseModal()
      }

      setOpen(open)
    },
    [
      isDirty,
      isEditDirty,
      promptTitle,
      promptExitDescription,
      prompt,
      onCloseModal,
    ]
  )

  /**
   * On hitting "Save Prices" in the edit tab, we need
   * to update the corresponding product in the form.
   */
  const onSavePriceEdit = handleEditSubmit((data) => {
    if (!product) {
      return
    }

    setValue(`prices.products.${product.id}`, data, {
      shouldDirty: true,
      shouldTouch: true,
    })

    setProduct(null)
    resetEdit(undefined, {
      keepDirty: false,
      keepTouched: false,
    })
    setTab(Tab.PRICES)
  })

  const onSubmit = React.useCallback(
    async (status: PriceListStatus) => {
      await handleSubmit(async (data) => {
        const prices: PricePayload[] = []

        const productPriceKeys = Object.keys(data.prices.products)
        const productIds = data.products.ids

        if (!productPriceKeys.length || !data.prices.products) {
          setError("prices.products", {
            type: "manual",
            message: t(
              "price-list-new-form-no-prices-error",
              "Please set prices for at least one product."
            ) as string,
          })

          return
        }

        const missingProducts = productIds.filter(
          (id) => !productPriceKeys.includes(id)
        )

        if (missingProducts.length > 0) {
          const res = await prompt({
            title: t(
              "price-list-new-form-missing-prices-title",
              "Incomplete price list"
            ),
            description: t(
              "price-list-new-products-modal-missing-prices-description",
              "Prices have not been assigned to all of your chosen products. Would you like to proceed?"
            ),
          })

          if (!res) {
            return
          }
        }

        /**
         * Loop through all the products and variants
         * and create a payload for each price.
         *
         * If a price does not have an amount, we
         * skip it.
         */
        for (const productId of Object.keys(data.prices.products)) {
          const product = data.prices.products[productId]

          for (const variantId of Object.keys(product.variants)) {
            const variant = product.variants[variantId]

            if (variant.currency) {
              for (const currencyCode of Object.keys(variant.currency)) {
                const { amount } = variant.currency[currencyCode]

                if (!amount) {
                  continue
                }

                const dbSafeAmount = getDbSafeAmount(
                  currencyCode,
                  parseFloat(amount)
                )

                if (!dbSafeAmount) {
                  continue
                }

                const payload: PricePayload = {
                  amount: dbSafeAmount,
                  variant_id: variantId,
                  currency_code: currencyCode,
                }

                prices.push(payload)
              }
            }

            if (variant.region) {
              for (const regionId of Object.keys(variant.region)) {
                const { amount } = variant.region[regionId]

                if (!amount) {
                  continue
                }

                const dbSafeAmount = getDbSafeAmount(
                  regions.find((r) => r.id === regionId)!.currency_code,
                  parseFloat(amount)
                )

                if (!dbSafeAmount) {
                  continue
                }

                const payload: PricePayload = {
                  amount: dbSafeAmount,
                  variant_id: variantId,
                  region_id: regionId,
                }

                prices.push(payload)
              }
            }
          }
        }

        await mutateAsync(
          {
            name: data.details.general.name,
            description: data.details.general.description,
            type: data.details.type.value as PriceListType,
            includes_tax: isTaxInclPricesEnabled
              ? data.details.general.tax_inclusive
              : undefined,
            customer_groups: data.details.customer_groups.ids.map((id) => ({
              id,
            })),
            status: status,
            ends_at: data.details.dates.ends_at || undefined,
            starts_at: data.details.dates.starts_at || undefined,
            prices,
          },
          {
            onSuccess: () => {
              notification(
                t(
                  "price-list-new-form-notification-success-title",
                  "Price list created"
                ),
                t(
                  "price-list-new-form-notification-success-message",
                  `Successfully created price list`
                ),
                "success"
              )

              onCloseModal()
            },
            onError: (err) => {
              notification(
                t(
                  "price-list-new-form-notification-error-title",
                  "An error occurred"
                ),
                getErrorMessage(err),
                "error"
              )
            },
          }
        )
      })()
    },
    [
      handleSubmit,
      mutateAsync,
      notification,
      onCloseModal,
      setError,
      prompt,
      t,
      isTaxInclPricesEnabled,
      regions,
    ]
  )

  const onSetProduct = React.useCallback(
    (product: Product | null) => {
      if (!product) {
        setProduct(null)
        setTab(Tab.PRICES)
        return
      }

      const defaultValues = getValues(`prices.products.${product.id}`)
      resetEdit(defaultValues)
      setProduct(product)
      setTab(Tab.EDIT)
    },
    [resetEdit, getValues]
  )

  /**
   * When exiting the "Edit" tab, we need to check
   * if the user has unsaved changes. If they do,
   * we need to prompt them whether they want to
   * continue or not.
   */
  const onExitProductPrices = React.useCallback(
    async (tab = Tab.PRICES) => {
      if (isEditDirty) {
        const res = await prompt({
          title: promptTitle,
          description: promptBackDescription,
        })

        if (!res) {
          return
        }
      }

      setTab(tab)
      setProduct(null)
      resetEdit(undefined, {
        keepDirty: false,
        keepTouched: false,
      })
    },
    [prompt, resetEdit, isEditDirty, promptTitle, promptBackDescription]
  )

  /**
   * If the current tab is edit, we need to
   * check if the user wants to exit the edit
   * tab or if they want to save the changes
   * before continuing.
   */
  const onTabChange = React.useCallback(
    async (value: Tab) => {
      if (tab === Tab.EDIT) {
        await onExitProductPrices(value)
        return
      }

      setTab(value)
    },
    [tab, onExitProductPrices]
  )

  /**
   * Callback for ensuring that we don't submit prices
   * for products that the user has unselected.
   */
  const onUpdateSelectedProductIds = React.useCallback(
    (ids: string[]) => {
      setSelectedIds((prev) => {
        /**
         * If the previous ids are the same as the new ids,
         * we need to unregister the old ids that are no
         * longer selected.
         */
        for (const id of prev) {
          if (!ids.includes(id)) {
            setValue(`prices.products.${id}`, { variants: {} })
          }
        }

        return ids
      })
    },
    [setValue]
  )

  /**
   * Callback for validating the details form.
   */
  const onValidateDetails = React.useCallback(async () => {
    const result = await trigger("details")

    if (!result) {
      setStatus((prev) => ({
        ...prev,
        [Tab.DETAILS]: "in-progress",
      }))

      return
    }

    setTab(Tab.PRODUCTS)
    setStatus((prev) => ({
      ...prev,
      [Tab.DETAILS]: "completed",
    }))
  }, [trigger])

  /**
   * Callback for validating the products form.
   */
  const onValidateProducts = React.useCallback(async () => {
    const result = await trigger("products")

    if (!result) {
      setStatus((prev) => ({
        ...prev,
        [Tab.PRODUCTS]: "in-progress",
      }))

      return
    }

    const ids = getValues("products.ids")

    onUpdateSelectedProductIds(ids)

    setTab(Tab.PRICES)
    setStatus((prev) => ({
      ...prev,
      [Tab.PRODUCTS]: "completed",
    }))
  }, [trigger, getValues, onUpdateSelectedProductIds])

  /**
   * Depending on the current tab, the next button
   * will have different functionality.
   */
  const onNext = React.useCallback(async () => {
    switch (tab) {
      case Tab.DETAILS:
        await onValidateDetails()
        break
      case Tab.PRODUCTS:
        await onValidateProducts()
        break
      case Tab.PRICES:
        await onSubmit(PriceListStatus.ACTIVE)
        break
      case Tab.EDIT:
        await onSavePriceEdit()
        break
    }
  }, [onValidateDetails, onValidateProducts, onSubmit, onSavePriceEdit, tab])

  const nextButtonText = React.useMemo(() => {
    switch (tab) {
      case Tab.PRICES:
        return t(
          "price-list-new-form-next-button-save-and-publish",
          "Save and Publish"
        )
      case Tab.EDIT:
        return t("price-list-new-form-next-button-save", "Save Prices")
      default:
        return t("price-list-new-form-next-button-continue", "Continue")
    }
  }, [tab, t])

  /**
   * Depending on the current tab, the back button
   * will have different functionality.
   */
  const onBack = React.useCallback(async () => {
    switch (tab) {
      case Tab.DETAILS:
        await onModalStateChange(false)
        break
      case Tab.PRODUCTS:
        setTab(Tab.DETAILS)
        break
      case Tab.PRICES:
        setTab(Tab.PRODUCTS)
        break
      case Tab.EDIT:
        await onExitProductPrices()
        break
    }
  }, [onModalStateChange, onExitProductPrices, tab])

  const backButtonText = React.useMemo(() => {
    switch (tab) {
      case Tab.DETAILS:
        return t("price-list-new-form-back-button-cancel", "Cancel")
      default:
        return t("price-list-new-form-back-button-back", "Back")
    }
  }, [tab, t])

  return (
    <FocusModal open={open} onOpenChange={onModalStateChange}>
      <FocusModal.Trigger asChild>
        <Button variant="secondary">Create New</Button>
      </FocusModal.Trigger>
      <ProgressTabs
        value={tab}
        onValueChange={(tab) => onTabChange(tab as Tab)}
      >
        <FocusModal.Content>
          <FocusModal.Header className="flex w-full items-center justify-start">
            <ProgressTabs.List className="border-ui-border-base -my-2 ml-2 min-w-0 flex-1 border-l">
              <ProgressTabs.Trigger
                value={Tab.DETAILS}
                className="w-full min-w-0 max-w-[200px]"
                status={status[Tab.DETAILS]}
              >
                <span className="w-full overflow-hidden text-ellipsis whitespace-nowrap">
                  {t("price-list-new-form-details-tab", "Create Price List")}
                </span>
              </ProgressTabs.Trigger>
              <ProgressTabs.Trigger
                value={Tab.PRODUCTS}
                disabled={status[Tab.DETAILS] !== "completed"}
                className="w-full min-w-0  max-w-[200px]"
                status={status[Tab.PRODUCTS]}
              >
                <span className="w-full overflow-hidden text-ellipsis whitespace-nowrap">
                  {t("price-list-new-form-products-tab", "Choose Products")}
                </span>
              </ProgressTabs.Trigger>
              <ProgressTabs.Trigger
                value={Tab.PRICES}
                disabled={
                  status[Tab.DETAILS] !== "completed" ||
                  status[Tab.PRODUCTS] !== "completed"
                }
                className="w-full min-w-0 max-w-[200px]"
                status={status[Tab.PRICES]}
              >
                <span className="w-full overflow-hidden text-ellipsis whitespace-nowrap">
                  {t("price-list-new-form-prices-tab", "Edit Prices")}
                </span>
              </ProgressTabs.Trigger>
              {product && (
                <ProgressTabs.Trigger
                  value={Tab.EDIT}
                  disabled={isLoading || isError}
                  className="w-full min-w-0 max-w-[200px]"
                  status={isEditDirty ? "in-progress" : "not-started"}
                >
                  <span className="w-full overflow-hidden text-ellipsis whitespace-nowrap">
                    {product?.title}
                  </span>
                </ProgressTabs.Trigger>
              )}
            </ProgressTabs.List>
            <div className="ml-auto flex items-center justify-end gap-x-2">
              <Button
                variant="secondary"
                onClick={onBack}
                disabled={isSubmitting}
              >
                {backButtonText}
              </Button>
              {tab === Tab.PRICES && !isSubmitting && (
                <Button onClick={() => onSubmit(PriceListStatus.DRAFT)}>
                  {t("price-list-new-form-save-as-draft", "Save as Draft")}
                </Button>
              )}
              <Button type="button" onClick={onNext} isLoading={isSubmitting}>
                {nextButtonText}
              </Button>
            </div>
          </FocusModal.Header>
          {open && (
            <FocusModal.Body className="flex h-full w-full flex-col items-center overflow-y-auto">
              <Form {...form}>
                <ProgressTabs.Content
                  value={Tab.DETAILS}
                  className="h-full w-full max-w-[720px]"
                >
                  <div className="px-8 py-12">
                    <PriceListDetailsForm
                      form={nestedForm(form, "details")}
                      layout="focus"
                      enableTaxToggle={isTaxInclPricesEnabled}
                    />
                  </div>
                </ProgressTabs.Content>
                <ProgressTabs.Content
                  value={Tab.PRODUCTS}
                  className="h-full w-full"
                >
                  <PriceListProductsForm form={nestedForm(form, "products")} />
                </ProgressTabs.Content>

                <ProgressTabs.Content
                  value={Tab.PRICES}
                  className="h-full w-full"
                >
                  {isLoading ? (
                    <div className="flex h-full w-full items-center justify-center">
                      <Spinner className="text-ui-fg-subtle animate-spin" />
                    </div>
                  ) : isError || isNotFound ? (
                    <div className="flex h-full w-full items-center justify-center">
                      <div className="text-ui-fg-subtle flex items-center gap-x-2">
                        <ExclamationCircle />
                        <Text>
                          {t(
                            "price-list-new-form-error-loading-products",
                            "An error occurred while preparing the form. Reload the page and try again. If the issue persists, try again later."
                          )}
                        </Text>
                      </div>
                    </div>
                  ) : (
                    <PriceListPricesForm
                      setProduct={onSetProduct}
                      form={nestedForm(form, "prices")}
                      productIds={selectedIds}
                    />
                  )}
                </ProgressTabs.Content>
                {product && (
                  <ProgressTabs.Content
                    value={Tab.EDIT}
                    className="h-full w-full"
                  >
                    {isLoading ? (
                      <div className="flex h-full w-full items-center justify-center">
                        <Spinner className="text-ui-fg-subtle animate-spin" />
                      </div>
                    ) : isError || isNotFound ? (
                      <div className="flex h-full w-full items-center justify-center">
                        <div className="text-ui-fg-subtle flex items-center gap-x-2">
                          <ExclamationCircle />
                          <Text>
                            {t(
                              "price-list-new-form-error-loading-products",
                              "An error occurred while preparing the form. Reload the page and try again. If the issue persists, try again later."
                            )}
                          </Text>
                        </div>
                      </div>
                    ) : (
                      <PriceListProductPricesForm
                        priceListTaxInclusive={taxToggleState}
                        taxInclEnabled={isTaxInclPricesEnabled}
                        product={product}
                        currencies={currencies}
                        regions={regions}
                        control={editControl}
                        getValues={getEditValues}
                        setValue={setEditValue}
                      />
                    )}
                  </ProgressTabs.Content>
                )}
              </Form>
            </FocusModal.Body>
          )}
        </FocusModal.Content>
      </ProgressTabs>
    </FocusModal>
  )
}

export { PriceListNew }
