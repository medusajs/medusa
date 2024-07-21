import * as RadixCollapsible from "@radix-ui/react-collapsible"
import * as RadixPopover from "@radix-ui/react-popover"

import { DateComparisonOperator, InventoryItemDTO } from "@medusajs/types"
import React, { useEffect, useState } from "react"
import { useAdminInventoryItems, useAdminUsers, useMedusa } from "medusa-react"

import AdjustmentsIcon from "../../../../fundamentals/icons/adjustments-icon"
import Button from "../../../../fundamentals/button"
import { CalendarComponent } from "../../../../atoms/date-picker/date-picker"
import CalendarIcon from "../../../../fundamentals/icons/calendar-icon"
import CheckIcon from "../../../../fundamentals/icons/check-icon"
import CrossIcon from "../../../../fundamentals/icons/cross-icon"
import FilterDropdownContainer from "../../../../molecules/filter-dropdown/container"
import InputField from "../../../../molecules/input"
import Spinner from "../../../../atoms/spinner"
import Switch from "../../../../atoms/switch"
import TagDotIcon from "../../../../fundamentals/icons/tag-dot-icon"
import { User } from "@medusajs/medusa"
import clsx from "clsx"
import moment from "moment"
import { removeNullish } from "../../../../../utils/remove-nullish"

type PasswordlessUser = Omit<User, "password_hash">

const ReservationsFilters = ({ filters, submitFilters, clearFilters }) => {
  const [tempState, setTempState] = useState(filters)

  useEffect(() => {
    setTempState(filters)
  }, [filters])

  const onSubmit = () => {
    const { additionalFilters, ...state } = tempState
    submitFilters({
      ...removeNullish(state),
      additionalFilters: removeNullish(additionalFilters),
    })
  }

  const onClear = () => {
    clearFilters()
    tempState({ ...tempState, additionalFilters: {} })
  }

  return (
    <div className="flex gap-x-1">
      <FilterDropdownContainer
        submitFilters={onSubmit}
        clearFilters={onClear}
        triggerElement={
          <Button variant="secondary" size="small">
            <AdjustmentsIcon size={20} />
            View
          </Button>
        }
      >
        <div className="w-[320px]">
          <SearchableFilterInventoryItem
            title="Inventory item"
            value={tempState.additionalFilters.inventory_item_id}
            setFilter={(val) => {
              setTempState(({ additionalFilters, ...state }) => {
                return {
                  ...state,
                  additionalFilters: {
                    ...additionalFilters,
                    inventory_item_id: val,
                  },
                }
              })
            }}
          />
          <TextFilterItem
            title="Description"
            value={tempState.additionalFilters.description}
            options={[
              { label: "Equals", value: "equals" },
              { label: "Contains", value: "contains" },
            ]}
            setFilter={(val) => {
              setTempState((state) => {
                return {
                  ...state,
                  additionalFilters: {
                    description: val,
                  },
                }
              })
            }}
          />
          <DateFilterItem
            title="Creation date"
            value={tempState.additionalFilters.created_at}
            setFilter={(val) => {
              setTempState(({ additionalFilters, ...state }) => {
                return {
                  ...state,
                  additionalFilters: { ...additionalFilters, created_at: val },
                }
              })
            }}
          />
          <NumberFilterItem
            title="Quantity"
            value={tempState.additionalFilters.quantity}
            options={[
              { label: "Over", value: "gt" },
              { label: "Under", value: "lt" },
              { label: "Between", value: "between" },
            ]}
            setFilter={(val) => {
              setTempState(({ additionalFilters, ...state }) => {
                return {
                  ...state,
                  additionalFilters: { ...additionalFilters, quantity: val },
                }
              })
            }}
          />
          <CreatedByFilterItem
            title="Created by"
            value={tempState.additionalFilters.created_by}
            setFilter={(val) => {
              setTempState(({ additionalFilters, ...state }) => {
                return {
                  ...state,
                  additionalFilters: { ...additionalFilters, created_by: val },
                }
              })
            }}
          />
        </div>
      </FilterDropdownContainer>
    </div>
  )
}

