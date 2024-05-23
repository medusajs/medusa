import { zodResolver } from "@hookform/resolvers/zod"
import { Button, ProgressStatus, ProgressTabs, toast } from "@medusajs/ui"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/route-modal"
import { useCreateProduct } from "../../../../../hooks/api/products"
import { VariantPricingForm } from "../../../common/variant-pricing-form"
import {
  PRODUCT_CREATE_FORM_DEFAULTS,
  ProductCreateSchema,
} from "../../constants"
import { ProductCreateSchemaType } from "../../types"
import { normalizeProductFormValues } from "../../utils"
import { ProductCreateDetailsForm } from "../product-create-details-form"

enum Tab {
  PRODUCT = "product",
  PRICE = "price",
}

type TabState = Record<Tab, ProgressStatus>

const SAVE_DRAFT_BUTTON = "save-draft-button"

export const ProductCreateForm = () => {
  const [tab, setTab] = useState<Tab>(Tab.PRODUCT)

  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<ProductCreateSchemaType>({
    defaultValues: PRODUCT_CREATE_FORM_DEFAULTS,
    resolver: zodResolver(ProductCreateSchema),
  })

  const { mutateAsync, isPending } = useCreateProduct()

  const handleSubmit = form.handleSubmit(
    async (values, e) => {
      if (!(e?.nativeEvent instanceof SubmitEvent)) {
        return
      }
      const submitter = e?.nativeEvent?.submitter as HTMLButtonElement

      if (!(submitter instanceof HTMLButtonElement)) {
        return
      }

      const isDraftSubmission = submitter.dataset.name === SAVE_DRAFT_BUTTON

      await mutateAsync(
        normalizeProductFormValues({
          ...values,
          status: (isDraftSubmission ? "draft" : "published") as any,
        }),
        {
          onSuccess: ({ product }) => {
            toast.success(t("general.success"), {
              dismissLabel: t("actions.close"),
              description: t("products.create.successToast", {
                title: product.title,
              }),
            })

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
                      {t("products.create.tabs.details")}
                    </ProgressTabs.Trigger>
                    <ProgressTabs.Trigger
                      status={tabState.price}
                      value={Tab.PRICE}
                    >
                      {t("products.create.tabs.variants")}
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
                    data-name={SAVE_DRAFT_BUTTON}
                    size="small"
                    type="submit"
                    isLoading={isPending}
                    className="whitespace-nowrap"
                  >
                    {t("actions.saveAsDraft")}
                  </Button>
                  <PrimaryButton
                    tab={tab}
                    next={() => setTab(Tab.PRICE)}
                    isLoading={isPending}
                  />
                </div>
              </div>
            </RouteFocusModal.Header>
            <RouteFocusModal.Body className="size-full overflow-hidden">
              <ProgressTabs.Content
                className="size-full overflow-hidden"
                value={Tab.PRODUCT}
              >
                <ProductCreateDetailsForm form={form} />
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
