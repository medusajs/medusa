import {
  useAdminCustomers,
  useAdminDiscounts,
  useAdminOrders,
  useAdminProducts,
} from "medusa-react"
import React from "react"
import { useDebounce } from "../../../hooks/use-debounce"
import Spinner from "../../atoms/spinner"
import Input from "../../atoms/text-input"
import SearchIcon from "../../fundamentals/icons/search-icon"
import * as RadixDialog from "@radix-ui/react-dialog"
import CustomerResults from "./results/customer-results"
import DiscountResults from "./results/discount-results"
import KeyboardShortcuts from "./keyboard-shortcuts"
import ProductResults from "./results/product-results"
import useKeyboardNavigationList from "./use-keyboard-navigation-list"
import clsx from "clsx"
import OrderResults from "./results/order-results"
import CrossIcon from "../../fundamentals/icons/cross-icon"
import Tooltip from "../../atoms/tooltip"

const getTotal = (...lists) =>
  lists.reduce((total, list = []) => total + list.length, 0)

const SearchModal = ({ handleClose }) => {
  const [q, setQ] = React.useState("")
  const query = useDebounce(q, 500)
  const onChange = (e) => setQ(e.target.value)
  const handleClear = () => {
    setQ("")
  }

  const { orders, isFetching: isFetchingOrders } = useAdminOrders(
    {
      q: query,
      limit: 5,
      offset: 0,
    },
    { enabled: !!query, keepPreviousData: true }
  )
  const { customers, isFetching: isFetchingCustomers } = useAdminCustomers(
    {
      q: query,
      limit: 5,
      offset: 0,
    },
    { enabled: !!query, keepPreviousData: true, retry: 0 }
  )
  const { discounts, isFetching: isFetchingDiscounts } = useAdminDiscounts(
    { q: query, limit: 5, offset: 0 },
    { enabled: !!query, keepPreviousData: true }
  )
  const { products, isFetching: isFetchingProducts } = useAdminProducts(
    { q: query, limit: 5 },
    { enabled: !!query, keepPreviousData: true }
  )

  const isFetching =
    isFetchingDiscounts ||
    isFetchingCustomers ||
    isFetchingProducts ||
    isFetchingOrders

  const totalLength = getTotal(products, discounts, customers, orders)

  const { getInputProps, getLIProps, getULProps, selected } =
    useKeyboardNavigationList({
      length: totalLength,
    })

  return (
    <RadixDialog.Root open onOpenChange={handleClose}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay
          className={clsx(
            "fixed pt-[140px] pb-[100px] z-50 inset-0 backdrop-blur-sm",
            { flex: totalLength > 0 }
          )}
        >
          <RadixDialog.Content
            className={clsx(
              "max-w-[640px] flex-1 flex mx-auto bg-grey-0 rounded-rounded shadow-searchModal"
            )}
          >
            <div className="py-large flex-1 flex flex-col">
              <div className="flex items-center gap-x-4 pb-large border-solid px-xlarge border-b border-grey-20">
                <SearchIcon className="text-grey-40" />
                <Input
                  className="flex-1"
                  onChange={onChange}
                  value={q}
                  placeholder="Search typing to search..."
                  {...getInputProps()}
                />
                <Tooltip
                  className="bg-grey-0"
                  onClick={handleClear}
                  content="Clear search"
                >
                  <CrossIcon className="flex text-grey-50" />
                </Tooltip>
              </div>
              <KeyboardShortcuts className="mt-xlarge px-xlarge flex items-center gap-x-3 text-grey-40 inter-small-regular" />
              {totalLength > 0 ? (
                <ul
                  {...getULProps()}
                  className="flex-1 overflow-y-auto mt-large px-xlarge"
                >
                  {isFetching ? (
                    <div className="w-full pt-2xlarge flex items-center justify-center">
                      <Spinner size={"large"} variant={"secondary"} />
                    </div>
                  ) : (
                    <>
                      <div>
                        <OrderResults
                          orders={orders}
                          offset={0}
                          getLIProps={getLIProps}
                          selected={selected}
                        />
                      </div>

                      <div className="mt-xlarge">
                        <CustomerResults
                          customers={customers}
                          offset={orders?.length || 0}
                          getLIProps={getLIProps}
                          selected={selected}
                        />
                      </div>

                      <div className="mt-xlarge">
                        <DiscountResults
                          discounts={discounts}
                          offset={customers?.length || 0}
                          getLIProps={getLIProps}
                          selected={selected}
                        />
                      </div>

                      <div className="mt-xlarge">
                        <ProductResults
                          products={products}
                          offset={getTotal(customers, discounts)}
                          getLIProps={getLIProps}
                          selected={selected}
                        />
                      </div>
                    </>
                  )}
                </ul>
              ) : null}
            </div>
          </RadixDialog.Content>
        </RadixDialog.Overlay>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  )
}

export default SearchModal