const SearchableFilterInventoryItem = ({
  title,
  setFilter,
  value,
}: {
  title: string
  value: any
  setFilter: (newFilter: any) => void
}) => {
  const [selectedItems, setSelectedItems] = useState<Set<InventoryItemDTO>>(
    new Set()
  )
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [query, setQuery] = useState<string | undefined>()

  const { client } = useMedusa()

  useEffect(() => {
    const getSelectedItems = async (value: any) => {
      if (value?.length) {
        const { inventory_items } = await client.admin.inventoryItems.list({
          id: [...new Set(value)] as string[],
        })
        setSelectedItems(new Set(inventory_items))
      }
    }

    getSelectedItems(value)
  }, [client.admin.inventoryItems, value])

  // Debounced search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setSearchTerm(query ?? "")
    }, 400)

    return () => clearTimeout(delayDebounceFn)
  }, [query])

  const { inventory_items, isLoading } = useAdminInventoryItems(
    {
      q: searchTerm,
      limit: 7,
    },
    {
      enabled: !!searchTerm,
    }
  )

  const toggleInventoryItem = (item: InventoryItemDTO) => {
    const newState = getNewSetState(selectedItems, item)

    setSelectedItems(newState)
    setFilter([...newState].map((i) => i.id))
  }

  const selectedIds = React.useMemo(() => {
    return new Set([...selectedItems].map((i) => i.id))
  }, [selectedItems])

  const reset = () => {
    setSelectedItems(new Set())
    setFilter(undefined)
  }

  return (
    <div className={clsx("w-full border-b")}>
      <CollapsibleWrapper
        title={title}
        defaultOpen={!!value}
        onOpenChange={(open) => {
          if (!open) {
            reset()
          }
        }}
      >
        <div className="gap-y-xsmall mb-2 flex w-full flex-col pt-2">
          <InputField
            value={query}
            className="pe-1"
            prefix={
              selectedItems.size === 0 ? null : (
                <div
                  onClick={reset}
                  className="bg-grey-10 border-grey-20 text-grey-40 rounded-rounded gap-x-2xsmall me-xsmall flex cursor-pointer items-center border py-0.5 pe-1 ps-2"
                >
                  <span className="text-grey-50">{selectedItems.size}</span>
                  <CrossIcon size={16} />
                </div>
              )
            }
            placeholder={selectedItems.size ? "Items selected" : "Find items"}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-y-1 pb-2">
          {[...selectedItems].map((item, i) => {
            return (
              <InventoryItemItem
                key={`selected-item-${i}`}
                onClick={() => toggleInventoryItem(item)}
                selected={true}
                item={item}
              />
            )
          })}
          {searchTerm &&
            (isLoading ? (
              <Spinner />
            ) : (
              <>
                {inventory_items
                  ?.filter((item) => !selectedIds.has(item.id))
                  .map((item: InventoryItemDTO, i: number) => (
                    <InventoryItemItem
                      key={`item-${i}`}
                      onClick={() => toggleInventoryItem(item)}
                      selected={false}
                      item={item}
                    />
                  ))}
              </>
            ))}
        </div>
      </CollapsibleWrapper>
    </div>
  )
}

const InventoryItemItem = ({
  key,
  onClick,
  selected,
  item,
}: {
  key: string
  onClick: () => void
  selected: boolean
  item: InventoryItemDTO
}) => (
  <div
    key={key}
    onClick={onClick}
    className="hover:bg-grey-10 rounded-rounded flex items-center px-2 py-1.5"
  >
    <div className="me-2 flex h-[20px] w-[20px] items-center">
      {selected && <CheckIcon size={16} color="#111827" />}
    </div>
    <div className="inter-small-regular flex w-full items-center justify-between">
      <p className="text-grey-90">{item.title}</p>{" "}
      <p className="text-grey-50">{item.sku}</p>
    </div>
  </div>
)

