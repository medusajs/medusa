import { HttpTypes } from "@medusajs/types"
import {
  Badge,
  Button,
  CurrencyInput,
  Divider,
  Heading,
  IconButton,
  Text,
  toast,
  Tooltip,
} from "@medusajs/ui"
import { useCallback, useEffect, useMemo, useState } from "react"
import { Control, useForm, UseFormSetValue, useWatch } from "react-hook-form"
import { useParams } from "react-router-dom"
import { z } from "zod"

import { zodResolver } from "@hookform/resolvers/zod"
import {
  Buildings,
  Channels,
  Shopping,
  Trash,
  TriangleRightMini,
  TruckFast,
} from "@medusajs/icons"
import isEqual from "lodash.isequal"
import { Accordion } from "radix-ui"
import { ConditionalTooltip } from "../../../../components/common/conditional-tooltip"
import { Form } from "../../../../components/common/form"
import { KeyboundForm } from "../../../../components/common/keybound-form"
import { Thumbnail } from "../../../../components/common/thumbnail"
import { Combobox } from "../../../../components/inputs/combobox"
import {
  RouteFocusModal,
  StackedFocusModal,
  useRouteModal,
  useStackedModal,
} from "../../../../components/modals"
import {
  useDraftOrderAddShippingMethod,
  useDraftOrderConfirmEdit,
  useDraftOrderRemoveActionShippingMethod,
  useDraftOrderRemoveShippingMethod,
  useDraftOrderRequestEdit,
  useDraftOrderUpdateShippingMethod,
} from "../../../../hooks/api/draft-orders"
import { useOrder, useOrderPreview } from "../../../../hooks/api/orders"
import { useShippingOptions } from "../../../../hooks/api/shipping-options"
import { useComboboxData } from "../../../../hooks/common/use-combobox-data"
import { useCancelOrderEdit } from "../../../../hooks/order-edits/use-cancel-order-edit"
import { useInitiateOrderEdit } from "../../../../hooks/order-edits/use-initiate-order-edit"
import { getNativeSymbol } from "../../../../lib/data/currencies"
import { sdk } from "../../../../lib/queries/sdk"
import { convertNumber } from "../../../../lib/utils/number-utils"
import {
  getItemsWithShippingProfile,
  getUniqueShippingProfiles,
} from "../../../../lib/utils/order-utils"
import { pluralize } from "../../../../lib/utils/string-utils"
import { ActionMenu } from "../../../../components/common/action-menu"

const STACKED_FOCUS_MODAL_ID = "shipping-form"

const Shipping = () => {
  const { id } = useParams()

  const { order, isPending, isError, error } = useOrder(id!, {
    fields:
      "+items.*,+items.variant.*,+items.variant.product.*,+items.variant.product.shipping_profile.*,+currency_code",
  })

  const {
    order: preview,
    isPending: isPreviewPending,
    isError: isPreviewError,
    error: previewError,
  } = useOrderPreview(id!)

  useInitiateOrderEdit({ preview })
  const { onCancel } = useCancelOrderEdit({ preview })

  if (isError) {
    throw error
  }

  if (isPreviewError) {
    throw previewError
  }

  const orderHasItems = (order?.items?.length || 0) > 0
  const isReady = preview && !isPreviewPending && order && !isPending

  return (
    <RouteFocusModal onClose={onCancel}>
      {!orderHasItems ? (
        <div className="flex h-full flex-col overflow-hidden ">
          <RouteFocusModal.Header />
          <RouteFocusModal.Body className="flex flex-1 flex-col overflow-hidden">
            <div className="flex flex-1 flex-col items-center overflow-y-auto">
              <div className="flex w-full max-w-[720px] flex-col gap-y-6 px-6 py-16">
                <RouteFocusModal.Title asChild>
                  <Heading>Shipping</Heading>
                </RouteFocusModal.Title>
                <RouteFocusModal.Description asChild>
                  <Text size="small" className="text-ui-fg-subtle">
                    This draft order currently has no items. Add items to the
                    order before adding shipping.
                  </Text>
                </RouteFocusModal.Description>
              </div>
            </div>
          </RouteFocusModal.Body>
          <RouteFocusModal.Footer>
            <RouteFocusModal.Close asChild>
              <Button size="small" variant="secondary" type="button">
                Cancel
              </Button>
            </RouteFocusModal.Close>
          </RouteFocusModal.Footer>
        </div>
      ) : isReady ? (
        <ShippingForm preview={preview} order={order} />
      ) : (
        <div>
          <RouteFocusModal.Title asChild>
            <span className="sr-only">Edit Shipping</span>
          </RouteFocusModal.Title>
          <RouteFocusModal.Description asChild>
            <span className="sr-only">
              Loading data for the draft order, please wait...
            </span>
          </RouteFocusModal.Description>
        </div>
      )}
    </RouteFocusModal>
  )
}

