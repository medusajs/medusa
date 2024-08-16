"use client"

import React from "react"
import { usePagination } from "../../providers"
import clsx from "clsx"
import { PaginationCard } from "./Card"

export const Pagination = () => {
  const { previousPage, nextPage } = usePagination()

  return (
    <div
      className={clsx(
        "flex justify-between",
        "flex-col sm:flex-row gap-docs_0.75"
      )}
    >
      {previousPage && (
        <PaginationCard
          type="previous"
          title={previousPage.title}
          parentTitle={previousPage.parentTitle}
          link={previousPage.link}
        />
      )}
      {nextPage && (
        <PaginationCard
          type="next"
          title={nextPage.title}
          parentTitle={nextPage.parentTitle}
          link={nextPage.link}
        />
      )}
    </div>
  )
}
