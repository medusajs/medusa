import { ExclamationCircle, Spinner } from "@medusajs/icons"
import type { PriceList, Product } from "@medusajs/medusa"
import { Button, FocusModal, ProgressTabs, Text, usePrompt } from "@medusajs/ui"
import {
  useAdminDeletePriceListPrices,
  useAdminUpdatePriceList,
} from "medusa-react"
import * as React from "react"
import { useForm } from "react-hook-form"

import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslation } from "react-i18next"
import { Form } from "../../../../components/helpers/form"
import useNotification from "../../../../hooks/use-notification"
import { useFeatureFlag } from "../../../../providers/feature-flag-provider"
import { getErrorMessage } from "../../../../utils/error-messages"
import { nestedForm } from "../../../../utils/nested-form"
import {
  PriceListPricesForm,
  getDbSafeAmount,
  getDefaultAmount,
  priceListPricesSchema,
  usePricesFormData,
  type PriceListPricesSchema,
  type PricePayload,
} from "../../forms/price-list-prices-form"
import {
  PriceListProductPricesForm,
  priceListProductPricesSchema,
  type PriceListProductPricesSchema,
} from "../../forms/price-list-product-prices-form"

type EditPricesModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  priceList: PriceList
  productIds: string[]
}

enum Tab {
  PRICES = "prices",
  EDIT = "edit",
}

