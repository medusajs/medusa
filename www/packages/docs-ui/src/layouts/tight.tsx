import React from "react"
import { RootLayout, RootLayoutProps } from "./root"
import clsx from "clsx"
import { Breadcrumbs, Pagination } from ".."

export const TightLayout = ({
  children,
  showPagination,
  feedbackComponent,
  editComponent,
  showBreadcrumbs = true,
  ...props
}: RootLayoutProps) => {
  return (
    <RootLayout {...props}>
      <div
        className={clsx(
          "w-full h-fit",
          "max-w-inner-content-xs sm:max-w-inner-content-sm md:max-w-inner-content-md",
          "lg:max-w-inner-content-lg xl:max-w-inner-content-xl xxl:max-w-inner-content-xxl",
          "xxxl:max-w-inner-content-xxxl",
          "px-docs_1 md:px-docs_4 lg:px-0"
        )}
      >
        {showBreadcrumbs && <Breadcrumbs />}
        {children}
        {feedbackComponent}
        {showPagination && <Pagination />}
        {editComponent}
      </div>
    </RootLayout>
  )
}
