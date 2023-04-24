import React, { FC } from "react"
import { useAdminOrder } from "medusa-react"
import Spinner from "../../../components/atoms/spinner"
import Breadcrumb from "../../../components/molecules/breadcrumb"
import { useBasePath } from "../../../utils/routePathing"
import { ManualFulfillmentForm } from "./components/fulfillment-form"
import { useParams } from '../../../compat/reach-router-compat'



export const ManualFulfillmentDetails: FC = ({
}) => {

  const {order_id} = useParams();
  
  const basePath = useBasePath()
  const { order, ...orderQuery } = useAdminOrder(order_id)

  const isLoading = orderQuery.isLoading

  return (
    <>
      {(isLoading || !order) && (
        <Spinner size={"large"} variant={"secondary"} />
      )}

      {!isLoading && order && (
        <Breadcrumb
          currentPage={"Manually Fulfill Items"}
          previousBreadcrumb={"Order Details"}
          previousRoute={`${basePath}/orders/${order_id}`}
        />
      )}

      {!isLoading && order && <ManualFulfillmentForm order={order} />}
    </>
  )
}
