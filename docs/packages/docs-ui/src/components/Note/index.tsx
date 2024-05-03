import React from "react"
import { WarningNote } from "./Types/warning"
import { DefaultNote } from "./Types/default"
import { SuccessNote } from "./Types/sucess"
import { ErrorNote } from "./Types/error"
import { CheckNote } from "./Types/checks"
import { SoonNote } from "./Types/soon"

export type NoteProps = {
  type?: "default" | "warning" | "success" | "error" | "check" | "soon"
  title?: string
  children?: React.ReactNode
  icon?: React.ReactNode
}

export const Note = ({ type = "default", ...props }: NoteProps) => {
  switch (type) {
    case "warning":
      return <WarningNote type={type} {...props} />
    case "success":
      return <SuccessNote type={type} {...props} />
    case "error":
      return <ErrorNote type={type} {...props} />
    case "check":
      return <CheckNote type={type} {...props} />
    case "soon":
      return <SoonNote type={type} {...props} />
    default:
      return <DefaultNote type={type} {...props} />
  }
}
