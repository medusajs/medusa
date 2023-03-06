import clsx from "clsx"
import React from "react"
import SectionCollapsible from "../section-collapsible"
import { useAdminProducts } from "medusa-react"
import useKeyboardNavigationList from "../use-keyboard-navigation-list"
import { Link } from "react-router-dom"

type ProductResultsProps = {
  products: ReturnType<typeof useAdminProducts>["products"]
  getLIProps: ReturnType<typeof useKeyboardNavigationList>["getLIProps"]
  offset: number
  selected: number
}

const ProductResults = ({
  products = [],
  getLIProps,
  offset,
  selected,
}: ProductResultsProps) => {
  return products.length > 0 ? (
    <SectionCollapsible title={"Products"} length={products.length || 0}>
      <div className="mt-large">
        <div className="flex flex-col">
          {products?.slice(0, 5).map((product, index) => (
            <li
              {...getLIProps({
                index: offset + index,
              })}
              className={clsx(
                "px-base py-1.5 group focus:bg-grey-5 rounded-rounded",
                {
                  "bg-grey-5": selected === offset + index,
                }
              )}
            >
              <Link
                to={`/a/products/${product.id}`}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-x-3">
                  <img
                    src={product.thumbnail}
                    className="h-[32px] w-[24px] object-cover rounded"
                  />
                  <p className="inter-small-regular text-grey-90">
                    {product.title}
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

export default ProductResults