const CreatedByFilterItem = ({
  title,
  setFilter,
  value,
}: {
  title: string
  value: any
  setFilter: (newFilter: any) => void
}) => {
  const [selectedUsers, setSelectedUsers] = useState<Set<PasswordlessUser>>(
    new Set()
  )
  const [searchTerm, setSearchTerm] = useState<string | undefined>()
  const [query, setQuery] = useState<string | undefined>()

  // Debounced search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setSearchTerm(query ?? "")
    }, 400)

    return () => clearTimeout(delayDebounceFn)
  }, [query])

  const { users, isLoading } = useAdminUsers({})

  const [displayUsers, setDisplayUsers] = useState<PasswordlessUser[]>([])

  useEffect(() => {
    const getSelectedItems = async (value: any) => {
      if (value && users) {
        const selectedUsers = users.filter((u) => value.includes(u.id))
        setSelectedUsers(new Set(selectedUsers))
      }
    }

    getSelectedItems(value)
  }, [value])

  useEffect(() => {
    if (searchTerm && users?.length) {
      setDisplayUsers(
        users
          .filter(
            (u) =>
              u.first_name?.toLowerCase().includes(searchTerm) ||
              u.last_name?.toLowerCase().includes(searchTerm)
          )
          .slice(0, 7)
      )
    }
  }, [searchTerm, users])

  const toggleUser = (user: PasswordlessUser) => {
    const newState = getNewSetState(selectedUsers, user)

    setSelectedUsers(newState)
    setFilter([...newState].map((u) => u.id))
  }

  const reset = () => {
    setSelectedUsers(new Set())
    setFilter(undefined)
  }

  return (
    <div className={clsx("w-full cursor-pointer")}>
      <CollapsibleWrapper
        title={title}
        defaultOpen={!!value}
        onOpenChange={(open) => {
          if (!open) {
            reset()
          }
        }}
      >
        <div className="gap-y-xsmall mb-2 flex w-full flex-col pt-2">
          <InputField
            value={query}
            placeholder="Find user"
            onChange={(e) => setQuery(e.target.value)}
            prefix={
              selectedUsers.size === 0 ? null : (
                <div
                  onClick={reset}
                  className="bg-grey-10 border-grey-20 text-grey-40 rounded-rounded gap-x-2xsmall me-xsmall flex cursor-pointer items-center border py-0.5 pe-1 ps-2"
                >
                  <span className="text-grey-50">{selectedUsers.size}</span>
                  <CrossIcon size={16} />
                </div>
              )
            }
          />
        </div>
        <div className="flex flex-col gap-y-1 pb-2">
          {[...selectedUsers].map((user, i) => {
            return (
              <CreatedByItem
                key={`selected-user-${i}`}
                onClick={() => toggleUser(user)}
                selected={true}
                user={user}
              />
            )
          })}
          {!isLoading && searchTerm && (
            <>
              {displayUsers
                ?.filter((user) => !selectedUsers.has(user))
                .map((u, i) => (
                  <CreatedByItem
                    key={`user-${i}`}
                    onClick={() => toggleUser(u)}
                    selected={false}
                    user={u}
                  />
                ))}
            </>
          )}
        </div>
      </CollapsibleWrapper>
    </div>
  )
}

const CreatedByItem = ({
  key,
  onClick,
  selected,
  user,
}: {
  key: string
  onClick: () => void
  selected: boolean
  user: PasswordlessUser
}) => {
  return (
    <div
      key={key}
      onClick={onClick}
      className="hover:bg-grey-10 inter-small-regular rounded-rounded flex items-center px-2 py-1.5"
    >
      <div className="inter-small-regular me-2 flex h-[20px] w-[20px] items-center">
        {selected && <CheckIcon size={16} color="#111827" />}
      </div>
      <div>{`${user.first_name} ${user.last_name}`}</div>
    </div>
  )
}

