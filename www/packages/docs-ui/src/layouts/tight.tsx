import React from "react"
import { RootLayout, RootLayoutProps } from "./root"
import clsx from "clsx"
import { Pagination } from ".."

export const TightLayout = ({
  children,
  showPagination,
  ...props
}: RootLayoutProps) => {
  return (
    <RootLayout {...props}>
      <div
        className={clsx(
          "w-full h-fit",
          "max-w-inner-content-xs sm:max-w-inner-content-sm md:max-w-inner-content-md",
          "lg:max-w-inner-content-lg xl:max-w-inner-content-xl xxl:max-w-inner-content-xxl",
          "xxxl:max-w-inner-content-xxxl"
        )}
      >
        {children}
        {showPagination && <Pagination />}
      </div>
    </RootLayout>
  )
}