const EditPricesModal = ({
  open,
  onOpenChange,
  priceList,
  productIds,
}: EditPricesModalProps) => {
  const [tab, setTab] = React.useState<Tab>(Tab.PRICES)
  const [product, setProduct] = React.useState<Product | null>(null)

  const originalPrices = React.useRef<PriceListPricesSchema | null>(null)

  const { t } = useTranslation()

  const promptTitle = t(
    "price-list-edit-prices-modal-prompt-title",
    "Are you sure?"
  )
  const promptExitDescription = t(
    "price-list-edit-prices-modal-prompt-exit-description",
    "You have unsaved changes, are you sure you want to exit?"
  )
  const promptBackDescription = t(
    "price-list-edit-prices-modal-prompt-back-description",
    "You have unsaved changes, are you sure you want to go back?"
  )

  const prompt = usePrompt()
  const notification = useNotification()

  const { isFeatureEnabled } = useFeatureFlag()
  const isTaxInclPricesEnabled = isFeatureEnabled("tax_inclusive_pricing")

  const pricesForm = useForm<PriceListPricesSchema>({
    resolver: zodResolver(priceListPricesSchema),
  })

  const {
    handleSubmit: handlePricesSubmit,
    reset: resetPrices,
    formState: { isDirty: isPricesDirty },
    getValues,
    setValue,
  } = pricesForm

  const {
    control: productControl,
    handleSubmit: handleProductSubmit,
    reset: resetProduct,
    formState: { isDirty: isProductDirty },
    setValue: setProductValue,
    getValues: getProductValues,
  } = useForm<PriceListProductPricesSchema>({
    resolver: zodResolver(priceListProductPricesSchema),
  })

  const { isLoading, isError, isNotFound, regions, currencies, products } =
    usePricesFormData({
      productIds,
      priceList,
    })

  const { mutateAsync: updateAsync, isLoading: isSubmitting } =
    useAdminUpdatePriceList(priceList.id)

  const { mutateAsync: deleteAsync, isLoading: isDeleting } =
    useAdminDeletePriceListPrices(priceList.id)

  const onCloseModal = React.useCallback(() => {
    onOpenChange(false)
    setTab(Tab.PRICES)

    originalPrices.current = null
    resetProduct()
    resetPrices()
  }, [onOpenChange, resetPrices, resetProduct])

  const onModalStateChange = React.useCallback(
    async (open: boolean) => {
      if (open) {
        onOpenChange(open)
        return
      }

      if (isPricesDirty || isProductDirty) {
        const res = await prompt({
          title: promptTitle,
          description: promptExitDescription,
        })

        if (!res) {
          return
        }
      }

      onCloseModal()
    },
    [
      onCloseModal,
      prompt,
      onOpenChange,
      isPricesDirty,
      isProductDirty,
      promptExitDescription,
      promptTitle,
    ]
  )

  /**
   * Register default values for the price list prices form.
   */
  React.useEffect(() => {
    if (isLoading || isError || isNotFound || !open) {
      return
    }

    const productData: PriceListPricesSchema = {
      products: {},
    }

    for (const product of products) {
      const productPrices: PriceListProductPricesSchema = {
        variants: {},
      }

      for (const variant of product.variants) {
        productPrices.variants[variant.id!] = {
          currency: {},
          region: {},
        }

        for (const region of regions) {
          const existingPrice = priceList.prices.find(
            (p) => p.variant_id === variant.id && p.region_id === region.id
          )

          const amount = existingPrice
            ? getDefaultAmount(region.currency_code, existingPrice.amount)
            : null

          productPrices.variants[variant.id!].region![region.id] = {
            id: existingPrice ? existingPrice.id : "",
            amount: amount ? `${amount}` : "",
          }
        }

        for (const currency of currencies) {
          const existingPrice = priceList.prices.find(
            (p) =>
              p.variant_id === variant.id &&
              p.currency_code === currency.code &&
              p.region_id === null
          )

          const amount = existingPrice
            ? getDefaultAmount(currency.code, existingPrice.amount)
            : null

          productPrices.variants[variant.id!].currency![currency.code] = {
            id: existingPrice ? existingPrice.id : "",
            amount: amount ? `${amount}` : "",
          }
        }
      }

      productData.products[product.id!] = productPrices
    }

    originalPrices.current = productData
    resetPrices(productData)
  }, [
    isLoading,
    isError,
    isNotFound,
    products,
    regions,
    currencies,
    priceList,
    resetPrices,
    open,
  ])

  const onSetProduct = React.useCallback(
    (product: Product | null) => {
      if (!product) {
        setProduct(null)
        setTab(Tab.PRICES)
        return
      }

      const defaultValues = getValues(`products.${product.id}`)
      resetProduct(defaultValues)
      setProduct(product)
      setTab(Tab.EDIT)
    },
    [resetProduct, getValues]
  )

  /**
   * When exiting the "Edit" tab, we need to check
   * if the user has unsaved changes. If they do,
   * we need to prompt them whether they want to
   * continue or not.
   */
  const onExitProductPrices = React.useCallback(
    async (tab = Tab.PRICES) => {
      if (isProductDirty) {
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
      resetProduct(undefined, {
        keepDirty: false,
        keepTouched: false,
      })
    },
    [isProductDirty, prompt, promptBackDescription, promptTitle, resetProduct]
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
    [onExitProductPrices, tab]
  )

  const onSavePriceEdit = handleProductSubmit((data) => {
    if (!product) {
      return
    }

    setValue(`products.${product.id}`, data, {
      shouldDirty: true,
      shouldTouch: true,
    })

    setProduct(null)
    resetProduct(undefined, {
      keepDirty: false,
      keepTouched: false,
    })
    setTab(Tab.PRICES)
  })

  const onSubmit = handlePricesSubmit(async (data) => {
    const update: PricePayload[] = []
    const removed: string[] = []

    for (const productId of Object.keys(data.products)) {
      const product = data.products[productId]

      for (const variantId of Object.keys(product.variants)) {
        const variant = product.variants[variantId]

        if (variant.currency) {
          for (const currencyCode of Object.keys(variant.currency)) {
            const { id, amount } = variant.currency[currencyCode]

            if (!amount) {
              if (id) {
                removed.push(id)
              }

              continue
            }

            if (!currencyCode) {
              continue
            }

            const dbSafeAmount = getDbSafeAmount(
              currencyCode,
              parseFloat(amount)
            )

            if (!dbSafeAmount) {
              continue
            }

            const originalPrice =
              originalPrices.current?.products[productId]?.variants[variantId]
                .currency?.[currencyCode]

            if (originalPrice && originalPrice.id && originalPrice.amount) {
              const originalDbSafeAmount = getDbSafeAmount(
                currencyCode,
                parseFloat(originalPrice.amount)
              )

              /**
               * If the price is the same as the original price,
               * we don't want to update it.
               */
              if (originalDbSafeAmount === dbSafeAmount) {
                continue
              }
            }

            const payload: PricePayload = {
              id: id ? id : undefined,
              amount: dbSafeAmount,
              variant_id: variantId,
              currency_code: currencyCode,
            }

            update.push(payload)
          }
        }

        if (variant.region) {
          for (const regionId of Object.keys(variant.region)) {
            const { id, amount } = variant.region[regionId]

            if (!amount) {
              if (id) {
                removed.push(id)
              }

              continue
            }

            if (!regionId) {
              continue
            }

            const currencyCode = regions.find(
              (r) => r.id === regionId
            )!.currency_code

            const dbSafeAmount = getDbSafeAmount(
              currencyCode,
              parseFloat(amount)
            )

            if (!dbSafeAmount) {
              continue
            }

            const originalPrice =
              originalPrices.current?.products[productId]?.variants[variantId]
                .region?.[regionId]

            if (originalPrice && originalPrice.id && originalPrice.amount) {
              const originalDbSafeAmount = getDbSafeAmount(
                currencyCode,
                parseFloat(originalPrice.amount)
              )

              /**
               * If the price is the same as the original price,
               * we don't want to update it.
               */
              if (originalDbSafeAmount === dbSafeAmount) {
                continue
              }
            }

            const payload: PricePayload = {
              id: id ? id : undefined,
              amount: dbSafeAmount,
              variant_id: variantId,
              region_id: regionId,
            }

            update.push(payload)
          }
        }
      }
    }

    let updateSuccess = false

    await updateAsync(
      {
        prices: update,
      },
      {
        onSuccess: () => {
          updateSuccess = true
        },
        onError: (err) => {
          notification(
            t(
              "price-list-edit-prices-modal-notification-update-error",
              "An error occurred"
            ),
            getErrorMessage(err),
            "error"
          )
        },
      }
    )

    /**
     * If the first update failed, we don't want to
     * continue with the delete request.
     */
    if (!updateSuccess) {
      return
    }

    let removeSuccess = true

    if (removed.length > 0) {
      await deleteAsync(
        {
          price_ids: removed,
        },
        {
          onSuccess: () => {
            removeSuccess = true
          },
          onError: () => {
            removeSuccess = false
          },
        }
      )
    }

    /**
     * If the delete request failed, we want to
     * notify the user that some prices were not
     * updated correctly.
     */
    if (!removeSuccess) {
      notification(
        t(
          "price-list-edit-prices-modal-notification-remove-error-title",
          "An error occurred"
        ),
        t(
          "price-list-edit-prices-modal-notification-remove-error-description",
          "Some prices were not updated correctly. Try again."
        ),
        "warning"
      )
    } else {
      notification(
        t(
          "price-list-edit-prices-modal-notification-update-success-title",
          "Prices updated"
        ),
        t(
          "price-list-edit-prices-modal-notification-update-success-description",
          "Successfully updated prices"
        ),
        "success"
      )
    }

    onCloseModal()
  })

  /**
   * Depending on the current tab, the next button
   * will have different functionality.
   */
  const onNext = React.useCallback(async () => {
    switch (tab) {
      case Tab.PRICES:
        await onSubmit()
        break
      case Tab.EDIT:
        await onSavePriceEdit()
        break
    }
  }, [onSubmit, onSavePriceEdit, tab])

  const nextButtonText = React.useMemo(() => {
    switch (tab) {
      case Tab.PRICES:
        return t(
          "price-list-edit-prices-modal-next-button-save-and-close",
          "Save and Close"
        )
      case Tab.EDIT:
        return t("price-list-edit-prices-modal-next-button-save", "Save Prices")
    }
  }, [tab, t])

  /**
   * Depending on the current tab, the back button
   * will have different functionality.
   */
  const onBack = React.useCallback(async () => {
    switch (tab) {
      case Tab.PRICES:
        onModalStateChange(false)
        break
      case Tab.EDIT:
        await onExitProductPrices()
        break
    }
  }, [onModalStateChange, onExitProductPrices, tab])

  const backButtonText = React.useMemo(() => {
    switch (tab) {
      case Tab.PRICES:
        return t("price-list-edit-prices-modal-back-button-cancel", "Cancel")
      default:
        return t("price-list-edit-prices-modal-back-button-back", "Back")
    }
  }, [tab, t])

  return (
    <FocusModal open={open} onOpenChange={onModalStateChange}>
      <ProgressTabs
        value={tab}
        onValueChange={(tab) => onTabChange(tab as Tab)}
      >
        <FocusModal.Content>
          <FocusModal.Header className="flex w-full items-center justify-start">
            <ProgressTabs.List className="border-ui-border-base -my-2 ml-2 min-w-0 flex-1 border-l">
              <ProgressTabs.Trigger
                value={Tab.PRICES}
                disabled={isLoading || isError}
                className="w-full max-w-[200px]"
                status={isPricesDirty ? "in-progress" : "not-started"}
              >
                <span className="w-full overflow-hidden text-ellipsis whitespace-nowrap">
                  {t(
                    "price-list-edit-prices-modal-overview-tab",
                    "Edit Prices"
                  )}
                </span>
              </ProgressTabs.Trigger>
              {product && (
                <ProgressTabs.Trigger
                  value={Tab.EDIT}
                  disabled={isLoading || isError}
                  className="w-full max-w-[200px]"
                  status={isProductDirty ? "in-progress" : "not-started"}
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
                disabled={isSubmitting || isDeleting}
              >
                {backButtonText}
              </Button>
              <Button
                onClick={onNext}
                className="whitespace-nowrap"
                isLoading={isSubmitting || isDeleting}
              >
                {nextButtonText}
              </Button>
            </div>
          </FocusModal.Header>
          <FocusModal.Body className="h-full w-full overflow-y-auto">
            <Form {...pricesForm}>
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
                        "price-list-edit-prices-modal-error-loading",
                        "An error occurred while preparing the form. Reload the page and try again. If the issue persists, try again later."
                      )}
                    </Text>
                  </div>
                </div>
              ) : (
                <React.Fragment>
                  <ProgressTabs.Content
                    value={Tab.PRICES}
                    className="h-full w-full"
                  >
                    <PriceListPricesForm
                      setProduct={onSetProduct}
                      form={nestedForm(pricesForm)}
                      priceListId={priceList.id}
                      productIds={productIds}
                    />
                  </ProgressTabs.Content>
                  {product && (
                    <ProgressTabs.Content
                      value={Tab.EDIT}
                      className="h-full w-full"
                    >
                      <PriceListProductPricesForm
                        product={product}
                        currencies={currencies}
                        regions={regions}
                        control={productControl}
                        taxInclEnabled={isTaxInclPricesEnabled}
                        priceListTaxInclusive={priceList.includes_tax}
                        getValues={getProductValues}
                        setValue={setProductValue}
                      />
                    </ProgressTabs.Content>
                  )}
                </React.Fragment>
              )}
            </Form>
          </FocusModal.Body>
        </FocusModal.Content>
      </ProgressTabs>
    </FocusModal>
  )
}

export { EditPricesModal }
