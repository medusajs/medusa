import React from "react"
import { NoteProps } from ".."
import { NoteLayout } from "../Layout"

export const DefaultNote = ({ title = "Note", ...props }: NoteProps) => {
  return <NoteLayout title={title} {...props} />
}
