import React, { FC } from "react"
import { useAdminOrder } from "medusa-react"
import Spinner from "../../../components/atoms/spinner"
import Breadcrumb from "../../../components/molecules/breadcrumb"
import { useBasePath } from "../../../utils/routePathing"
import { ShippingLabelForm } from "./components/shipping-label-form"
import { useGetLocations } from "../../../hooks/admin/locations"
import { useParams } from "react-router-dom"

export interface ShippingLabelDetailsProps {}

export const ShippingLabelDetails: FC<ShippingLabelDetailsProps> = () => {
  const basePath = useBasePath()
  const { order_id } = useParams<{ order_id: string }>()
  const { order, ...orderQuery } = useAdminOrder(order_id!)
  const { locations, ...locationsQuery } = useGetLocations(
    order?.vendor_id || ""
  )
  const [location] = locations || []
  const isLoading = orderQuery.isLoading || locationsQuery.isLoading

  return (
    <>
      {(isLoading || !order) && (
        <Spinner size={"large"} variant={"secondary"} />
      )}

      {!isLoading && order && (
        <Breadcrumb
          currentPage={"Create Shipping Label"}
          previousBreadcrumb={"Order Details"}
          previousRoute={`${basePath}/orders/${order_id}`}
        />
      )}

      {!isLoading && order && (
        <ShippingLabelForm order={order} location={location} />
      )}
    </>
  )
}
