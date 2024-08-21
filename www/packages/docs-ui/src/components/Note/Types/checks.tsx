import React from "react"
import { NoteProps } from ".."
import { NoteLayout } from "../Layout"

export const CheckNote = ({ title = "Prerequisites", ...props }: NoteProps) => {
  return <NoteLayout title={title} {...props} />
}
