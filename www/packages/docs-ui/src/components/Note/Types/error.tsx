import React from "react"
import { NoteProps } from ".."
import { NoteLayout } from "../Layout"

export const ErrorNote = ({ title = "Error", ...props }: NoteProps) => {
  return <NoteLayout title={title} {...props} />
}