interface ShippingFormProps {
  preview: HttpTypes.AdminOrderPreview
  order: HttpTypes.AdminOrder
}

interface ShippingFormData {
  shippingProfileId: string
  shippingOption?: HttpTypes.AdminShippingOption
  shippingMethod?: HttpTypes.AdminOrderShippingMethod
}

const ShippingForm = ({ preview, order }: ShippingFormProps) => {
  const { setIsOpen } = useStackedModal()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [data, setData] = useState<ShippingFormData | null>(null)

  const appliedShippingOptionIds = preview.shipping_methods
    ?.map((method) => method.shipping_option_id)
    .filter(Boolean) as string[]

  const { shipping_options } = useShippingOptions(
    {
      id: appliedShippingOptionIds,
      fields:
        "+service_zone.*,+service_zone.fulfillment_set.*,+service_zone.fulfillment_set.location.*",
    },
    {
      enabled: appliedShippingOptionIds.length > 0,
    }
  )

  const uniqueShippingProfiles = useMemo(() => {
    const profiles = new Map<string, HttpTypes.AdminShippingProfile>()

    getUniqueShippingProfiles(order.items).forEach((profile) => {
      profiles.set(profile.id, profile)
    })

    shipping_options?.forEach((option) => {
      profiles.set(option.shipping_profile_id, option.shipping_profile)
    })

    return Array.from(profiles.values())
  }, [order.items, shipping_options])

  const { handleSuccess } = useRouteModal()

  const { mutateAsync: confirmOrderEdit } = useDraftOrderConfirmEdit(preview.id)
  const { mutateAsync: requestOrderEdit } = useDraftOrderRequestEdit(preview.id)

  const { mutateAsync: removeShippingMethod } =
    useDraftOrderRemoveShippingMethod(preview.id)

  const { mutateAsync: removeActionShippingMethod } =
    useDraftOrderRemoveActionShippingMethod(preview.id)

  const onSubmit = async () => {
    setIsSubmitting(true)

    let requestSucceeded = false

    await requestOrderEdit(undefined, {
      onError: (e) => {
        toast.error(`Failed to request order edit: ${e.message}`)
      },
      onSuccess: () => {
        requestSucceeded = true
      },
    })

    if (!requestSucceeded) {
      setIsSubmitting(false)
      return
    }

    await confirmOrderEdit(undefined, {
      onError: (e) => {
        toast.error(`Failed to confirm order edit: ${e.message}`)
      },
      onSuccess: () => {
        handleSuccess()
      },
      onSettled: () => {
        setIsSubmitting(false)
      },
    })
  }

  const onKeydown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        if (data || isSubmitting) {
          // Don't do anything if the StackedFocusModal is open or the form is submitting
          return
        }

        onSubmit()
      }
    },
    [data, isSubmitting, onSubmit]
  )

  useEffect(() => {
    document.addEventListener("keydown", onKeydown)

    return () => {
      document.removeEventListener("keydown", onKeydown)
    }
  }, [onKeydown])

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <RouteFocusModal.Header />
      <RouteFocusModal.Body className="flex flex-1 flex-col overflow-hidden">
        <div className="flex flex-1 flex-col items-center overflow-y-auto">
          <div className="flex w-full max-w-[720px] flex-col gap-y-6 px-6 py-16">
            <div>
              <RouteFocusModal.Title asChild>
                <Heading>Shipping</Heading>
              </RouteFocusModal.Title>
              <RouteFocusModal.Description asChild>
                <Text size="small" className="text-ui-fg-subtle">
                  Choose which shipping method(s) to use for the items in the
                  order.
                </Text>
              </RouteFocusModal.Description>
            </div>
            <Divider variant="dashed" />
            <Accordion.Root type="multiple">
              <div className="bg-ui-bg-subtle shadow-elevation-card-rest rounded-xl">
                <div className="flex items-center justify-between px-4 py-2">
                  <Text
                    size="xsmall"
                    weight="plus"
                    className="text-ui-fg-muted"
                  >
                    Shipping profile
                  </Text>
                  <Text
                    size="xsmall"
                    weight="plus"
                    className="text-ui-fg-muted"
                  >
                    Action
                  </Text>
                </div>
                <div className="px-[5px] pb-[5px]">
                  {uniqueShippingProfiles.map((profile) => {
                    const items = getItemsWithShippingProfile(
                      profile.id,
                      order.items
                    )

                    const hasItems = items.length > 0

                    const shippingOption = shipping_options?.find(
                      (option) => option.shipping_profile_id === profile.id
                    )

                    const shippingMethod = preview.shipping_methods.find(
                      (method) =>
                        method.shipping_option_id === shippingOption?.id
                    )

                    const addShippingMethodAction =
                      shippingMethod?.actions?.find(
                        (action) => action.action === "SHIPPING_ADD"
                      )

                    return (
                      <Accordion.Item
                        key={profile.id}
                        value={profile.id}
                        className="bg-ui-bg-base shadow-elevation-card-rest rounded-lg"
                      >
                        <div className="flex items-center justify-between gap-3 px-3 py-2">
                          <div className="flex w-full items-center gap-x-3 overflow-hidden">
                            <Accordion.Trigger asChild>
                              <IconButton
                                size="2xsmall"
                                variant="transparent"
                                className="group/trigger"
                                disabled={!hasItems}
                              >
                                <TriangleRightMini className="transition-transform group-data-[state=open]/trigger:rotate-90" />
                              </IconButton>
                            </Accordion.Trigger>
                            {!shippingOption ? (
                              <div className="flex items-center gap-x-3">
                                <div className="shadow-borders-base flex size-7 items-center justify-center rounded-md">
                                  <div className="bg-ui-bg-component-hover flex size-6 items-center justify-center rounded">
                                    <Shopping className="text-ui-fg-subtle" />
                                  </div>
                                </div>
                                <div className="flex flex-1 flex-col">
                                  <Text
                                    size="small"
                                    weight="plus"
                                    leading="compact"
                                  >
                                    {profile.name}
                                  </Text>
                                  <Text
                                    size="small"
                                    leading="compact"
                                    className="text-ui-fg-subtle"
                                  >
                                    {items.length}{" "}
                                    {pluralize(items.length, "items", "item")}
                                  </Text>
                                </div>
                              </div>
                            ) : (
                              <div className="flex w-full flex-1 items-center gap-[5px] overflow-hidden max-sm:flex-col max-sm:items-start">
                                <Tooltip
                                  content={
                                    <ul>
                                      {items.map((item) => (
                                        <li
                                          key={item.id}
                                        >{`${item.quantity}x ${item.variant?.product?.title} (${item.variant?.title})`}</li>
                                      ))}
                                    </ul>
                                  }
                                >
                                  <Badge
                                    className="flex cursor-default items-center gap-x-[3px] overflow-hidden"
                                    size="xsmall"
                                  >
                                    <Shopping className="shrink-0" />
                                    <span className="truncate">
                                      {items.reduce(
                                        (acc, item) => acc + item.quantity,
                                        0
                                      )}
                                      x{" "}
                                      {pluralize(items.length, "items", "item")}
                                    </span>
                                  </Badge>
                                </Tooltip>
                                <Tooltip
                                  content={
                                    shippingOption.service_zone?.fulfillment_set
                                      ?.location?.name
                                  }
                                >
                                  <Badge
                                    className="flex cursor-default items-center gap-x-[3px] overflow-hidden"
                                    size="xsmall"
                                  >
                                    <Buildings className="shrink-0" />
                                    <span className="truncate">
                                      {
                                        shippingOption.service_zone
                                          ?.fulfillment_set?.location?.name
                                      }
                                    </span>
                                  </Badge>
                                </Tooltip>
                                <Tooltip content={shippingOption.name}>
                                  <Badge
                                    className="flex cursor-default items-center gap-x-[3px] overflow-hidden"
                                    size="xsmall"
                                  >
                                    <TruckFast className="shrink-0" />
                                    <span className="truncate">
                                      {shippingOption.name}
                                    </span>
                                  </Badge>
                                </Tooltip>
                              </div>
                            )}
                          </div>

                          {shippingOption ? (
                            <ActionMenu
                              groups={[
                                {
                                  actions: [
                                    hasItems
                                      ? {
                                          label: "Edit shipping option",
                                          icon: <Channels />,
                                          onClick: () => {
                                            setIsOpen(
                                              STACKED_FOCUS_MODAL_ID,
                                              true
                                            )
                                            setData({
                                              shippingProfileId: profile.id,
                                              shippingOption,
                                              shippingMethod,
                                            })
                                          },
                                        }
                                      : undefined,
                                    {
                                      label: "Remove shipping option",
                                      icon: <Trash />,
                                      onClick: () => {
                                        if (shippingMethod) {
                                          if (addShippingMethodAction) {
                                            removeActionShippingMethod(
                                              addShippingMethodAction.id
                                            )
                                          } else {
                                            removeShippingMethod(
                                              shippingMethod.id
                                            )
                                          }
                                        }
                                      },
                                    },
                                  ].filter(Boolean),
                                },
                              ]}
                            />
                          ) : (
                            <StackedModalTrigger
                              shippingProfileId={profile.id}
                              shippingOption={shippingOption}
                              shippingMethod={shippingMethod}
                              setData={setData}
                            >
                              Add shipping option
                            </StackedModalTrigger>
                          )}
                        </div>
                        <Accordion.Content>
                          <Divider variant="dashed" />
                          {items.map((item, idx) => {
                            return (
                              <div key={item.id}>
                                <div
                                  className="flex items-center gap-x-3 px-3"
                                  key={item.id}
                                >
                                  <div className="flex h-[56px] w-5 flex-col items-center justify-center">
                                    <Divider
                                      variant="dashed"
                                      orientation="vertical"
                                    />
                                  </div>
                                  <div className="flex items-center gap-x-3 py-2">
                                    <div className="flex size-7 items-center justify-center tabular-nums">
                                      <Text
                                        size="small"
                                        leading="compact"
                                        className="text-ui-fg-subtle"
                                      >
                                        {item.quantity}x
                                      </Text>
                                    </div>
                                    <Thumbnail thumbnail={item.thumbnail} />
                                    <div>
                                      <Text
                                        size="small"
                                        leading="compact"
                                        weight="plus"
                                      >
                                        {item.variant?.product?.title} (
                                        {item.variant?.title})
                                      </Text>
                                      <Text
                                        size="small"
                                        leading="compact"
                                        className="text-ui-fg-subtle"
                                      >
                                        {item.variant?.options
                                          ?.map((option) => option.value)
                                          .join(" · ")}
                                      </Text>
                                    </div>
                                  </div>
                                </div>
                                {idx !== items.length - 1 && (
                                  <Divider variant="dashed" />
                                )}
                              </div>
                            )
                          })}
                        </Accordion.Content>
                      </Accordion.Item>
                    )
                  })}
                </div>
              </div>
            </Accordion.Root>
          </div>
        </div>
        <StackedFocusModal
          id={STACKED_FOCUS_MODAL_ID}
          onOpenChangeCallback={(open) => {
            if (!open) {
              setData(null)
            }

            return open
          }}
        >
          {data && (
            <ShippingProfileForm data={data} order={order} preview={preview} />
          )}
        </StackedFocusModal>
      </RouteFocusModal.Body>
      <RouteFocusModal.Footer>
        <div className="flex justify-end gap-x-2">
          <RouteFocusModal.Close asChild>
            <Button size="small" variant="secondary" type="button">
              Cancel
            </Button>
          </RouteFocusModal.Close>
          <Button
            size="small"
            type="button"
            isLoading={isSubmitting}
            onClick={onSubmit}
          >
            Save
          </Button>
        </div>
      </RouteFocusModal.Footer>
    </div>
  )
}