const TextFilterItem = ({
  title,
  setFilter,
  value,
  options,
}: {
  title: string
  value: any
  options: { value: string; label: string }[]
  setFilter: (newFilter: any) => void
}) => {
  const [fieldValue, setFieldValue] = useState(value)

  const [filterType, setFilterType] = useState<{
    value: string
    label: string
  }>(options.find((o) => !!value?.[o.value]) || options[0])

  const selectFilterType = (newFilter: { value: string; label: string }) => {
    const value = fieldValue?.[filterType.value]
    setFilterType(newFilter)
    setFieldValue({ [newFilter.value]: value })
    setFilter({ [newFilter.value]: value })
  }

  const updateFieldValue = (val: string) => {
    setFieldValue({ [filterType.value]: val })
    setFilter({ [filterType.value]: val })
  }

  return (
    <div className={clsx("w-full border-b")}>
      <CollapsibleWrapper
        title={title}
        defaultOpen={!!value}
        onOpenChange={(open) => {
          if (!open) {
            setFilter(undefined)
          }
        }}
      >
        <div className="gap-y-xsmall flex w-full flex-col py-2">
          <PopoverSelect
            options={options}
            value={filterType}
            onChange={selectFilterType}
          />
          <InputField
            value={fieldValue?.[filterType.value]}
            placeholder="Write something"
            onChange={(e) => updateFieldValue(e.target.value)}
          />
        </div>
      </CollapsibleWrapper>
    </div>
  )
}

const NumberFilterItem = ({
  title,
  setFilter,
  value,
  options,
}: {
  title: string
  value: any
  options: { value: string; label: string }[]
  setFilter: (newFilter: any) => void
}) => {
  const getInitialValue = (value: any) => {
    const keyLength = value ? Object.keys(value).length : 0

    if (keyLength === 1) {
      return value
    } else if (keyLength === 2) {
      return { gt: value.gt }
    }
    return null
  }

  const getInitialFilter = (value: any) => {
    const keyLength = value ? Object.keys(value).length : 0

    if (keyLength === 1) {
      return (
        options.find((o) => o.value === Object.keys(value)[0]) || options[0]
      )
    } else if (keyLength === 2) {
      return { label: "Between", value: "between" }
    }
    return options[0]
  }

  const [fieldValue, setFieldValue] = useState(getInitialValue(value))
  const [upperBound, setUpperBound] = useState<null | string>(
    getInitialFilter(value).value === "between" ? value.lt : undefined
  )

  const [filterType, setFilterType] = useState<{
    value: string
    label: string
  }>(getInitialFilter(value))

  const selectFilterType = (newFilter: { value: string; label: string }) => {
    const value = fieldValue?.[filterType.value]
    switch (newFilter.value) {
      case "lt":
      case "gt":
        setFieldValue({ [newFilter.value]: value })
        setFilter({ [newFilter.value]: value })
        break
      case "between":
        setFieldValue({ ["gt"]: value })
        setFilter({ ["gt"]: value })
    }
    setFilterType(newFilter)
  }

  const updateFieldValue = (val: string) => {
    switch (filterType.value) {
      case "lt":
      case "gt":
        setFieldValue({ [filterType.value]: val })
        setFilter({ [filterType.value]: val })
        break
      case "between":
        setFieldValue({ ["gt"]: val })
        setFilter({ ["gt"]: val })
    }
  }

  const setUpperBoundValue = (val: string | null) => {
    setUpperBound(val)

    const value = fieldValue?.gt
    setFilter({ gt: value, lt: val })
  }

  const getLowerBoundValue = () => {
    if (filterType.value === "between") {
      return fieldValue?.gt
    }

    return fieldValue?.[filterType.value]
  }

  const reset = () => {
    setFilter(undefined)
    setFieldValue(null)
    setUpperBound(null)
  }
  return (
    <div className={clsx("w-full border-b")}>
      <CollapsibleWrapper
        title={title}
        defaultOpen={!!value}
        onOpenChange={(open) => {
          if (!open) {
            reset()
          }
        }}
      >
        <div className="gap-y-xsmall flex w-full flex-col py-2">
          <PopoverSelect
            options={options}
            value={filterType}
            onChange={selectFilterType}
          />
          <div className="flex items-center gap-x-2">
            <InputField
              value={getLowerBoundValue()}
              placeholder="0"
              type="number"
              onChange={(e) => updateFieldValue(e.target.value)}
            />
            {filterType.value === "between" && (
              <>
                <span>-</span>
                <InputField
                  value={upperBound ?? undefined}
                  placeholder="0"
                  type="number"
                  onChange={(e) => setUpperBoundValue(e.target.value)}
                />
              </>
            )}
          </div>
        </div>
      </CollapsibleWrapper>
    </div>
  )
}

