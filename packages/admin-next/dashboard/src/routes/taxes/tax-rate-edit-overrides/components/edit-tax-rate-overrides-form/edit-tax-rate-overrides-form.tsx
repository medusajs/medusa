import { TaxRate } from "@medusajs/medusa"
import { Button, Heading, Switch, Text, clx } from "@medusajs/ui"
import * as Collapsible from "@radix-ui/react-collapsible"
import { useAdminUpdateTaxRate } from "medusa-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"

import { SplitView } from "../../../../../components/layout/split-view"
import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/route-modal"

type EditTaxRateOverridesFormProps = {
  taxRate: TaxRate
}

export const EditTaxRateOverridesForm = ({
  taxRate,
}: EditTaxRateOverridesFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const [open, setOpen] = useState(false)

  const form = useForm()

  const { mutateAsync, isLoading } = useAdminUpdateTaxRate(taxRate.id)
  const handleSubmit = form.handleSubmit(async (data) => {
    await mutateAsync(data, {
      onSuccess: () => {
        handleSuccess()
      },
    })
  })

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
        <RouteFocusModal.Body>
          <SplitView>
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
                      <div className="pt-4"></div>
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
                      <div className="pt-4"></div>
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
                      <div className="pt-4"></div>
                    </Collapsible.Content>
                  </Collapsible.Root>
                </div>
              </div>
            </SplitView.Content>
            <SplitView.Drawer></SplitView.Drawer>
          </SplitView>
        </RouteFocusModal.Body>
      </form>
    </RouteFocusModal.Form>
  )
}
