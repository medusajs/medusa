import clsx from "clsx"
import React from "react"
import SectionCollapsible from "../section-collapsible"
import { useAdminOrders } from "medusa-react"
import useKeyboardNavigationList from "../use-keyboard-navigation-list"
import { Link } from "react-router-dom"

type OrderResultsProps = {
  orders: ReturnType<typeof useAdminOrders>["orders"]
  getLIProps: ReturnType<typeof useKeyboardNavigationList>["getLIProps"]
  offset: number
  selected: number
}

const OrderResults = ({
  orders = [],
  getLIProps,
  offset,
  selected,
}: OrderResultsProps) => {
  return orders.length > 0 ? (
    <SectionCollapsible title={"Orders"} length={orders?.length || 0}>
      <div className="mt-large">
        <div className="flex flex-col">
          {orders?.map((order, index) => (
            <li
              {...getLIProps({ index: offset + index })}
              className={clsx("py-1.5 group focus:bg-grey-5 rounded-rounded", {
                "bg-grey-5": selected === offset + index,
              })}
            >
              <Link
                to={`/a/orders/${order.id}`}
                className="px-base py-1.5 flex items-center rounded-rounded justify-between"
              >
                <div className="flex items-center gap-x-3">
                  <span className="inter-small-semibold">
                    #{order.display_id}
                  </span>
                  <p className="inter-small-regular text-grey-90">
                    {order.email}
                  </p>
                </div>
                <span
                  className={clsx(
                    "group-focus:visible text-grey-40 inter-small-regular",
                    {
                      invisible: selected !== offset + index,
                    }
                  )}
                >
                  Jump to...
                </span>
              </Link>
            </li>
          ))}
        </div>
      </div>
    </SectionCollapsible>
  ) : null
}

export default OrderResults
