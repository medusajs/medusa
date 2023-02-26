import * as RadixCollapsible from "@radix-ui/react-collapsible"
import * as RadixPopover from "@radix-ui/react-popover"
import clsx from "clsx"
import moment from "moment"
import { useEffect, useMemo, useState } from "react"
import { DateFilters } from "../../../utils/filters"
import { addHours, atMidnight, dateToUnixTimestamp } from "../../../utils/time"
import { CalendarComponent } from "../../atoms/date-picker/date-picker"
import Spinner from "../../atoms/spinner"
import ArrowRightIcon from "../../fundamentals/icons/arrow-right-icon"
import CheckIcon from "../../fundamentals/icons/check-icon"
import ChevronUpIcon from "../../fundamentals/icons/chevron-up"
import InputField from "../input"

const DAY_IN_SECONDS = 86400

const FilterDropdownItem = ({
  filterTitle,
  options,
  filters,
  open,
  setFilter,
  isLoading,
  hasMore,
  hasPrev,
  onShowNext,
  onShowPrev,
}) => {
  const prefilled = useMemo(() => {
    try {
      const toReturn = filters.reduce((acc, f) => {
        acc[f] = true
        return acc
      }, {})
      return toReturn
    } catch (e) {
      return {}
    }
  }, [filters])

  const [checked, setChecked] = useState(prefilled)

  const handlePrev = () => {
    if (onShowPrev) {
      onShowPrev()
    }
  }

  const handleNext = () => {
    if (onShowNext) {
      onShowNext()
    }
  }

  useEffect(() => {
    if (!open) {
      setChecked({})
    }
  }, [open])

  const onCheck = (filter) => {
    const checkedState = checked

    if (!checkedState[filter]) {
      checkedState[filter] = true
    } else {
      checkedState[filter] = false
    }

    const newFilter = Object.entries(checkedState).reduce(
      (acc, [key, value]) => {
        if (value === true) {
          acc.push(key)
        }
        return acc
      },
      []
    )

    setChecked(checkedState)

    setFilter({ open: open, filter: newFilter })
  }

  return (
    <div
      className={clsx("w-full cursor-pointer", {
        "inter-small-semibold": open,
        "inter-small-regular": !open,
      })}
    >
      <RadixCollapsible.Root
        className="w-full"
        open={open}
        onOpenChange={(open) => setFilter({ filter: filters, open })}
      >
        <RadixCollapsible.Trigger
          className={clsx(
            "py-1.5 px-3 flex w-full items-center hover:bg-grey-5 rounded justify-between",
            {
              "inter-small-semibold": open,
              "inter-small-regular": !open,
            }
          )}
        >
          <div className="flex items-center">
            <div
              className={`w-5 h-5 flex justify-center text-grey-0 border-grey-30 border rounded-base ${
                open && "bg-violet-60"
              }`}
            >
              <span className="self-center">
                {open && <CheckIcon size={16} />}
              </span>
            </div>
            <input
              id={filterTitle}
              className="hidden"
              checked={open}
              readOnly
              type="checkbox"
            />
            <span className="ml-2">{filterTitle}</span>
          </div>
          {open && (
            <span className="text-grey-50 self-end">
              <ChevronUpIcon size={20} />
            </span>
          )}
        </RadixCollapsible.Trigger>
        <RadixCollapsible.Content className="w-full">
          {hasPrev && (
            <div className="py-2 pl-6 flex">
              <button
                onClick={handlePrev}
                className="font-semibold hover:text-violet-60 text-grey-90"
              >
                Back
              </button>
            </div>
          )}
          {isLoading ? (
            <div className="py-1 flex justify-center items-center">
              <Spinner size={"large"} variant={"secondary"} />
            </div>
          ) : filterTitle === "Date" ? (
            <DateFilter
              options={options}
              open={open}
              setFilter={setFilter}
              existingDate={filters}
              filterTitle={filterTitle}
            />
          ) : (
            options.map((el, i) => {
              let value: string
              let label: string

              if (typeof el === "string") {
                value = el
                label = el
              } else {
                value = el.value
                label = el.label
              }

              return (
                <div
                  className={clsx(
                    "w-full flex hover:bg-grey-20 my-1 py-1.5 pl-6 items-center rounded",
                    {
                      "inter-small-semibold": checked[value],
                      "inter-small-regular": !checked[value],
                    }
                  )}
                  key={i}
                  onClick={() => onCheck(value)}
                >
                  <div
                    className={`w-5 h-5 flex justify-center text-grey-0 border-grey-30 border mr-2 rounded-base ${
                      checked[value] === true && "bg-violet-60"
                    }`}
                  >
                    <span className="self-center">
                      {checked[value] === true && <CheckIcon size={16} />}
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    className="hidden"
                    id={value}
                    name={label}
                    value={value}
                    checked={checked[value] === true}
                    readOnly
                    style={{ marginRight: "5px" }}
                  />
                  {label}
                </div>
              )
            })
          )}
          {hasMore && (
            <div className="py-2 pl-6 flex">
              <button
                onClick={handleNext}
                className="font-semibold hover:text-violet-60 text-grey-90"
              >
                Show more
              </button>
            </div>
          )}
        </RadixCollapsible.Content>
      </RadixCollapsible.Root>
    </div>
  )
}

