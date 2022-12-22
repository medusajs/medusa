import React from "react"

import SkeletonProvider from "../../../context/skeleton"
import Skeleton from "../../atoms/skeleton"
import ArrowLeftIcon from "../../fundamentals/icons/arrow-left-icon"
import ArrowRightIcon from "../../fundamentals/icons/arrow-right-icon"
import { PagingProps } from "./types"

type Props = {
  isLoading?: boolean
  pagingState: PagingProps
}

export const TablePagination = ({
  isLoading = false,
  pagingState: {
    title,
    currentPage,
    pageCount,
    pageSize,
    count,
    offset,
    nextPage,
    prevPage,
    hasNext,
    hasPrev,
  },
}: Props) => {
  const soothedOffset = count > 0 ? offset + 1 : 0
  const soothedPageCount = Math.max(1, pageCount)

  return (
    <SkeletonProvider isLoading={isLoading}>
      <div
        className={
          "flex w-full justify-between inter-small-regular text-grey-50"
        }
      >
        <Skeleton>
          <div>{`${soothedOffset} - ${pageSize} of ${count} ${title}`}</div>
        </Skeleton>
        <div className="flex space-x-4">
          <Skeleton>
            <div>{`${currentPage} of ${soothedPageCount}`}</div>
          </Skeleton>
          <div className="flex space-x-4 items-center">
            <button
              className="cursor-pointer disabled:text-grey-30 disabled:cursor-default"
              disabled={!hasPrev || isLoading}
              onClick={() => prevPage()}
            >
              <ArrowLeftIcon />
            </button>
            <button
              className="cursor-pointer disabled:text-grey-30 disabled:cursor-default"
              disabled={!hasNext || isLoading}
              onClick={() => nextPage()}
            >
              <ArrowRightIcon />
            </button>
          </div>
        </div>
      </div>
    </SkeletonProvider>
  )
}