interface StackedModalTriggerProps {
  shippingProfileId: string
  shippingOption?: HttpTypes.AdminShippingOption
  shippingMethod?: HttpTypes.AdminOrderShippingMethod
  setData: (data: ShippingFormData | null) => void
  children: React.ReactNode
}

const StackedModalTrigger = ({
  shippingProfileId,
  shippingOption,
  shippingMethod,
  setData,
  children,
}: StackedModalTriggerProps) => {
  const { setIsOpen, getIsOpen } = useStackedModal()

  const isOpen = getIsOpen(STACKED_FOCUS_MODAL_ID)

  const onToggle = () => {
    if (isOpen) {
      setIsOpen(STACKED_FOCUS_MODAL_ID, false)
      setData(null)
    } else {
      setIsOpen(STACKED_FOCUS_MODAL_ID, true)
      setData({
        shippingProfileId,
        shippingOption,
        shippingMethod,
      })
    }
  }

  return (
    <Button
      size="small"
      variant="secondary"
      onClick={onToggle}
      className="text-ui-fg-primary shrink-0"
    >
      {children}
    </Button>
  )
}

interface ShippingProfileFormProps {
  data: ShippingFormData
  order: HttpTypes.AdminOrder
  preview: HttpTypes.AdminOrderPreview
}

