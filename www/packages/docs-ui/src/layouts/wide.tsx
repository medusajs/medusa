import React from "react"
import { RootLayout, RootLayoutProps } from "./root"
import clsx from "clsx"
import { Pagination } from ".."

export const WideLayout = ({
  children,
  showPagination,
  ...props
}: RootLayoutProps) => {
  return (
    <RootLayout
      {...props}
      mainWrapperClasses={clsx(props.mainWrapperClasses, "mx-auto flex px-1.5")}
    >
      <main className="lg:max-w-wide-content relative mt-4 w-full flex-1 lg:mt-7">
        {children}
        {showPagination && <Pagination />}
      </main>
    </RootLayout>
  )
}
