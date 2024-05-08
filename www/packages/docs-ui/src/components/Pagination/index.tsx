"use client"

import React from "react"
import { usePagination } from "../../providers"
import { Card } from "../Card"
import { ChevronLeft, ChevronRight } from "@medusajs/icons"

export const Pagination = () => {
  const { previousPage, nextPage } = usePagination()

  return (
    <div className="flex justify-between">
      {previousPage && (
        <Card
          title={previousPage.title}
          text={previousPage.parentTitle}
          startIcon={<ChevronLeft />}
          showLinkIcon={false}
          href={previousPage.link}
          className="max-w-[45%] ml-0 mr-auto items-center"
        />
      )}
      {nextPage && (
        <Card
          title={nextPage.title}
          text={nextPage.parentTitle}
          endIcon={<ChevronRight />}
          showLinkIcon={false}
          href={nextPage.link}
          className="max-w-[45%] mr-0 ml-auto items-center"
        />
      )}
    </div>
  )
}
