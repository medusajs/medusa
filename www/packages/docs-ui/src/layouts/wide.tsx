import React from "react"
import { RootLayout, RootLayoutProps } from "./root"
import clsx from "clsx"
import { Breadcrumbs, Pagination } from ".."

export const WideLayout = ({
  children,
  showPagination,
  feedbackComponent,
  editComponent,
  showBreadcrumbs = true,
  ...props
}: RootLayoutProps) => {
  return (
    <RootLayout
      {...props}
      mainWrapperClasses={clsx(props.mainWrapperClasses, "mx-auto flex")}
      contentClassName="w-full px-1"
    >
      <main
        className={clsx(
          "max-w-inner-content-xs sm:max-w-inner-content-sm md:max-w-inner-content-md",
          "lg:max-w-lg-wide-content xl:max-w-xl-wide-content relative mt-4 w-full flex-1 lg:mt-7"
        )}
      >
        {showBreadcrumbs && <Breadcrumbs />}
        {children}
        {feedbackComponent}
        {showPagination && <Pagination />}
        {editComponent}
      </main>
    </RootLayout>
  )
}