const DateFilterItem = ({
  title,
  setFilter,
  value,
}: {
  title: string
  value: any
  setFilter: (newFilter: any) => void
}) => {
  const options = [
    { label: "Before", value: "lt" },
    { label: "After", value: "gt" },
    { label: "Between", value: "between" },
  ]

  const getInitialFilter = (value: DateComparisonOperator) => {
    const keyLength = value ? Object.keys(value).length : 0

    if (keyLength === 1) {
      return (
        options.find((o) => o.value === Object.keys(value)[0]) || options[0]
      )
    } else if (keyLength === 2) {
      return { label: "Between", value: "between" }
    }
    return options[0]
  }

  const getDate1 = (value: DateComparisonOperator) => {
    const initialFilter = getInitialFilter(value)

    switch (initialFilter.value) {
      case "lt":
      case "gt":
        return value?.[initialFilter.value] ?? null
      case "between":
        return value?.["gt"] ?? null
    }
    return null
  }

  const getDate2 = (value: DateComparisonOperator) => {
    const initialFilter = getInitialFilter(value)

    switch (initialFilter.value) {
      case "between":
        return value["lt"] ?? null
    }
    return null
  }

  const [filterType, setFilterType] = useState<{
    value: string
    label: string
  }>(getInitialFilter(value))

  const [date1, setDate1] = useState<Date | null>(getDate1(value))
  const [date2, setDate2] = useState<Date | null>(getDate2(value))

  const setFilterDate = (values: {
    date1: Date | null
    date2: Date | null
  }) => {
    const { date1, date2 } = values
    setDate1(date1)
    setDate2(date2)

    switch (filterType.value) {
      case "lt":
      case "gt": {
        if (date1) {
          setFilter({
            [filterType.value]: date1,
          })
          setDate2(null)
        }
        break
      }
      case "between":
        if (date1 && date2) {
          setFilter({
            lt: date2,
            gt: date1,
          })
        }
        break
    }
  }

  const updateFilterType = (newFilter: { value: string; label: string }) => {
    switch (newFilter.value) {
      case "lt":
      case "gt":
        if (date1) {
          setFilter({
            [newFilter.value]: date1,
          })
          setDate2(null)
        }
        break
      case "between":
        if (date1 && date2) {
          setFilter({
            lt: date2,
            gt: date1,
          })
        }
        break
    }
    setFilterType(newFilter)
  }

  return (
    <div className={clsx("w-full border-b")}>
      <CollapsibleWrapper
        title={title}
        defaultOpen={!!value}
        onOpenChange={(open) => {
          if (!open) {
            setFilter(undefined)
          }
        }}
      >
        <div className="gap-y-xsmall flex w-full flex-col py-2">
          <PopoverSelect
            options={options}
            value={filterType}
            onChange={updateFilterType}
          />

          <div className="flex items-center gap-x-2">
            <FilterDatePicker
              date={date1}
              setDate={(date) => setFilterDate({ date1: date, date2 })}
            />
            {filterType.value === "between" && (
              <>
                <span>-</span>
                <FilterDatePicker
                  date={date2}
                  setDate={(date) => setFilterDate({ date1, date2: date })}
                />
              </>
            )}
          </div>
        </div>
      </CollapsibleWrapper>
    </div>
  )
}