export default FilterDropdownItem

const parseDateFilter = (filter) => {
  if (!filter) {
    return {}
  }
  const dateEntries = Object.entries(filter)

  /**
   * From a query object we need to figure out which date filter that is
   * being used of the following:
   *
   * InTheLast: { gt: "x|[days|months]" }
   * OlderThan: { lt: "x|[days|months]" }
   * Between: { lt: [ts], gt: [ts] }
   * After: { gt: [ts] }
   * Before: { lt: [ts] },
   * EqualTo: { lt: [midnight], gt: [morning] }
   *
   */

  const flags = {
    sawGt: false,
    sawLt: false,
    sawGtRelative: false,
    sawLtRelative: false,
  }

  for (const [key, value] of dateEntries) {
    switch (key) {
      case "gt": {
        flags.sawGt = true
        flags.sawGtRelative = value.includes("|")
        break
      }
      case "lt": {
        flags.sawLt = true
        flags.sawLtRelative = value.includes("|")
        break
      }
      default: {
        break
      }
    }
  }

  if (flags.sawGt && flags.sawGtRelative) {
    const [amount, daysMonths] = filter.gt.split("|")
    return {
      filterType: DateFilters.InTheLast,
      daysMonthsValue: daysMonths,
      relativeAmount: amount,
      value: null,
    }
  }

  if (flags.sawLt && flags.sawLtRelative) {
    const [amount, daysMonths] = filter.lt.split("|")
    return {
      filterType: DateFilters.OlderThan,
      daysMonthsValue: daysMonths,
      relativeAmount: amount,
      value: null,
    }
  }

  if (flags.sawLt && flags.sawGt) {
    const startDate = filter.gt
    const endDate = filter.lt

    if (endDate - startDate === DAY_IN_SECONDS) {
      return {
        filterType: DateFilters.EqualTo,
        value: moment.unix(startDate).toDate(),
      }
    }
  }

  if (flags.sawLt) {
    const endDate = filter.lt
    return {
      filterType: DateFilters.Before,
      value: moment.unix(endDate).toDate(),
    }
  }

  if (flags.sawGt) {
    const startDate = filter.gt
    return {
      filterType: DateFilters.After,
      value: moment.unix(startDate).toDate(),
    }
  }

  return {}
}

