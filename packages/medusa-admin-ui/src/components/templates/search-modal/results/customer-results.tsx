import clsx from "clsx"
import React from "react"
import SectionCollapsible from "../section-collapsible"
import { useAdminCustomers } from "medusa-react"
import useKeyboardNavigationList from "../use-keyboard-navigation-list"
import Avatar from "../../../atoms/avatar"
import { Link } from "react-router-dom"

type CustomerResultsProps = {
  customers: ReturnType<typeof useAdminCustomers>["customers"]
  getLIProps: ReturnType<typeof useKeyboardNavigationList>["getLIProps"]
  offset: number
  selected: number
}

const CustomerResults = ({
  customers = [],
  getLIProps,
  offset,
  selected,
}: CustomerResultsProps) => {
  return customers.length > 0 ? (
    <SectionCollapsible title={"Customers"} length={customers?.length || 0}>
      <div className="mt-large">
        <div className="flex flex-col">
          {customers?.map((customer, index) => (
            <li
              {...getLIProps({
                index: offset + index,
              })}
              className={clsx(
                "px-base group py-1.5 focus:bg-grey-5 rounded-rounded",
                { "bg-grey-5": selected === offset + index }
              )}
            >
              <Link
                to={`/a/customers/${customer.id}`}
                className="py-1.5 flex items-center rounded-rounded justify-between"
              >
                <div className="flex items-center gap-x-3">
                  <div className="w-[20px] h-[20px] shrink-0">
                    <Avatar user={customer} />
                  </div>
                  <p className="inter-small-regular text-grey-90">
                    {customer?.first_name
                      ? `${customer?.first_name} ${customer?.last_name}`
                      : customer.email}
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

export default CustomerResults
