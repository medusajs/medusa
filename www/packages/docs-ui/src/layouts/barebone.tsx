import clsx from "clsx"
import React from "react"

export type BareboneLayoutProps = {
  htmlClassName?: string
  children: React.ReactNode
}

export const BareboneLayout = ({
  htmlClassName,
  children,
}: BareboneLayoutProps) => {
  return (
    <html lang="en" className={clsx("h-full w-full", htmlClassName)}>
      <head />
      {children}
    </html>
  )
}