const ShippingProfileForm = ({
  data,
  order,
  preview,
}: ShippingProfileFormProps) => {
  const { setIsOpen } = useStackedModal()

  const form = useForm<z.infer<typeof shippingMethodSchema>>({
    resolver: zodResolver(shippingMethodSchema),
    defaultValues: {
      location_id:
        data.shippingOption?.service_zone?.fulfillment_set?.location?.id,
      shipping_option_id: data.shippingOption?.id,
      custom_amount: data.shippingMethod?.amount,
    },
  })

  const { mutateAsync: addShippingMethod, isPending } =
    useDraftOrderAddShippingMethod(order.id)
  const {
    mutateAsync: updateShippingMethod,
    isPending: isUpdatingShippingMethod,
  } = useDraftOrderUpdateShippingMethod(order.id)

  const onSubmit = form.handleSubmit(async (values) => {
    if (isEqual(values, form.formState.defaultValues)) {
      setIsOpen(STACKED_FOCUS_MODAL_ID, false)
      return
    }

    if (data.shippingMethod) {
      await updateShippingMethod(
        {
          method_id: data.shippingMethod.id,
          shipping_option_id: values.shipping_option_id,
          custom_amount: values.custom_amount
            ? convertNumber(values.custom_amount)
            : undefined,
        },
        {
          onError: (e) => {
            toast.error(e.message)
          },
          onSuccess: () => {
            setIsOpen(STACKED_FOCUS_MODAL_ID, false)
          },
        }
      )

      return
    }

    await addShippingMethod(
      {
        shipping_option_id: values.shipping_option_id,
        custom_amount: values.custom_amount
          ? convertNumber(values.custom_amount)
          : undefined,
      },
      {
        onError: (e) => {
          toast.error(e.message)
        },
        onSuccess: () => {
          setIsOpen(STACKED_FOCUS_MODAL_ID, false)
        },
      }
    )
  })

  return (
    <StackedFocusModal.Content>
      <Form {...form}>
        <KeyboundForm
          className="flex h-full flex-col overflow-hidden"
          onSubmit={onSubmit}
        >
          <StackedFocusModal.Header />
          <StackedFocusModal.Body className="flex flex-1 flex-col overflow-hidden">
            <div className="flex flex-1 flex-col items-center overflow-y-auto">
              <div className="flex w-full max-w-[720px] flex-col gap-y-6 px-6 py-16">
                <div>
                  <RouteFocusModal.Title asChild>
                    <Heading>Shipping</Heading>
                  </RouteFocusModal.Title>
                  <RouteFocusModal.Description asChild>
                    <Text size="small" className="text-ui-fg-subtle">
                      Add a shipping method for the selected shipping profile.
                      You can see the items that will be shipped using this
                      method in the preview below.
                    </Text>
                  </RouteFocusModal.Description>
                </div>
                <Divider variant="dashed" />
                <LocationField
                  control={form.control}
                  setValue={form.setValue}
                />
                <Divider variant="dashed" />
                <ShippingOptionField
                  shippingProfileId={data.shippingProfileId}
                  preview={preview}
                  control={form.control}
                />
                <Divider variant="dashed" />
                <CustomAmountField
                  control={form.control}
                  currencyCode={order.currency_code}
                />
                <Divider variant="dashed" />
                <ItemsPreview
                  order={order}
                  shippingProfileId={data.shippingProfileId}
                />
              </div>
            </div>
          </StackedFocusModal.Body>
          <StackedFocusModal.Footer>
            <div className="flex justify-end gap-x-2">
              <StackedFocusModal.Close asChild>
                <Button size="small" variant="secondary" type="button">
                  Cancel
                </Button>
              </StackedFocusModal.Close>
              <Button
                size="small"
                type="submit"
                isLoading={isPending || isUpdatingShippingMethod}
              >
                {data.shippingMethod ? "Update" : "Add"}
              </Button>
            </div>
          </StackedFocusModal.Footer>
        </KeyboundForm>
      </Form>
    </StackedFocusModal.Content>
  )
}

