import clsx from "clsx"
import React from "react"
import { useNavigate } from "react-router-dom"
import Spinner from "../../atoms/spinner"
import ArrowLeftIcon from "../../fundamentals/icons/arrow-left-icon"
import ArrowRightIcon from "../../fundamentals/icons/arrow-right-icon"
import SortingIcon from "../../fundamentals/icons/sorting-icon"
import Actionables, { ActionType } from "../../molecules/actionables"
import FilteringOptions, { FilteringOptionProps } from "./filtering-option"
import TableSearch from "./table-search"

type TableRowProps = React.HTMLAttributes<HTMLTableRowElement> & {
  forceDropdown?: boolean
  actions?: ActionType[]
  linkTo?: string
}

type TableCellProps = React.TdHTMLAttributes<HTMLTableCellElement> & {
  linkTo?: string
  name?: string
}

type SortingHeadCellProps = {
  onSortClicked: () => void
  sortDirection?: "ASC" | "DESC"
  setSortDirection: (string) => void
} & React.HTMLAttributes<HTMLTableCellElement>

export type TableProps = {
  filteringOptions?: FilteringOptionProps[] | React.ReactNode
  tableActions?: React.ReactNode
  enableSearch?: boolean
  immediateSearchFocus?: boolean
  searchPlaceholder?: string
  searchValue?: string
  containerClassName?: string
  handleSearch?: (searchTerm: string) => void
} & React.HTMLAttributes<HTMLTableElement>

type TableElement<T> = React.ForwardRefExoticComponent<T> &
  React.RefAttributes<unknown>

type TableType = {
  Head: TableElement<React.HTMLAttributes<HTMLTableSectionElement>>
  HeadRow: TableElement<React.HTMLAttributes<HTMLTableRowElement>>
  HeadCell: TableElement<React.ThHTMLAttributes<HTMLTableCellElement>>
  SortingHeadCell: TableElement<SortingHeadCellProps>
  Body: TableElement<React.HTMLAttributes<HTMLTableSectionElement>>
  Row: TableElement<TableRowProps>
  Cell: TableElement<TableCellProps>
} & TableElement<TableProps>

const Table = React.forwardRef<HTMLTableElement, TableProps>(
  (
    {
      className,
      children,
      tableActions,
      enableSearch,
      immediateSearchFocus,
      searchPlaceholder,
      searchValue,
      handleSearch,
      filteringOptions,
      containerClassName,
      ...props
    },
    ref
  ) => {
    if (enableSearch && !handleSearch) {
      throw new Error("Table cannot enable search without a search handler")
    }

    return (
      <div className={`flex flex-col ${containerClassName}`}>
        <div className="w-full flex justify-between mb-2">
          {filteringOptions ? (
            <div className="flex mb-2 self-end">
              {Array.isArray(filteringOptions)
                ? filteringOptions.map((fo) => <FilteringOptions {...fo} />)
                : filteringOptions}
            </div>
          ) : (
            <span aria-hidden />
          )}
          <div className="flex items-center">
            {tableActions && <div>{tableActions}</div>}
            {enableSearch && (
              <TableSearch
                autoFocus={immediateSearchFocus}
                placeholder={searchPlaceholder}
                searchValue={searchValue}
                onSearch={handleSearch!}
              />
            )}
          </div>
        </div>
        <div className="relative">
          <table
            ref={ref}
            className={clsx("w-full table-auto", className)}
            {...props}
          >
            {children}
          </table>
        </div>
      </div>
    )
  }
) as TableType

Table.Head = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, children, ...props }, ref) => (
  <thead
    ref={ref}
    className={clsx(
      "whitespace-nowrap inter-small-semibold text-grey-50 border-t border-b border-grey-20",
      className
    )}
    {...props}
  >
    {children}
  </thead>
))

Table.HeadRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, children, ...props }, ref) => (
  <tr ref={ref} className={clsx(className)} {...props}>
    {children}
  </tr>
))

Table.HeadCell = React.forwardRef<
  HTMLTableCellElement,
  React.HTMLAttributes<HTMLTableCellElement>
>(({ className, children, ...props }, ref) => (
  <th ref={ref} className={clsx("text-left h-[40px]", className)} {...props}>
    {children}
  </th>
))

Table.SortingHeadCell = React.forwardRef<
  HTMLTableCellElement,
  SortingHeadCellProps
>(
  (
    {
      onSortClicked,
      sortDirection,
      setSortDirection,
      className,
      children,
      ...props
    }: SortingHeadCellProps,
    ref
  ) => {
    return (
      <th ref={ref} className={clsx("text-left py-2.5", className)} {...props}>
        <div
          className="flex items-center cursor-pointer select-none"
          onClick={(e) => {
            e.preventDefault()
            if (!sortDirection) {
              setSortDirection("ASC")
            } else {
              if (sortDirection === "ASC") {
                setSortDirection("DESC")
              } else {
                setSortDirection(undefined)
              }
            }
            onSortClicked()
          }}
        >
          {children}
          <SortingIcon
            size={16}
            ascendingColor={sortDirection === "ASC" ? "#111827" : undefined}
            descendingColor={sortDirection === "DESC" ? "#111827" : undefined}
          />
        </div>
      </th>
    )
  }
)

Table.Body = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, children, ...props }, ref) => (
  <tbody ref={ref} className={clsx(className)} {...props}>
    {children}
  </tbody>
))

Table.Cell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, linkTo, children, ...props }, ref) => {
    const navigate = useNavigate()
    return (
      <td
        ref={ref}
        className={clsx("inter-small-regular h-[40px]", className)}
        {...props}
        {...(linkTo && {
          onClick: (e) => {
            navigate(linkTo)
            e.stopPropagation()
          },
        })}
      >
        {children}
      </td>
    )
  }
)

Table.Row = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, actions, children, linkTo, forceDropdown, ...props }, ref) => {
    const navigate = useNavigate()
    return (
      <tr
        ref={ref}
        className={clsx(
          "inter-small-regular border-t border-b border-grey-20 text-grey-90",
          className,
          { "cursor-pointer hover:bg-grey-5": linkTo !== undefined }
        )}
        {...props}
        {...(linkTo && {
          onClick: () => {
            navigate(linkTo)
          },
        })}
      >
        {children}
        {actions && (
          <Table.Cell onClick={(e) => e.stopPropagation()} className="w-[32px]">
            <Actionables forceDropdown={forceDropdown} actions={actions} />
          </Table.Cell>
        )}
      </tr>
    )
  }
)

export default Table
