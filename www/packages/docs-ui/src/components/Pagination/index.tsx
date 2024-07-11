"use client"

import React from "react"
import { usePagination } from "../../providers"
import { Card } from "../Card"
import { ChevronLeft, ChevronRight } from "@medusajs/icons"
import clsx from "clsx"

export const Pagination = () => {
  const { previousPage, nextPage } = usePagination()

  return (
    <div
      className={clsx(
        "flex justify-between",
        "flex-col sm:flex-row gap-docs_1 sm:gap-0"
      )}
    >
      {previousPage && (
        <Card
          title={previousPage.title}
          text={previousPage.parentTitle}
          startIcon={<ChevronLeft />}
          showLinkIcon={false}
          href={previousPage.link}
          className={clsx("ml-0 mr-auto items-center", "w-full sm:max-w-[45%]")}
        />
      )}
      {nextPage && (
        <Card
          title={nextPage.title}
          text={nextPage.parentTitle}
          endIcon={<ChevronRight />}
          showLinkIcon={false}
          href={nextPage.link}
          className={clsx("mr-0 ml-auto items-center", "w-full sm:max-w-[45%]")}
        />
      )}
    </div>
  )
}
