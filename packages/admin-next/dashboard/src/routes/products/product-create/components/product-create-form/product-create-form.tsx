import { zodResolver } from "@hookform/resolvers/zod"
import { HttpTypes, SalesChannelDTO } from "@medusajs/types"
import { Button, ProgressStatus, ProgressTabs, toast } from "@medusajs/ui"
import { useEffect, useMemo, useState } from "react"
import { useForm, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"
import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/modals"
import { useCreateProduct } from "../../../../../hooks/api/products"
import { useRegions } from "../../../../../hooks/api/regions"
import { sdk } from "../../../../../lib/client"
import { isFetchError } from "../../../../../lib/is-fetch-error"
import {
  PRODUCT_CREATE_FORM_DEFAULTS,
  ProductCreateSchema,
} from "../../constants"
import { ProductCreateSchemaType } from "../../types"
import { normalizeProductFormValues } from "../../utils"
import { ProductCreateDetailsForm } from "../product-create-details-form"
import { ProductCreateInventoryKitForm } from "../product-create-inventory-kit-form"
import { ProductCreateOrganizeForm } from "../product-create-organize-form"
import { ProductCreateVariantsForm } from "../product-create-variants-form"

enum Tab {
  DETAILS = "details",
  ORGANIZE = "organize",
  VARIANTS = "variants",
  INVENTORY = "inventory",
}

type TabState = Record<Tab, ProgressStatus>

const SAVE_DRAFT_BUTTON = "save-draft-button"

let LAST_VISITED_TAB: Tab | null = null

type ProductCreateFormProps = { defaultChannel?: SalesChannelDTO }

export const ProductCreateForm = ({
  defaultChannel,
}: ProductCreateFormProps) => {
  const [tab, setTab] = useState<Tab>(Tab.DETAILS)
  const [tabState, setTabState] = useState<TabState>({
    [Tab.DETAILS]: "in-progress",
    [Tab.ORGANIZE]: "not-started",
    [Tab.VARIANTS]: "not-started",
    [Tab.INVENTORY]: "not-started",
  })

  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<ProductCreateSchemaType>({
    defaultValues: {
      ...PRODUCT_CREATE_FORM_DEFAULTS,
      sales_channels: defaultChannel
        ? [{ id: defaultChannel.id, name: defaultChannel.name }]
        : [],
    },
    resolver: zodResolver(ProductCreateSchema),
  })

  const { mutateAsync, isPending } = useCreateProduct()
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

  /**
   * TODO: Important to revisit this - use variants watch so high in the tree can cause needless rerenders of the entire page
   * which is suboptimal when rerenders are caused by bulk editor changes
   */

  const watchedVariants = useWatch({
    control: form.control,
    name: "variants",
  })

  const showInventoryTab = useMemo(
    () => watchedVariants.some((v) => v.manage_inventory && v.inventory_kit),
    [watchedVariants]
  )

  const handleSubmit = form.handleSubmit(async (values, e) => {
    let isDraftSubmission = false
    if (e?.nativeEvent instanceof SubmitEvent) {
      const submitter = e?.nativeEvent?.submitter as HTMLButtonElement
      isDraftSubmission = submitter.dataset.name === SAVE_DRAFT_BUTTON
    }

    const media = values.media || []
    const payload = { ...values, media: undefined }

    let uploadedMedia: (HttpTypes.AdminFile & { isThumbnail: boolean })[] = []
    try {
      if (media.length) {
        const thumbnailReq = media.find((m) => m.isThumbnail)
        const otherMediaReq = media.filter((m) => !m.isThumbnail)

        const fileReqs = []
        if (thumbnailReq) {
          fileReqs.push(
            sdk.admin.upload
              .create({ files: [thumbnailReq.file] })
              .then((r) => r.files.map((f) => ({ ...f, isThumbnail: true })))
          )
        }
        if (otherMediaReq?.length) {
          fileReqs.push(
            sdk.admin.upload
              .create({
                files: otherMediaReq.map((m) => m.file),
              })
              .then((r) => r.files.map((f) => ({ ...f, isThumbnail: false })))
          )
        }

        uploadedMedia = (await Promise.all(fileReqs)).flat()
      }

      const { product } = await mutateAsync(
        normalizeProductFormValues({
          ...payload,
          media: uploadedMedia,
          status: (isDraftSubmission ? "draft" : "published") as any,
          regionsCurrencyMap,
        })
      )

      toast.success(
        t("products.create.successToast", {
          title: product.title,
        })
      )

      handleSuccess(`../${product.id}`)
    } catch (error) {
      if (isFetchError(error) && error.status === 400) {
        toast.error(error.message)
      } else {
        toast.error(t("general.error"), {
          description: error.message,
        })
      }
    }
  })

  const onNext = async (currentTab: Tab) => {
    const valid = await form.trigger()

    if (!valid) {
      return
    }

    if (currentTab === Tab.DETAILS) {
      setTab(Tab.ORGANIZE)
    }

    if (currentTab === Tab.ORGANIZE) {
      setTab(Tab.VARIANTS)
    }

    if (currentTab === Tab.VARIANTS) {
      setTab(Tab.INVENTORY)
    }
  }

  useEffect(() => {
    const currentState = { ...tabState }
    if (tab === Tab.DETAILS) {
      currentState[Tab.DETAILS] = "in-progress"
    }
    if (tab === Tab.ORGANIZE) {
      currentState[Tab.DETAILS] = "completed"
      currentState[Tab.ORGANIZE] = "in-progress"
    }
    if (tab === Tab.VARIANTS) {
      currentState[Tab.DETAILS] = "completed"
      currentState[Tab.ORGANIZE] = "completed"
      currentState[Tab.VARIANTS] = "in-progress"
    }
    if (tab === Tab.INVENTORY) {
      currentState[Tab.DETAILS] = "completed"
      currentState[Tab.ORGANIZE] = "completed"
      currentState[Tab.VARIANTS] = "completed"
      currentState[Tab.INVENTORY] = "in-progress"
    }

    setTabState({ ...currentState })

    LAST_VISITED_TAB = tab
  }, [tab])

  return (
    <RouteFocusModal>
      <RouteFocusModal.Form form={form}>
        <form
          // onKeyDown={(e) => {
          //   // We want to continue to the next tab on enter instead of saving as draft immediately
          //   if (e.key === "Enter") {
          //     if (tab !== Tab.VARIANTS) {
          //       e.preventDefault()
          //       e.stopPropagation()
          //       onNext(tab)
          //     } else {
          //       e.preventDefault()
          //       e.stopPropagation()
          //       handleSubmit(e)
          //     }
          //   }
          // }}
          onSubmit={handleSubmit}
          className="flex h-full flex-col"
        >
          <ProgressTabs
            value={tab}
            onValueChange={async (tab) => {
              const valid = await form.trigger()

              if (!valid) {
                return
              }

              setTab(tab as Tab)
            }}
            className="flex h-full flex-col overflow-hidden"
          >
            <RouteFocusModal.Header>
              <div className="-my-2 w-full border-l">
                <ProgressTabs.List className="justify-start-start flex w-full items-center">
                  <ProgressTabs.Trigger
                    status={tabState[Tab.DETAILS]}
                    value={Tab.DETAILS}
                    className="max-w-[200px] truncate"
                  >
                    {t("products.create.tabs.details")}
                  </ProgressTabs.Trigger>
                  <ProgressTabs.Trigger
                    status={tabState[Tab.ORGANIZE]}
                    value={Tab.ORGANIZE}
                    className="max-w-[200px] truncate"
                  >
                    {t("products.create.tabs.organize")}
                  </ProgressTabs.Trigger>
                  <ProgressTabs.Trigger
                    status={tabState[Tab.VARIANTS]}
                    value={Tab.VARIANTS}
                    className="max-w-[200px] truncate"
                  >
                    {t("products.create.tabs.variants")}
                  </ProgressTabs.Trigger>
                  {showInventoryTab && (
                    <ProgressTabs.Trigger
                      status={tabState[Tab.INVENTORY]}
                      value={Tab.INVENTORY}
                      className="max-w-[200px] truncate"
                    >
                      {t("products.create.tabs.inventory")}
                    </ProgressTabs.Trigger>
                  )}
                </ProgressTabs.List>
              </div>
            </RouteFocusModal.Header>
            <RouteFocusModal.Body className="size-full overflow-hidden">
              <ProgressTabs.Content
                className="size-full overflow-y-auto"
                value={Tab.DETAILS}
              >
                <ProductCreateDetailsForm form={form} />
              </ProgressTabs.Content>
              <ProgressTabs.Content
                className="size-full overflow-y-auto"
                value={Tab.ORGANIZE}
              >
                <ProductCreateOrganizeForm form={form} />
              </ProgressTabs.Content>
              <ProgressTabs.Content
                className="size-full overflow-y-auto"
                value={Tab.VARIANTS}
              >
                <ProductCreateVariantsForm form={form} />
              </ProgressTabs.Content>
              {showInventoryTab && (
                <ProgressTabs.Content
                  className="size-full overflow-y-auto"
                  value={Tab.INVENTORY}
                >
                  <ProductCreateInventoryKitForm form={form} />
                </ProgressTabs.Content>
              )}
            </RouteFocusModal.Body>
          </ProgressTabs>
          <RouteFocusModal.Footer>
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
                next={onNext}
                isLoading={isPending}
                showInventoryTab={showInventoryTab}
              />
            </div>
          </RouteFocusModal.Footer>
        </form>
      </RouteFocusModal.Form>
    </RouteFocusModal>
  )
}

type PrimaryButtonProps = {
  tab: Tab
  next: (tab: Tab) => void
  isLoading?: boolean
  showInventoryTab: boolean
}

const PrimaryButton = ({
  tab,
  next,
  isLoading,
  showInventoryTab,
}: PrimaryButtonProps) => {
  const { t } = useTranslation()

  if (
    (tab === Tab.VARIANTS && !showInventoryTab) ||
    (tab === Tab.INVENTORY && showInventoryTab)
  ) {
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
