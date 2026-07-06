"use client"

import React from "react"
import { Pagination } from "../Pagination"
import { useSiteConfig } from "../../providers/SiteConfig"

export type FooterProps = {
  editComponent?: React.ReactNode
  showPagination?: boolean
  feedbackComponent?: React.ReactNode
  editDate?: string
}

export const Footer = ({
  editComponent,
  showPagination,
  feedbackComponent,
}: FooterProps) => {
  const { isInProduct } = useSiteConfig()

  return (
    <>
      {feedbackComponent}
      {showPagination && <Pagination />}
      {!isInProduct && editComponent}
    </>
  )
}
