import React from "react"
import { NoteProps } from ".."
import { NoteLayout } from "../Layout"
import { ExclamationCircleSolid } from "@medusajs/icons"
import clsx from "clsx"

export const WarningNote = ({
  title = "Warning",
  icon,
  ...props
}: NoteProps) => {
  return (
    <NoteLayout
      title={title}
      icon={
        icon || (
          <ExclamationCircleSolid
            className={clsx(
              "inline-block mr-docs_0.125 text-medusa-tag-red-icon"
            )}
          />
        )
      }
      {...props}
    />
  )
}