const FilterDatePicker = ({
  date,
  setDate,
  side = "right",
}: {
  date: Date | null
  setDate: (date: Date | null) => void
  side?: "left" | "right"
}) => (
  <RadixPopover.Root>
    <RadixPopover.Trigger className="w-full">
      <div className="rounded-rounded inter-small-regular bg-grey-5 flex w-full items-center border py-1.5 pe-2 ps-3 text-start">
        <span className="text-grey-40 me-1.5">
          <CalendarIcon size={20} />
        </span>
        {date ? (
          <p className="mt-0.5">{moment(date).format("MMM DD, YYYY")}</p>
        ) : (
          <p className="text-grey-40 mt-0.5">Pick a date</p>
        )}
      </div>
    </RadixPopover.Trigger>
    <RadixPopover.Content
      side={side}
      sideOffset={8}
      className="bg-grey-0 rounded-rounded border p-1"
    >
      <CalendarComponent date={date} onChange={setDate} greyPastDates={false} />
    </RadixPopover.Content>
  </RadixPopover.Root>
)

const PopoverSelect = ({
  value,
  options,
  onChange,
}: {
  value: { value: string; label: string }
  options: { value: string; label: string }[]
  onChange: (value: { value: string; label: string }) => void
}) => {
  return (
    <RadixPopover.Root>
      <RadixPopover.Trigger className="w-full">
        <div className="rounded-rounded bg-grey-5 w-full border py-1.5 pe-2 ps-3 text-start">
          {value.label}
        </div>
      </RadixPopover.Trigger>
      <RadixPopover.Content
        side="right"
        align="start"
        sideOffset={2}
        className="bg-grey-0 rounded-rounded w-52 border p-1"
      >
        {options.map((o, i) => (
          <div
            key={i}
            className="hover:bg-grey-5 rounded-rounded mb-1 flex px-2 py-1.5"
            onClick={() => onChange(o)}
          >
            <div className="me-2 h-[20px] w-[20px]">
              {value.value === o.value && (
                <TagDotIcon size={20} outerColor="#FFF" color="#111827" />
              )}
            </div>
            <p>{o.label}</p>
          </div>
        ))}
      </RadixPopover.Content>
    </RadixPopover.Root>
  )
}

const CollapsibleWrapper = ({
  onOpenChange,
  defaultOpen,
  title,
  children,
}: {
  onOpenChange: (boolean) => void
  defaultOpen: boolean
  title: string
} & React.HTMLAttributes<HTMLDivElement>) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  return (
    <div className={clsx("border-grey-5 w-full border-b")}>
      <RadixCollapsible.Root
        defaultOpen={defaultOpen}
        onOpenChange={(open) => {
          setIsOpen(open)
          onOpenChange(open)
        }}
        className="w-full"
      >
        <RadixCollapsible.Trigger
          className={clsx(
            "text-grey-50 flex w-full cursor-pointer items-center justify-between rounded px-3 py-1.5"
          )}
        >
          <p>{title}</p>
          <Switch checked={isOpen} type="button" className="cursor-pointer" />
        </RadixCollapsible.Trigger>
        <RadixCollapsible.Content className="flex w-full flex-col gap-y-2 px-2">
          {children}
        </RadixCollapsible.Content>
      </RadixCollapsible.Root>
    </div>
  )
}

function getNewSetState<T>(state: Set<T>, value: T) {
  if (state.has(value)) {
    state.delete(value)
    return new Set(state)
  }
  return new Set(state.add(value))
}

export default ReservationsFilters
