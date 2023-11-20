/* eslint-disable max-len */
import clsx from "clsx"
import { Key, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import FilterDropdownContainer from "../../../components/molecules/filter-dropdown/container"
import FilterDropdownItem from "../../../components/molecules/filter-dropdown/item"
import SaveFilterItem from "../../../components/molecules/filter-dropdown/save-field"
import TabFilter from "../../../components/molecules/filter-tab"
import PlusIcon from "../../fundamentals/icons/plus-icon"
import { TFunction } from "i18next"

const statusFilters = [
  "completed",
  "pending",
  "canceled",
  "archived",
  "requires_action",
]
const paymentFilters = [
  "awaiting",
  "captured",
  "refunded",
  "canceled",
  "partially_refunded",
  "requires_action",
  "not_paid",
]
const fulfillmentFilters = [
  "fulfilled",
  "not_fulfilled",
  "partially_fulfilled",
  "returned",
  "partially_returned",
  "shipped",
  "partially_shipped",
  "requires_action",
  "canceled",
]

const dateFilters = (t: TFunction) => [
  t("is in the last"),
  t("is older than"),
  t("is after"),
  t("is before"),
  t("is equal to"),
]

const OrderFilters = ({
  tabs,
  activeTab,
  onTabClick,
  onSaveTab,
  onRemoveTab,
  filters,
  submitFilters,
  clearFilters,
}) => {
  const { t } = useTranslation()
  const [tempState, setTempState] = useState(filters)
  const [name, setName] = useState("")

  const handleRemoveTab = (val: any) => {
    if (onRemoveTab) {
      onRemoveTab(val)
    }
  }

  const handleSaveTab = () => {
    if (onSaveTab) {
      onSaveTab(name, tempState)
    }
  }

  const handleTabClick = (tabName: string) => {
    if (onTabClick) {
      onTabClick(tabName)
    }
  }

  useEffect(() => {
    setTempState(filters)
  }, [filters])

  const onSubmit = () => {
    submitFilters(tempState)
  }

  const onClear = () => {
    clearFilters()
  }

  const setSingleFilter = (filterKey: string, filterVal: any) => {
    setTempState((prevState: any) => ({
      ...prevState,
      [filterKey]: filterVal,
    }))
  }

  const numberOfFilters = Object.entries(filters).reduce(
    (acc, [key, value]) => {
      if (value?.open) {
        acc = acc + 1
      }
      return acc
    },
    0
  )

  return (
    <div className="flex space-x-1">
      <FilterDropdownContainer
        submitFilters={onSubmit}
        clearFilters={onClear}
        triggerElement={
          <button
            className={clsx(
              "rounded-rounded focus-visible:shadow-input focus-visible:border-violet-60 flex items-center space-x-1 focus-visible:outline-none"
            )}
          >
            <div className="rounded-rounded bg-grey-5 border-grey-20 inter-small-semibold flex h-6 items-center border px-2">
              {t("Filters")}
              <div className="text-grey-40 ml-1 flex items-center rounded">
                <span className="text-violet-60 inter-small-semibold">
                  {numberOfFilters ? numberOfFilters : "0"}
                </span>
              </div>
            </div>
            <div className="rounded-rounded bg-grey-5 border-grey-20 inter-small-semibold flex items-center border p-1">
              <PlusIcon size={14} />
            </div>
          </button>
        }
      >
        <FilterDropdownItem
          filterTitle={t("Status")}
          options={statusFilters}
          filters={tempState.status.filter}
          open={tempState.status.open}
          setFilter={(val: any) => setSingleFilter("status", val)}
          isLoading={undefined}
          hasMore={undefined}
          hasPrev={undefined}
          onShowNext={undefined}
          onShowPrev={undefined}
        />
        <FilterDropdownItem
          filterTitle={t("Payment Status")}
          options={paymentFilters}
          filters={tempState.payment.filter}
          open={tempState.payment.open}
          setFilter={(val: any) => setSingleFilter("payment", val)}
          isLoading={undefined}
          hasMore={undefined}
          hasPrev={undefined}
          onShowNext={undefined}
          onShowPrev={undefined}
        />
        <FilterDropdownItem
          filterTitle={t("Fulfillment Status")}
          options={fulfillmentFilters}
          filters={tempState.fulfillment.filter}
          open={tempState.fulfillment.open}
          setFilter={(val: any) => setSingleFilter("fulfillment", val)}
          isLoading={undefined}
          hasMore={undefined}
          hasPrev={undefined}
          onShowNext={undefined}
          onShowPrev={undefined}
        />
        <FilterDropdownItem
          filterTitle={t("Date")}
          options={dateFilters(t)}
          filters={tempState.date.filter}
          open={tempState.date.open}
          setFilter={(val: any) => setSingleFilter("date", val)}
          isLoading={undefined}
          hasMore={undefined}
          hasPrev={undefined}
          onShowNext={undefined}
          onShowPrev={undefined}
        />
        <SaveFilterItem
          saveFilter={handleSaveTab}
          name={name}
          setName={setName}
        />
      </FilterDropdownContainer>
      {tabs &&
        tabs.map(
          (t: {
            value: Key | null | undefined
            label: string | undefined
            removable: any
          }) => (
            <TabFilter
              key={t.value}
              onClick={() => handleTabClick(t.value)}
              label={t.label}
              isActive={activeTab === t.value}
              removable={!!t.removable}
              onRemove={() => handleRemoveTab(t.value)}
            />
          )
        )}
    </div>
  )
}

export default OrderFilters
