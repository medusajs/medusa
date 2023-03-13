import { Table } from "@tanstack/react-table"
import clsx from "clsx"
import { useMemo } from "react"
import Button from "../../fundamentals/button"
import ArrowLeftIcon from "../../fundamentals/icons/arrow-left-icon"
import ArrowRightIcon from "../../fundamentals/icons/arrow-right-icon"

type Props<T> = {
  count?: number
  table: Table<T>
  className?: string
}

/**
 * Table pagnination component that is compatible with @tanstack/react-table
 */
export const TablePagination = <T,>({
  count = 0,
  table,
  className,
}: Props<T>) => {
  const {
    getState,
    getPageCount,
    getCanNextPage,
    getCanPreviousPage,
    previousPage,
    nextPage,
  } = table

  const { pageIndex, pageSize } = getState().pagination

  const { from, to } = useMemo(() => {
    const from = pageIndex * pageSize + 1
    const to = Math.min(count, (pageIndex + 1) * pageSize)

    return { from, to }
  }, [count, pageIndex, pageSize])

  return (
    <div
      className={clsx(
        "inter-small-regular text-grey-50 flex items-center justify-between",
        className
      )}
    >
      <div>
        <p>{`${from} – ${to} of ${count} results`}</p>
      </div>
      <div className="gap-x-small flex items-center">
        <p>{`${getState().pagination.pageIndex + 1} of ${getPageCount()}`}</p>
        <div className="gap-x-2xsmall flex items-center">
          <Button
            variant="ghost"
            size="small"
            className="h-xlarge w-xlarge disabled:text-grey-40"
            type="button"
            disabled={!getCanPreviousPage()}
            onClick={previousPage}
          >
            <ArrowLeftIcon size={16} />
          </Button>
          <Button
            variant="ghost"
            size="small"
            className="h-xlarge w-xlarge disabled:text-grey-40"
            type="button"
            disabled={!getCanNextPage()}
            onClick={nextPage}
          >
            <ArrowRightIcon size={16} />
          </Button>
        </div>
      </div>
    </div>
  )
}
