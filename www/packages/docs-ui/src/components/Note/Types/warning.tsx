import React from "react"
import { NoteProps } from ".."
import { NoteLayout } from "../Layout"

export const WarningNote = ({ title = "Warning", ...props }: NoteProps) => {
  return <NoteLayout title={title} {...props} />
}
