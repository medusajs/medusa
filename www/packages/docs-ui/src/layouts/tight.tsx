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
    <RootLayout
      {...props}
      mainWrapperClasses={clsx(
        props.mainWrapperClasses,
        "grid grid-cols-1 px-docs_1.5 lg:mx-auto lg:grid-cols-[280px_1fr]"
      )}
    >
      <div
        className={clsx(
          "relative flex w-full flex-1 items-start justify-center",
          " px-docs_1 pb-docs_2 pt-docs_7 md:px-docs_2 lg:px-docs_4 lg:py-docs_7"
        )}
      >
        <main className="h-full w-full lg:max-w-[720px] lg:px-px">
          {children}
          {showPagination && <Pagination />}
        </main>
      </div>
    </RootLayout>
  )
}
