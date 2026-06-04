import { Collapse, DescendingSorting } from "@medusajs/icons"
import { Button, clx, IconButton, Input, Tooltip } from "@medusajs/ui"
import { SegmentedControl } from "../../../../../components/common/segmented-control"
import { useTranslation } from "react-i18next"
import { useState } from "react"

type ViewMode = "full" | "selected"

type SelectorTreeFilterProps = {
  searchQuery: string
  onSearchChange: (value: string) => void
  viewMode: ViewMode
  onViewModeChange: (value: ViewMode) => void
  onSelectAllToggle: (selected: boolean) => void
  initialAllSelected: boolean
  onSortToggle: () => void
  sortOrder: "asc" | "desc"
  onCollapseAll: () => void
  className?: string
}

export const SelectorTreeFilter = ({
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  onSelectAllToggle,
  initialAllSelected,
  onSortToggle,
  sortOrder,
  onCollapseAll,
  className,
}: SelectorTreeFilterProps) => {
  const { t } = useTranslation()
  const [allSelected, setAllSelected] = useState(initialAllSelected)

  const handleSelectAllToggle = () => {
    setAllSelected((prev) => !prev)
    onSelectAllToggle(!allSelected)
  }
  return (
    <div className={clx("flex items-center gap-x-2", className)}>
      <div className="flex-1">
        <Input
          size="small"
          type="search"
          placeholder={t("general.search")}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full"
        />
      </div>
      <SegmentedControl
        value={viewMode}
        onValueChange={(value) => onViewModeChange(value as ViewMode)}
        options={[
          { value: "full", label: t("general.fullList") },
          { value: "selected", label: t("general.selected") },
        ]}
      />
      <Button
        onClick={handleSelectAllToggle}
        size="small"
        variant="secondary"
        type="button"
        className="min-w-[90px] whitespace-nowrap"
      >
        {allSelected ? t("general.unselectAll") : t("general.selectAll")}
      </Button>
      <Tooltip
        content={
          sortOrder === "desc"
            ? t("filters.sorting.alphabeticallyAsc")
            : t("filters.sorting.alphabeticallyDesc")
        }
      >
        <IconButton size="small" onClick={onSortToggle} type="button">
          <DescendingSorting />
        </IconButton>
      </Tooltip>
      <Tooltip content={t("filters.collapse.all")}>
        <IconButton size="small" onClick={onCollapseAll} type="button">
          <Collapse />
        </IconButton>
      </Tooltip>
    </div>
  )
}
