import React, { useState } from "react"
import {
  AdminGetVariantsVariantInventoryRes,
  AdminPostReturnsReturnReceiveReq,
  InventoryLevelDTO,
  LineItem,
  Order,
  Return,
  StockLocationDTO,
} from "@medusajs/medusa"
import { useAdminOrder, useAdminReceiveReturn, useMedusa } from "medusa-react"
import { useEffect, useMemo } from "react"
import { useForm, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"
import Button from "../../../../components/fundamentals/button"
import Modal from "../../../../components/molecules/modal"
import useNotification from "../../../../hooks/use-notification"
import { useFeatureFlag } from "../../../../providers/feature-flag-provider"
import { getErrorMessage } from "../../../../utils/error-messages"
import { nestedForm } from "../../../../utils/nested-form"
import { ItemsToReceiveFormType } from "../../components/items-to-receive-form"
import { ItemsToReceiveForm } from "../../components/items-to-receive-form/items-to-receive-form"
import { RefundAmountFormType } from "../../components/refund-amount-form"
import { ReceiveReturnSummary } from "../../components/rma-summaries/receive-return-summary"
import { getDefaultReceiveReturnValues } from "../utils/get-default-values"
import useOrdersExpandParam from "../utils/use-admin-expand-paramter"
import { useAdminStockLocations } from "medusa-react"
import Select from "../../../../components/molecules/select/next-select/select"
import Spinner from "../../../../components/atoms/spinner"

type Props = {
  order: Order
  returnRequest: Return
  onClose: () => void
}

export type ReceiveReturnFormType = {
  receive_items: ItemsToReceiveFormType
  refund_amount: RefundAmountFormType
}

export const ReceiveReturnMenu = ({ order, returnRequest, onClose }: Props) => {
  const { client } = useMedusa()
  const { t } = useTranslation()
  const { isFeatureEnabled } = useFeatureFlag()
  const isLocationFulfillmentEnabled =
    isFeatureEnabled("inventoryService") &&
    isFeatureEnabled("stockLocationService")

  const { mutate, isLoading } = useAdminReceiveReturn(returnRequest.id)
  const { orderRelations } = useOrdersExpandParam()
  const { refetch } = useAdminOrder(order.id, {
    expand: orderRelations,
  })

  const form = useForm<ReceiveReturnFormType>({
    defaultValues: getDefaultReceiveReturnValues(order, returnRequest),
    reValidateMode: "onBlur",
  })

  const {
    handleSubmit,
    reset,
    setError,
    formState: { isDirty },
  } = form

  const {
    stock_locations,
    refetch: refetchLocations,
    isLoading: isLoadingLocations,
  } = useAdminStockLocations(
    {},
    {
      enabled: isLocationFulfillmentEnabled,
    }
  )

  React.useEffect(() => {
    if (isLocationFulfillmentEnabled) {
      refetchLocations()
    }
  }, [isLocationFulfillmentEnabled, refetchLocations])

  const [selectedLocation, setSelectedLocation] = React.useState<{
    value: string
    label: string
  } | null>(null)

  const itemMap = React.useMemo(() => {
    return new Map<string, LineItem>(order.items.map((i) => [i.id, i]))
  }, [order.items])

  const [inventoryMap, setInventoryMap] = useState<
    Map<string, InventoryLevelDTO[]>
  >(new Map())

  React.useEffect(() => {
    const getInventoryMap = async () => {
      if (!returnRequest.items?.length || !isLocationFulfillmentEnabled) {
        return new Map()
      }
      const itemInventoryList = await Promise.all(
        returnRequest.items.map(async (item) => {
          const orderItem = itemMap.get(item.item_id)
          if (!orderItem?.variant_id) {
            return undefined
          }
          return await client.admin.variants.getInventory(orderItem.variant_id)
        })
      )

      return new Map(
        itemInventoryList
          .filter((it) => !!it)
          .map((item) => {
            const { variant } = item as AdminGetVariantsVariantInventoryRes
            return [variant.id, variant.inventory[0].location_levels]
          })
      )
    }

    getInventoryMap().then((map) => {
      setInventoryMap(map)
    })
  }, [
    client.admin.variants,
    isLocationFulfillmentEnabled,
    itemMap,
    returnRequest.items,
  ])

  const { items: receiveItems } = useWatch({
    control: form.control,
    name: "receive_items",
  })

  const noOfReturnItems = receiveItems.filter((item) => item.receive).length

  const locationsHasInventoryLevels = React.useMemo(() => {
    if (!noOfReturnItems) {
      return true
    }

    return receiveItems
      .map((returnItem) => {
        const item = itemMap.get(returnItem.item_id)
        if (!item?.variant_id || !returnItem.receive) {
          return true
        }
        const hasInventoryLevel = inventoryMap
          .get(item.variant_id)
          ?.find((l) => l.location_id === selectedLocation?.value)

        if (!hasInventoryLevel && selectedLocation?.value) {
          return false
        }
        return true
      })
      .every(Boolean)
  }, [receiveItems, itemMap, noOfReturnItems, inventoryMap, selectedLocation])

  useEffect(() => {
    if (isLocationFulfillmentEnabled && stock_locations?.length) {
      const location = stock_locations.find(
        (sl: StockLocationDTO) => sl.id === returnRequest.location_id
      )
      if (location) {
        setSelectedLocation({
          value: location.id,
          label: location.name,
        })
      }
    }
  }, [isLocationFulfillmentEnabled, stock_locations, returnRequest.location_id])

  /**
   * If the return was refunded as part of a refund claim, we do not allow the user to
   * specify a refund amount, or want to display a summary.
   */
  const isRefundedClaim = useMemo(() => {
    if (returnRequest.claim_order_id) {
      const claim = order.claims.find(
        (c) => c.id === returnRequest.claim_order_id
      )
      if (!claim) {
        return false
      }

      return claim.payment_status === "refunded"
    }

    return false
  }, [order.claims, returnRequest.claim_order_id])

  /**
   * If the return was created as a result of a swap, we do not allow the user to
   * specify a refund amount, or want to display a summary.
   */
  const isSwapOrRefundedClaim = useMemo(() => {
    return isRefundedClaim || Boolean(returnRequest.swap_id)
  }, [isRefundedClaim, returnRequest.swap_id])

  const notification = useNotification()

  useEffect(() => {
    reset(getDefaultReceiveReturnValues(order, returnRequest))
  }, [order, returnRequest, reset])

  const onSubmit = handleSubmit((data) => {
    if (data.receive_items.items.filter((it) => it.receive).length === 0) {
      setError("receive_items.items", {
        type: "manual",
        message: t(
          "receive-return-please-select-at-least-one-item-to-receive",
          "Please select at least one item to receive"
        ),
      })

      return
    }

    let refundAmount: number | undefined = undefined

    /**
     * If the return was not refunded as part of a refund claim, or was not created as a
     * result of a swap, we allow the user to specify a refund amount.
     */
    if (data.refund_amount?.amount !== undefined && !isSwapOrRefundedClaim) {
      refundAmount = data.refund_amount.amount
    }

    /**
     * If the return was refunded as part of a refund claim, we set the refund amount to 0.
     * This is a workaround to ensure that the refund is not issued twice.
     */
    if (isRefundedClaim) {
      refundAmount = 0
    }

    const toCreate: AdminPostReturnsReturnReceiveReq = {
      items: data.receive_items.items.map((i) => ({
        item_id: i.item_id,
        quantity: i.quantity,
      })),
      refund: refundAmount,
    }

    if (selectedLocation && isLocationFulfillmentEnabled) {
      toCreate.location_id = selectedLocation.value
    }

    mutate(toCreate, {
      onSuccess: () => {
        notification(
          t(
            "receive-return-successfully-received-return",
            "Successfully received return"
          ),
          t(
            "receive-return-received-return-for-order",
            "Received return for order #{{display_id}}",
            {
              display_id: order.display_id,
            }
          ),
          "success"
        )

        // We need to refetch the order to get the updated state
        refetch()

        onClose()
      },
      onError: (error) => {
        notification(
          t(
            "receive-return-failed-to-receive-return",
            "Failed to receive return"
          ),
          getErrorMessage(error),
          "error"
        )
      },
    })
  })

  return (
    <Modal handleClose={onClose} open={true}>
      <Modal.Body>
        <Modal.Header handleClose={onClose}>
          <h1 className="inter-xlarge-semibold">
            {t("receive-return-receive-return", "Receive Return")}
          </h1>
        </Modal.Header>
        <form onSubmit={onSubmit}>
          <Modal.Content>
            <div className="gap-y-large flex flex-col">
              <ItemsToReceiveForm
                order={order}
                form={nestedForm(form, "receive_items")}
              />

              {isLocationFulfillmentEnabled && (
                <div className="mb-8">
                  <h3 className="inter-base-semibold ">
                    {t("receive-return-location", "Location")}
                  </h3>
                  <p className="inter-base-regular text-grey-50">
                    {t(
                      "receive-return-choose-location",
                      "Choose which location you want to return the items to."
                    )}
                  </p>
                  {isLoadingLocations ? (
                    <Spinner />
                  ) : (
                    <Select
                      className="mt-2"
                      placeholder={t(
                        "receive-return-select-location-to-return-to",
                        "Select Location to Return to"
                      )}
                      value={selectedLocation}
                      isMulti={false}
                      name={"location_id"}
                      errors={
                        locationsHasInventoryLevels
                          ? {}
                          : {
                              location_id: {
                                message: t(
                                  "receive-return-no-inventory-levels-exist-for-the-items-at-the-selected-location",
                                  "No inventory levels exist for the items at the selected location"
                                ),
                              },
                            }
                      }
                      onChange={setSelectedLocation}
                      options={
                        stock_locations?.map((sl: StockLocationDTO) => ({
                          label: sl.name,
                          value: sl.id,
                        })) || []
                      }
                    />
                  )}
                </div>
              )}

              {!isSwapOrRefundedClaim && (
                <ReceiveReturnSummary
                  form={form}
                  order={order}
                  returnRequest={returnRequest}
                />
              )}
            </div>
          </Modal.Content>
          <Modal.Footer>
            <div className="gap-x-xsmall flex w-full items-center justify-end">
              <Button size="small" variant="secondary">
                {t("receive-return-cancel", "Cancel")}
              </Button>
              <Button
                size="small"
                variant="primary"
                disabled={!isDirty || isLoading || !locationsHasInventoryLevels}
                loading={isLoading}
              >
                {t("receive-return-save-and-close", "Save and close")}
              </Button>
            </div>
          </Modal.Footer>
        </form>
      </Modal.Body>
    </Modal>
  )
}
