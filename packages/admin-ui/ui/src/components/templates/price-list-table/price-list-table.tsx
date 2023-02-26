import { PriceList } from "@medusajs/medusa"
import { debounce } from "lodash"
import React, { useCallback, useEffect, useState } from "react"
import {
  Column,
  HeaderGroup,
  Row,
  TableOptions,
  usePagination,
  useRowSelect,
  useSortBy,
  UseSortByColumnProps,
  useTable,
} from "react-table"
import { useDebounce } from "../../../hooks/use-debounce"
import Table, { TableProps } from "../../molecules/table"
import TableContainer from "../../organisms/table-container"
import { usePriceListFilters } from "./use-price-list-filters"

/* ******************************************** */
/* ************** TABLE ELEMENTS ************** */
/* ******************************************** */

type HeaderCellProps = {
  col: HeaderGroup<PriceList> & UseSortByColumnProps<PriceList>
}

/*
 * Renders react-table cell for the price lists table.
 */
function PriceListTableHeaderCell(props: HeaderCellProps) {
  return (
    <Table.HeadCell
      className="w-[100px]"
      {...props.col.getHeaderProps(props.col.getSortByToggleProps())}
    >
      {props.col.render("Header")}
    </Table.HeadCell>
  )
}

type HeaderRowProps = {
  headerGroup: HeaderGroup<PriceList>
}

/*
 * Renders react-table header row for the price list table.
 */
function PriceListTableHeaderRow(props: HeaderRowProps) {
  return (
    <Table.HeadRow {...props.headerGroup.getHeaderGroupProps()}>
      {props.headerGroup.headers.map((col) => (
        <PriceListTableHeaderCell key={col.id} col={col} />
      ))}
    </Table.HeadRow>
  )
}

type PriceListTableRowProps = {
  row: Row<PriceList>
}

/*
 * Render react-table row for the price lists table.
 */
function PriceListTableRow(props: PriceListTableRowProps) {
  const { row } = props

  return (
    <Table.Row
      color={"inherit"}
      linkTo={row.original.id}
      id={row.original.id}
      className="group"
      {...row.getRowProps()}
    >
      {row.cells.map((cell, index) => cell.render("Cell", { index }))}
    </Table.Row>
  )
}

/* ******************************************** */
/* ************* TABLE CONTAINERS ************* */
/* ******************************************** */

type PriceListTableProps = ReturnType<typeof usePriceListFilters> & {
  isLoading?: boolean
  priceLists: PriceList[]
  columns: Array<Column<PriceList>>
  count: number
  options: Omit<TableProps, "filteringOptions"> & {
    filter: Pick<TableProps, "filteringOptions">
  }
}

/*
 * Root component of the price lists table.
 */
export function PriceListTable(props: PriceListTableProps) {
  const [query, setQuery] = useState("")

  const {
    priceLists,
    queryObject,
    count,
    paginate,
    setQuery: setFreeText,
    columns,
    options,
    isLoading,
  } = props

  const tableConfig: TableOptions<PriceList> = {
    columns: columns,
    data: priceLists || [],
    initialState: {
      pageSize: queryObject.limit,
      pageIndex: queryObject.offset / queryObject.limit,
    },
    pageCount: Math.ceil(count / queryObject.limit),
    manualPagination: true,
    autoResetPage: false,
  }

  const table = useTable(tableConfig, useSortBy, usePagination, useRowSelect)

  // ********* HANDLERS *********

  const handleNext = () => {
    if (!table.canNextPage) {
      return
    }

    paginate(1)
    table.nextPage()
  }

  const handlePrev = () => {
    if (!table.canPreviousPage) {
      return
    }

    paginate(-1)
    table.previousPage()
  }

  const debouncedSearchTerm = useDebounce(query, 500)

  useEffect(() => {
    setFreeText(debouncedSearchTerm)
    table.gotoPage(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm])

  // const debouncedSearch = React.useMemo(() => debounce(handleSearch, 300), [])

  // ********* RENDER *********

  return (
    <TableContainer
      isLoading={isLoading}
      numberOfRows={queryObject.limit}
      hasPagination
      pagingState={{
        count: count!,
        offset: queryObject.offset,
        pageSize: queryObject.offset + table.rows.length,
        title: "Price Lists",
        currentPage: table.state.pageIndex + 1,
        pageCount: table.pageCount,
        nextPage: handleNext,
        prevPage: handlePrev,
        hasNext: table.canNextPage,
        hasPrev: table.canPreviousPage,
      }}
    >
      <Table
        {...table.getTableProps()}
        {...options}
        enableSearch={options.enableSearch}
        searchValue={query}
        handleSearch={options.enableSearch ? setQuery : undefined}
        filteringOptions={options.filter}
      >
        {/* HEAD */}
        <Table.Head>
          {table.headerGroups?.map((headerGroup, ind) => (
            <PriceListTableHeaderRow key={ind} headerGroup={headerGroup} />
          ))}
        </Table.Head>

        {/* BODY */}
        <Table.Body {...table.getTableBodyProps()}>
          {table.rows.map((row) => {
            table.prepareRow(row)
            return <PriceListTableRow row={row} />
          })}
        </Table.Body>
      </Table>
    </TableContainer>
  )
}