const shippingMethodSchema = z.object({
  location_id: z.string(),
  shipping_option_id: z.string(),
  custom_amount: z.union([z.number(), z.string()]).optional(),
})

interface ItemsPreviewProps {
  order: HttpTypes.AdminOrder
  shippingProfileId: string
}

const ItemsPreview = ({ order, shippingProfileId }: ItemsPreviewProps) => {
  const matches = order.items.filter(
    (item) => item.variant?.product?.shipping_profile?.id === shippingProfileId
  )

  return (
    <div className="flex flex-col gap-y-6">
      <div className="grid grid-cols-2 items-center gap-3">
        <div className="flex flex-col">
          <Text size="small" weight="plus" leading="compact">
            Items to ship
          </Text>
          <Text size="small" className="text-ui-fg-subtle">
            Items with the selected shipping profile.
          </Text>
        </div>
      </div>
      <div className="bg-ui-bg-subtle shadow-elevation-card-rest rounded-xl">
        <div className="text-ui-fg-muted grid grid-cols-2 gap-3 px-4 py-2">
          <div>
            <Text size="small" weight="plus">
              Item
            </Text>
          </div>
          <div>
            <Text size="small" weight="plus">
              Quantity
            </Text>
          </div>
        </div>
        <div className="flex flex-col gap-y-1.5 px-[5px] pb-[5px]">
          {matches.length > 0 ? (
            matches?.map((item) => (
              <div
                key={item.id}
                className="bg-ui-bg-base shadow-elevation-card-rest grid grid-cols-2 items-center gap-3 rounded-lg px-4 py-2"
              >
                <div className="flex items-center gap-x-3">
                  <Thumbnail
                    thumbnail={item.thumbnail}
                    alt={item.product_title ?? undefined}
                  />
                  <div className="flex flex-col">
                    <div className="flex items-center gap-x-1">
                      <Text size="small" weight="plus" leading="compact">
                        {item.product_title}
                      </Text>
                      <Text
                        size="small"
                        leading="compact"
                        className="text-ui-fg-subtle"
                      >
                        ({item.variant_title})
                      </Text>
                    </div>
                    <Text
                      size="small"
                      leading="compact"
                      className="text-ui-fg-subtle"
                    >
                      {item.variant_sku}
                    </Text>
                  </div>
                </div>
                <Text
                  size="small"
                  leading="compact"
                  className="text-ui-fg-subtle"
                >
                  {item.quantity}x
                </Text>
              </div>
            ))
          ) : (
            <div className="bg-ui-bg-base shadow-elevation-card-rest flex flex-col items-center justify-center gap-1 gap-x-3 rounded-lg p-4">
              <Text size="small" weight="plus" leading="compact">
                No items found
              </Text>
              <Text size="small" className="text-ui-fg-subtle">
                No items found for "{query}".
              </Text>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

type LocationFieldProps = {
  control: Control<z.infer<typeof shippingMethodSchema>>
  setValue: UseFormSetValue<z.infer<typeof shippingMethodSchema>>
}

const LocationField = ({ control, setValue }: LocationFieldProps) => {
  const locations = useComboboxData({
    queryKey: ["locations"],
    queryFn: async (params) => {
      return await sdk.admin.stockLocation.list(params)
    },
    getOptions: (data) => {
      return data.stock_locations.map((location) => ({
        label: location.name,
        value: location.id,
      }))
    },
  })

  return (
    <Form.Field
      control={control}
      name="location_id"
      render={({ field: { onChange, ...field } }) => {
        return (
          <Form.Item>
            <div className="grid grid-cols-2 gap-x-3">
              <div>
                <Form.Label>Location</Form.Label>
                <Form.Hint>
                  Choose where you want to ship the items from.
                </Form.Hint>
              </div>
              <Form.Control>
                <Combobox
                  options={locations.options}
                  fetchNextPage={locations.fetchNextPage}
                  isFetchingNextPage={locations.isFetchingNextPage}
                  searchValue={locations.searchValue}
                  onSearchValueChange={locations.onSearchValueChange}
                  placeholder="Select location"
                  onChange={(value) => {
                    setValue("shipping_option_id", "", {
                      shouldDirty: true,
                      shouldTouch: true,
                    })
                    onChange(value)
                  }}
                  {...field}
                />
              </Form.Control>
            </div>
          </Form.Item>
        )
      }}
    />
  )
}

type ShippingOptionFieldProps = {
  shippingProfileId: string
  preview: HttpTypes.AdminOrderPreview
  control: Control<z.infer<typeof shippingMethodSchema>>
}

const ShippingOptionField = ({
  shippingProfileId,
  preview,
  control,
}: ShippingOptionFieldProps) => {
  const locationId = useWatch({ control, name: "location_id" })

  const shippingOptions = useComboboxData({
    queryKey: ["shipping_options", locationId, shippingProfileId],
    queryFn: async (params) => {
      return await sdk.admin.shippingOption.list({
        ...params,
        stock_location_id: locationId,
        shipping_profile_id: shippingProfileId,
      })
    },
    getOptions: (data) => {
      return data.shipping_options
        .map((option) => {
          // The API does not support filtering out return shipping options,
          // so we need to do it client side for now.
          if (
            option.rules?.find(
              (r) => r.attribute === "is_return" && r.value === "true"
            )
          ) {
            return undefined
          }

          return {
            label: option.name,
            value: option.id,
          }
        })
        .filter(Boolean) as { label: string; value: string }[]
    },
    enabled: !!locationId && !!shippingProfileId,
    defaultValue: preview.shipping_methods[0]?.shipping_option_id || undefined,
  })

  const tooltipContent =
    !locationId && !shippingProfileId
      ? "Choose a location and shipping profile first."
      : !locationId
      ? "Choose a location first."
      : "Choose a shipping profile first."

  return (
    <Form.Field
      control={control}
      name="shipping_option_id"
      render={({ field }) => {
        return (
          <Form.Item>
            <div className="grid grid-cols-2 gap-x-3">
              <div className="flex flex-col">
                <Form.Label>Shipping option</Form.Label>
                <Form.Hint>Choose the shipping option to use.</Form.Hint>
              </div>
              <ConditionalTooltip
                content={tooltipContent}
                showTooltip={!locationId || !shippingProfileId}
              >
                <div>
                  <Form.Control>
                    <Combobox
                      options={shippingOptions.options}
                      fetchNextPage={shippingOptions.fetchNextPage}
                      isFetchingNextPage={shippingOptions.isFetchingNextPage}
                      searchValue={shippingOptions.searchValue}
                      onSearchValueChange={shippingOptions.onSearchValueChange}
                      placeholder="Select shipping option"
                      {...field}
                      disabled={!locationId || !shippingProfileId}
                    />
                  </Form.Control>
                </div>
              </ConditionalTooltip>
            </div>
          </Form.Item>
        )
      }}
    />
  )
}

interface CustomAmountFieldProps {
  control: Control<z.infer<typeof shippingMethodSchema>>
  currencyCode: string
}

const CustomAmountField = ({
  control,
  currencyCode,
}: CustomAmountFieldProps) => {
  return (
    <Form.Field
      control={control}
      name="custom_amount"
      render={({ field: { onChange, ...field } }) => {
        return (
          <div className="grid grid-cols-2 gap-x-3">
            <div className="flex flex-col">
              <Form.Label optional>Custom amount</Form.Label>
              <Form.Hint>
                Set a custom amount for the shipping option.
              </Form.Hint>
            </div>
            <Form.Control>
              <CurrencyInput
                {...field}
                onValueChange={(value) => onChange(value)}
                symbol={getNativeSymbol(currencyCode)}
                code={currencyCode}
              />
            </Form.Control>
          </div>
        )
      }}
    />
  )
}

export default Shipping
