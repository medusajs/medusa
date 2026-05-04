import { zodResolver } from "@hookform/resolvers/zod"
import { HttpTypes } from "@medusajs/types"
import { Button, ProgressStatus, ProgressTabs, toast } from "@medusajs/ui"
import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "@medusajs/framework/zod"
import { KeyboundForm } from "../../../../../components/keybound-form"
import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/modals"
import { useCreateProduct } from "../../../../../hooks/api/products"
import { sdk } from "../../../../../lib/sdk"
import { normalizeProductFormValues } from "../../../../../utils/variants"
import { GiftCardProductCreateDenominationsForm } from "./gift-card-product-create-denominations-form"
import { GiftCardProductCreateDetailsForm } from "./gift-card-product-create-details-form"
import { PRODUCT_CREATE_FORM_DEFAULTS, ProductCreateSchema } from "./schema"

enum Tab {
  DETAILS = "details",
  PRICES = "prices",
}

type TabState = Record<Tab, ProgressStatus>

const SAVE_DRAFT_BUTTON = "save-draft-button"

type ProductCreateFormProps = {
  defaultChannel?: HttpTypes.AdminSalesChannel
  regions: HttpTypes.AdminRegion[]
  store: HttpTypes.AdminStore
  pricePreferences: HttpTypes.AdminPricePreference[]
}

export const GiftCardProductCreateForm = ({
  defaultChannel,
  regions,
  store,
  pricePreferences,
}: ProductCreateFormProps) => {
  const [tab, setTab] = useState<Tab>(Tab.DETAILS)
  const [tabState, setTabState] = useState<TabState>({
    [Tab.DETAILS]: "in-progress",
    [Tab.PRICES]: "not-started",
  })

  const { handleSuccess } = useRouteModal()
  const form = useForm<z.infer<typeof ProductCreateSchema>>({
    defaultValues: {
      ...PRODUCT_CREATE_FORM_DEFAULTS,
      sales_channels: defaultChannel
        ? [{ id: defaultChannel.id, name: defaultChannel.name }]
        : [],
    },
    resolver: zodResolver(ProductCreateSchema),
  })

  const { mutateAsync, isPending } = useCreateProduct()

  const regionsCurrencyMap = useMemo(() => {
    if (!regions?.length) {
      return {}
    }

    return regions.reduce((acc, reg) => {
      acc[reg.id] = reg.currency_code
      return acc
    }, {} as Record<string, string>)
  }, [regions])

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
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      }
    }

    await mutateAsync(
      normalizeProductFormValues({
        ...payload,
        media: uploadedMedia,
        status: (isDraftSubmission ? "draft" : "published") as any,
        regionsCurrencyMap,
      }),
      {
        onSuccess: (data) => {
          toast.success(
            `Product ${data.product.title} was successfully created.`
          )

          handleSuccess(`../${data.product.id}`)
        },
        onError: (error) => {
          toast.error(error.message)
        },
      }
    )
  })

  const onNext = async (currentTab: Tab) => {
    const valid = await form.trigger()

    if (!valid) {
      return
    }

    if (currentTab === Tab.DETAILS) {
      setTab(Tab.PRICES)
    }
  }

  useEffect(() => {
    const currentState = { ...tabState }
    if (tab === Tab.DETAILS) {
      currentState[Tab.DETAILS] = "in-progress"
    }
    if (tab === Tab.PRICES) {
      currentState[Tab.DETAILS] = "completed"
      currentState[Tab.PRICES] = "in-progress"
    }

    setTabState({ ...currentState })
  }, [tab])

  return (
    <RouteFocusModal.Form form={form}>
      <KeyboundForm
        onKeyDown={(e) => {
          // We want to continue to the next tab on enter instead of saving as draft immediately
          if (e.key === "Enter") {
            if (
              e.target instanceof HTMLTextAreaElement &&
              !(e.metaKey || e.ctrlKey)
            ) {
              return
            }

            e.preventDefault()

            if (e.metaKey || e.ctrlKey) {
              if (tab !== Tab.PRICES) {
                e.preventDefault()
                e.stopPropagation()
                onNext(tab)

                return
              }

              handleSubmit()
            }
          }
        }}
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
                  Details
                </ProgressTabs.Trigger>
                <ProgressTabs.Trigger
                  status={tabState[Tab.PRICES]}
                  value={Tab.PRICES}
                  className="max-w-[200px] truncate"
                >
                  Prices
                </ProgressTabs.Trigger>
              </ProgressTabs.List>
            </div>
          </RouteFocusModal.Header>
          <RouteFocusModal.Body className="size-full overflow-hidden">
            <ProgressTabs.Content
              className="size-full overflow-y-auto"
              value={Tab.DETAILS}
            >
              <GiftCardProductCreateDetailsForm form={form} />
            </ProgressTabs.Content>

            <ProgressTabs.Content
              className="size-full overflow-y-auto"
              value={Tab.PRICES}
            >
              <GiftCardProductCreateDenominationsForm
                form={form}
                store={store}
                regions={regions}
                pricePreferences={pricePreferences}
              />
            </ProgressTabs.Content>
          </RouteFocusModal.Body>
        </ProgressTabs>
        <RouteFocusModal.Footer>
          <div className="flex items-center justify-end gap-x-2">
            <RouteFocusModal.Close asChild>
              <Button variant="secondary" size="small">
                Cancel
              </Button>
            </RouteFocusModal.Close>
            <Button
              data-name={SAVE_DRAFT_BUTTON}
              size="small"
              type="submit"
              isLoading={isPending}
              className="whitespace-nowrap"
            >
              Save as draft
            </Button>

            <PrimaryButton tab={tab} next={onNext} isLoading={isPending} />
          </div>
        </RouteFocusModal.Footer>
      </KeyboundForm>
    </RouteFocusModal.Form>
  )
}

type PrimaryButtonProps = {
  tab: Tab
  next: (tab: Tab) => void
  isLoading?: boolean
}

const PrimaryButton = ({ tab, next, isLoading }: PrimaryButtonProps) => {
  if (tab === Tab.PRICES) {
    return (
      <Button
        data-name="publish-button"
        key="submit-button"
        type="submit"
        variant="primary"
        size="small"
        isLoading={isLoading}
      >
        Publish
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
      Continue
    </Button>
  )
}
