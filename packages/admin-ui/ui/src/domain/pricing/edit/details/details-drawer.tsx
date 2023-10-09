import { PriceList } from "@medusajs/medusa"
import { Button, Drawer, usePrompt } from "@medusajs/ui"
import { useAdminUpdatePriceList } from "medusa-react"
import * as React from "react"
import { useForm } from "react-hook-form"

import { useTranslation } from "react-i18next"
import { Form } from "../../../../components/helpers/form"
import useNotification from "../../../../hooks/use-notification"
import { useFeatureFlag } from "../../../../providers/feature-flag-provider"
import { getErrorMessage } from "../../../../utils/error-messages"
import { nestedForm } from "../../../../utils/nested-form"

import {
  PriceListDetailsForm,
  type PriceListDetailsSchema,
  type PriceListType,
} from "../../forms/price-list-details-form"

type PriceListDetailsDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  priceList: PriceList
}

type PriceListDetailsFormValues = {
  details: PriceListDetailsSchema
}

const PriceListDetailsDrawer = ({
  open,
  onOpenChange,
  priceList,
}: PriceListDetailsDrawerProps) => {
  const { mutateAsync, isLoading } = useAdminUpdatePriceList(priceList.id)
  const { t } = useTranslation()

  const form = useForm<PriceListDetailsFormValues>({
    defaultValues: getDefaultValues(priceList),
  })

  const { isFeatureEnabled } = useFeatureFlag()
  const isTaxInclPricesEnabled = isFeatureEnabled("tax_inclusive_pricing")

  const {
    reset,
    formState: { isDirty },
    handleSubmit,
  } = form

  React.useEffect(() => {
    if (open) {
      reset(getDefaultValues(priceList))
    }
  }, [priceList, open, reset])

  const prompt = usePrompt()
  const notification = useNotification()

  const onStateChange = React.useCallback(
    async (open: boolean) => {
      if (isDirty) {
        const response = await prompt({
          title: t("price-list-details-drawer-prompt-title", "Are you sure?"),
          description: t(
            "price-list-details-drawer-prompt-description",
            "You have unsaved changes, are you sure you want to exit?"
          ),
        })

        if (!response) {
          onOpenChange(true)
          return
        }
      }

      reset()
      onOpenChange(open)
    },
    [isDirty, t, reset, prompt, onOpenChange]
  )

  const onSubmit = handleSubmit(async (values) => {
    await mutateAsync(
      {
        type: values.details.type.value as PriceListType,
        name: values.details.general.name,
        description: values.details.general.description,
        starts_at: values.details.dates.starts_at ?? null,
        ends_at: values.details.dates.ends_at ?? null,
        includes_tax: isTaxInclPricesEnabled
          ? values.details.general.tax_inclusive
          : undefined,
        customer_groups: values.details.customer_groups.ids.map((id) => ({
          id,
        })),
      },
      {
        onSuccess: () => {
          notification(
            t(
              "price-list-details-notification-succes-title",
              "Price list updated"
            ),
            t(
              "price-list-details-drawer-notification-success-message",
              "Successfully updated price list"
            ),
            "success"
          )

          onOpenChange(false)
        },
        onError: (err) => {
          notification(
            t(
              "price-list-details-drawer-notification-error-title",
              "An error occurred"
            ),
            getErrorMessage(err),
            "error"
          )
        },
      }
    )
  })

  return (
    <Drawer open={open} onOpenChange={onStateChange}>
      <Form {...form}>
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title>
              {t("price-list-details-drawer-title", "Edit Price List Details")}
            </Drawer.Title>
          </Drawer.Header>
          <Drawer.Body className="overflow-y-auto">
            <PriceListDetailsForm
              form={nestedForm(form, "details")}
              layout="drawer"
              enableTaxToggle={isTaxInclPricesEnabled}
            />
          </Drawer.Body>
          <Drawer.Footer>
            <Drawer.Close asChild>
              <Button variant="secondary">
                {t("price-list-details-drawer-cancel-button", "Cancel")}
              </Button>
            </Drawer.Close>
            <Button onClick={onSubmit} isLoading={isLoading}>
              {t("price-list-details-drawer-save-button", "Save")}
            </Button>
          </Drawer.Footer>
        </Drawer.Content>
      </Form>
    </Drawer>
  )
}

const getDefaultValues = (priceList: PriceList): PriceListDetailsFormValues => {
  return {
    details: {
      type: {
        value: priceList.type,
      },
      general: {
        name: priceList.name,
        description: priceList.description,
        tax_inclusive: priceList.includes_tax,
      },
      customer_groups: {
        ids: priceList.customer_groups?.map((cg) => cg.id) ?? [],
      },
      dates: {
        starts_at: priceList.starts_at
          ? new Date(priceList.starts_at)
          : undefined,
        ends_at: priceList.ends_at ? new Date(priceList.ends_at) : undefined,
      },
    },
  }
}

export { PriceListDetailsDrawer as EditDetailsDrawer }
