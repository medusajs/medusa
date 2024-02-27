import { useAdminCollections } from "medusa-react"
import React, { useEffect, useState } from "react"
import { usePagination, useTable } from "react-table"
import { useDebounce } from "../../../hooks/use-debounce"
import Spinner from "../../atoms/spinner"
import Table from "../../molecules/table"
import { FilteringOptionProps } from "../../molecules/table/filtering-option"
import TableContainer from "../../organisms/table-container"
import useCollectionActions from "./use-collection-actions"
import useCollectionTableColumn from "./use-collection-column"

const DEFAULT_PAGE_SIZE = 15

const CollectionsTable: React.FC = () => {
  const [filteringOptions, setFilteringOptions] = useState<
    FilteringOptionProps[]
  >([])
  const [offset, setOffset] = useState(0)
  const limit = DEFAULT_PAGE_SIZE

  const [query, setQuery] = useState("")
  const [numPages, setNumPages] = useState(0)

  const debouncedSearchTerm = useDebounce(query, 300)
  const { collections, isLoading, isRefetching, count } = useAdminCollections(
    {
      q: debouncedSearchTerm,
      offset: offset,
      limit,
    },
    {
      keepPreviousData: true,
    }
  )

  useEffect(() => {
    if (typeof count !== "undefined") {
      const controlledPageCount = Math.ceil(count / limit)
      setNumPages(controlledPageCount)
    }
  }, [count])

  const [columns] = useCollectionTableColumn()

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageCount,
    nextPage,
    previousPage,
    // Get the state from the instance
    state: { pageIndex },
  } = useTable(
    {
      columns,
      data: collections || [],
      manualPagination: true,
      initialState: {
        pageIndex: Math.floor(offset / limit),
        pageSize: limit,
      },
      pageCount: numPages,
      autoResetPage: false,
    },
    usePagination
  )

  const handleNext = () => {
    if (canNextPage) {
      setOffset(offset + limit)
      nextPage()
    }
  }

  const handleSearch = (q: string) => {
    setOffset(0)
    setQuery(q)
  }

  const handlePrev = () => {
    if (canPreviousPage) {
      setOffset(offset - limit)
      previousPage()
    }
  }

  useEffect(() => {
    setFilteringOptions([
      {
        title: "Sort",
        options: [
          {
            title: "All",
            count: collections?.length || 0,
            onClick: () => console.log("Not implemented yet"),
          },
        ],
      },
    ])
  }, [collections])

  return (
    <TableContainer
      isLoading={isLoading || isRefetching}
      hasPagination
      numberOfRows={limit}
      pagingState={{
        count: count!,
        offset,
        pageSize: offset + rows.length,
        title: "Collections",
        currentPage: pageIndex + 1,
        pageCount: pageCount,
        nextPage: handleNext,
        prevPage: handlePrev,
        hasNext: canNextPage,
        hasPrev: canPreviousPage,
      }}
    >
      <Table
        enableSearch
        handleSearch={handleSearch}
        searchValue={query}
        searchPlaceholder="Search Collections"
        filteringOptions={filteringOptions}
        {...getTableProps()}
      >
        <Table.Head>
          {headerGroups?.map((headerGroup) => (
            <Table.HeadRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((col, idx) => (
                <Table.HeadCell
                  className="min-w-[100px]"
                  {...col.getHeaderProps()}
                  key={idx}
                >
                  {col.render("Header")}
                </Table.HeadCell>
              ))}
            </Table.HeadRow>
          ))}
        </Table.Head>
        {isLoading || isRefetching || !collections ? (
          <Table.Body {...getTableBodyProps()}>
            <Table.Row>
              <Table.Cell colSpan={columns.length}>
                <div className="pt-2xlarge flex w-full items-center justify-center">
                  <Spinner size={"large"} variant={"secondary"} />
                </div>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        ) : (
          <Table.Body {...getTableBodyProps()}>
            {rows.map((row, idx) => {
              prepareRow(row)
              return <CollectionRow row={row} key={idx} />
            })}
          </Table.Body>
        )}
      </Table>
    </TableContainer>
  )
}

const CollectionRow = ({ row }) => {
  const collection = row.original
  const { getActions } = useCollectionActions(collection)

  return (
    <Table.Row
      color={"inherit"}
      linkTo={`/a/collections/${collection.id}`}
      actions={getActions(collection)}
      {...row.getRowProps()}
    >
      {row.cells.map((cell, index) => {
        return (
          <Table.Cell {...cell.getCellProps()}>
            {cell.render("Cell", { index })}
          </Table.Cell>
        )
      })}
    </Table.Row>
  )
}
export default CollectionsTable