const DateFilter = ({
  options,
  open,
  setFilter,
  existingDate,
  existingFilter,
}) => {
  const initialVals = useMemo(() => {
    const parsed = parseDateFilter(existingDate)
    return {
      filterType: options[0],
      value: null,
      relativeAmount: undefined,
      daysMonthsValue: "days",
      ...parsed,
    }
  }, [existingDate])

  const [currentFilter, setCurrentFilter] = useState(initialVals.filterType)
  const [relativeAmount, setRelativeAmount] = useState(
    initialVals.relativeAmount
  )
  const [daysMonthsValue, setDaysMonthsValue] = useState(
    initialVals.daysMonthsValue
  )
  const [startDate, setStartDate] = useState(initialVals.value)

  useEffect(() => {
    switch (currentFilter) {
      case DateFilters.InTheLast:
      case DateFilters.OlderThan:
        setFilter({
          open: true,
          filter: handleDateFormat(relativeAmount),
        })
        break
      case DateFilters.EqualTo:
        setFilter({
          open: true,
          filter: handleDateFormat(startDate),
        })
        break
      default:
        setFilter({
          open: true,
          filter: handleDateFormat(startDate),
        })
    }
  }, [currentFilter, relativeAmount, daysMonthsValue, startDate])

  const handleDateFormat = (value: string | null) => {
    switch (currentFilter) {
      case DateFilters.InTheLast: {
        // Relative date
        return { gt: `${value}|${daysMonthsValue}` }
      }

      case DateFilters.OlderThan: {
        // Relative date:
        return { lt: `${value}|${daysMonthsValue}` }
      }

      case DateFilters.EqualTo: {
        const momentToSet = atMidnight(value)
        if (momentToSet) {
          const day = dateToUnixTimestamp(momentToSet.toDate())
          const nextDay = dateToUnixTimestamp(
            addHours(momentToSet, 24).toDate()
          )
          return { gt: day, lt: nextDay }
        } else {
          return {}
        }
      }

      case DateFilters.After: {
        const momentToSet = atMidnight(value)
        if (momentToSet) {
          return { gt: dateToUnixTimestamp(momentToSet.toDate()) }
        } else {
          return {}
        }
      }

      case DateFilters.Before: {
        const momentToSet = atMidnight(value)
        if (momentToSet) {
          return { lt: dateToUnixTimestamp(momentToSet.toDate()) }
        } else {
          return {}
        }
      }

      default: {
        return {}
      }
    }
  }

  const handleFilterContent = () => {
    switch (currentFilter) {
      case DateFilters.InTheLast:
      case DateFilters.OlderThan:
        return (
          <div className="flex flex-col w-full">
            <InputField
              className="pt-0 pb-1"
              type="number"
              placeholder="2"
              value={relativeAmount}
              onChange={(e) => {
                setRelativeAmount(e.target.value)
              }}
            />
            <RightPopover
              trigger={
                <div className="flex w-full items-center justify-between bg-grey-5 border border-grey-20 rounded inter-small-semibold text-grey-90 px-3 py-1.5">
                  <label>{daysMonthsValue}</label>
                  <span className="text-grey-50">
                    <ArrowRightIcon size={16} />
                  </span>
                </div>
              }
            >
              <PopoverOptions
                options={["days", "months"]}
                onClick={setDaysMonthsValue}
                selectedItem={daysMonthsValue}
              />
            </RightPopover>
          </div>
        )
      case DateFilters.EqualTo:
      case DateFilters.After:
      case DateFilters.Before:
        return (
          <div className="flex flex-col w-full">
            <RightPopover
              trigger={
                <div className="flex w-full items-center justify-between bg-grey-5 border border-grey-20 rounded inter-small-semibold text-grey-90 px-3 py-1.5">
                  <label>
                    {startDate ? moment(startDate).format("MM.DD.YYYY") : "-"}
                  </label>
                  <span className="text-grey-50">
                    <ArrowRightIcon size={16} />
                  </span>
                </div>
              }
            >
              <CalendarComponent
                date={startDate}
                onChange={(date) => {
                  setStartDate(date)
                }}
              />
            </RightPopover>
          </div>
        )
    }
  }
  return (
    <div className="pl-9">
      <RightPopover
        trigger={
          <div className="flex w-full items-center justify-between bg-grey-5 border border-grey-20 rounded inter-small-semibold text-grey-90 px-3 py-1.5">
            <label>{currentFilter}</label>
            <span className="text-grey-50">
              <ArrowRightIcon size={16} />
            </span>
          </div>
        }
      >
        <PopoverOptions
          options={options}
          onClick={(filter) => setCurrentFilter(filter)}
          selectedItem={currentFilter}
        />
      </RightPopover>
      {currentFilter && <div className="w-full">{handleFilterContent()}</div>}
    </div>
  )
}

const PopoverOptions = ({ options, onClick, selectedItem }) => {
  return (
    <>
      {options.map((item) => (
        <div
          onClick={(e) => {
            e.stopPropagation()
            onClick(item)
          }}
          className={clsx(
            "px-3 py-1.5 my-1 flex items-center rounded hover:bg-grey-5 cursor-pointer",
            {
              "inter-small-semibold": item === selectedItem,
              "inter-small-regular": item !== selectedItem,
            }
          )}
        >
          <div
            className={clsx(
              "rounded-full flex items-center justify-center mr-2 w-4 h-4",
              {
                "border-2 border-violet-60": item === selectedItem,
                "border border-grey-30 ": item !== selectedItem,
              }
            )}
          >
            {item === selectedItem && (
              <div className="rounded-full w-2 h-2 bg-violet-60" />
            )}
          </div>
          {item}
        </div>
      ))}
    </>
  )
}

const RightPopover = ({ trigger, children }) => (
  <RadixPopover.Root>
    <RadixPopover.Trigger className="w-full my-1">
      {trigger}
    </RadixPopover.Trigger>
    <RadixPopover.Content
      side="right"
      align="start"
      alignOffset={-8}
      sideOffset={20}
      className="flex flex-col bg-grey-0 rounded-rounded shadow-dropdown p-2 top-2/4"
    >
      {children}
    </RadixPopover.Content>
  </RadixPopover.Root>
)
