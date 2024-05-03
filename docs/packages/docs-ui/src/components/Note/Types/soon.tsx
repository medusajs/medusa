import React from "react"
import { NoteProps } from ".."
import { NoteLayout } from "../Layout"
import { LightBulb } from "@medusajs/icons"
import clsx from "clsx"

export const SoonNote = ({
  title = "Coming soon",
  icon,
  ...props
}: NoteProps) => {
  return (
    <NoteLayout
      title={title}
      icon={
        icon || (
          <LightBulb
            className={clsx(
              "inline-block mr-docs_0.125 text-medusa-tag-blue-icon"
            )}
          />
        )
      }
      {...props}
    />
  )
}
