import clsx from "clsx"
import SectionCollapsible from "../section-collapsible"
import { useAdminDiscounts } from "medusa-react"
import useKeyboardNavigationList from "../use-keyboard-navigation-list"
import { Link } from "react-router-dom"

type DiscountResultsProps = {
  discounts: ReturnType<typeof useAdminDiscounts>["discounts"]
  getLIProps: ReturnType<typeof useKeyboardNavigationList>["getLIProps"]
  offset: number
  selected: number
}

const DiscountResults = ({
  discounts = [],
  getLIProps,
  offset,
  selected,
}: DiscountResultsProps) => {
  return discounts.length > 0 ? (
    <SectionCollapsible title={"Discounts"} length={discounts?.length || 0}>
      <div className="mt-large">
        <div className="flex flex-col">
          {discounts?.map((discount, index) => (
            <li
              {...getLIProps({ index: offset + index })}
              className={clsx(
                "px-base focus:bg-grey-5 rounded-rounded group py-1.5",
                { "bg-grey-5": selected === offset + index }
              )}
            >
              <Link
                to={`/a/discounts/${discount.id}`}
                className="rounded-rounded flex items-center justify-between py-1.5"
              >
                <div className="flex items-center gap-x-3">
                  <div className="bg-grey-10 rounded-rounded py-0.5 px-2">
                    <span className="inter-small-regular">{discount.code}</span>
                  </div>
                  <p className="inter-small-regular text-grey-90">
                    {discount.rule.description}
                  </p>
                </div>
                <span
                  className={clsx(
                    "text-grey-40 inter-small-regular group-focus:visible",
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

export default DiscountResults
