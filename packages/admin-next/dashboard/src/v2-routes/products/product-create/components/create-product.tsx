import { Button, ProgressStatus, ProgressTabs } from "@medusajs/ui"
import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../components/route-modal"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  CreateProductSchema,
  CreateProductSchemaType,
  defaults,
  normalize,
} from "../schema"
import { useCreateProduct } from "../../../../hooks/api/products"
import { ProductAttributesForm } from "./product-attributes-form"
import { VariantPricingForm } from "../../common/variant-pricing-form"

enum Tab {
  PRODUCT = "product",
  PRICE = "price",
}
type TabState = Record<Tab, ProgressStatus>

export const CreateProductPage = () => {
  const { t } = useTranslation()
  const [tab, setTab] = useState<Tab>(Tab.PRODUCT)
  const { handleSuccess } = useRouteModal()
  const form = useForm<CreateProductSchemaType>({
    defaultValues: defaults,
    resolver: zodResolver(CreateProductSchema),
  })

  const { mutateAsync, isLoading } = useCreateProduct()

  const handleSubmit = form.handleSubmit(
    async (values, e) => {
      if (!(e?.nativeEvent instanceof SubmitEvent)) return
      const submitter = e?.nativeEvent?.submitter as HTMLButtonElement
      if (!(submitter instanceof HTMLButtonElement)) return
      const isDraftSubmission = submitter.dataset.name === "save-draft-button"

      await mutateAsync(
        normalize({
          ...values,
          status: (isDraftSubmission ? "draft" : "published") as any,
        }),
        {
          onSuccess: ({ product }) => {
            handleSuccess(`../${product.id}`)
          },
        }
      )
    },
    (err) => {
      console.log(err)
    }
  )
  const tabState: TabState = {
    [Tab.PRODUCT]: tab === Tab.PRODUCT ? "in-progress" : "completed",
    [Tab.PRICE]: tab === Tab.PRICE ? "in-progress" : "not-started",
  }

  return (
    <RouteFocusModal>
      <RouteFocusModal.Form form={form}>
        <form onSubmit={handleSubmit} className="flex h-full flex-col">
          <ProgressTabs
            value={tab}
            onValueChange={(tab) => setTab(tab as Tab)}
            className="flex h-full flex-col overflow-hidden"
          >
            <RouteFocusModal.Header>
              <div className="flex w-full items-center justify-between gap-x-4">
                <div className="-my-2 w-full max-w-[400px] border-l">
                  <ProgressTabs.List className="grid w-full grid-cols-3">
                    <ProgressTabs.Trigger
                      status={tabState.product}
                      value={Tab.PRODUCT}
                    >
                      Products
                    </ProgressTabs.Trigger>
                    <ProgressTabs.Trigger
                      status={tabState.price}
                      value={Tab.PRICE}
                    >
                      Prices
                    </ProgressTabs.Trigger>
                  </ProgressTabs.List>
                </div>
                <div className="flex items-center justify-end gap-x-2">
                  <RouteFocusModal.Close asChild>
                    <Button variant="secondary" size="small">
                      {t("actions.cancel")}
                    </Button>
                  </RouteFocusModal.Close>
                  <Button
                    className="whitespace-nowrap"
                    data-name="save-draft-button"
                    variant="primary"
                    size="small"
                    key="submit-button"
                    type="submit"
                    isLoading={isLoading}
                  >
                    {t("actions.saveAsDraft")}
                  </Button>
                  <PrimaryButton
                    tab={tab}
                    next={() => setTab(Tab.PRICE)}
                    isLoading={isLoading}
                  />
                </div>
              </div>
            </RouteFocusModal.Header>
            <RouteFocusModal.Body className="size-full overflow-hidden">
              <ProgressTabs.Content
                className="size-full overflow-y-auto"
                value={Tab.PRODUCT}
              >
                <div className="flex h-full w-full">
                  <ProductAttributesForm form={form} />
                </div>
              </ProgressTabs.Content>
              <ProgressTabs.Content
                className="size-full overflow-y-auto"
                value={Tab.PRICE}
              >
                <VariantPricingForm form={form} />
              </ProgressTabs.Content>
            </RouteFocusModal.Body>
          </ProgressTabs>
        </form>
      </RouteFocusModal.Form>
    </RouteFocusModal>
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
        data-name="publish-button"
        key="submit-button"
        type="submit"
        variant="primary"
        size="small"
        isLoading={isLoading}
      >
        {t("actions.publish")}
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
