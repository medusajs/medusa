import clsx from "clsx"
import { useMemo, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import PlusIcon from "../../components/fundamentals/icons/plus-icon"
import FilterDropdownContainer from "../../components/molecules/filter-dropdown/container"
import TabFilter from "../../components/molecules/filter-tab"

const ProductsFilter = ({
  filters,
  submitFilters,
  clearFilters,
  tabs,
  onTabClick,
  activeTab,
  onRemoveTab,
  onSaveTab,
}) => {
  const { t } = useTranslation()
  const [tempState, setTempState] = useState(filters)
  const [name, setName] = useState("")

  const handleRemoveTab = (val) => {
    if (onRemoveTab) {
      onRemoveTab(val)
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

  const numberOfFilters = useMemo(
    () =>
      Object.entries(filters || {}).reduce((acc, [, value]) => {
        if (value?.open) {
          acc = acc + 1
        }
        return acc
      }, 0),
    [filters]
  )

  const setSingleFilter = (filterKey, filterVal) => {
    setTempState((prevState) => ({
      ...prevState,
      [filterKey]: filterVal,
    }))
  }

  return (
    <div className="flex gap-x-1">
      <FilterDropdownContainer
        submitFilters={onSubmit}
        clearFilters={onClear}
        triggerElement={
          <button
            className={clsx(
              "rounded-rounded focus-visible:shadow-input focus-visible:border-violet-60 flex items-center gap-x-1 focus-visible:outline-none"
            )}
          >
            <div className="rounded-rounded bg-grey-5 border-grey-20 inter-small-semibold flex h-6 items-center border px-2">
              {t("inventory-filters", "Filters")}
              <div className="text-grey-40 ms-1 flex items-center rounded">
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
      ></FilterDropdownContainer>
      {tabs &&
        tabs.map((t) => (
          <TabFilter
            key={t.value}
            onClick={() => handleTabClick(t.value)}
            label={t.label}
            isActive={activeTab === t.value}
            removable={!!t.removable}
            onRemove={() => handleRemoveTab(t.value)}
          />
        ))}
    </div>
  )
}

export default ProductsFilter
