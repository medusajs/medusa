"use client"

import {
  Feedback as UiFeedback,
  FeedbackProps as UiFeedbackProps,
  formatReportLink,
} from "docs-ui"
import { usePathname } from "next/navigation"
import { config } from "../../config"

type FeedbackProps = Omit<UiFeedbackProps, "event" | "pathName">

const Feedback = (props: FeedbackProps) => {
  const pathname = usePathname()

  return (
    <UiFeedback
      event="survey"
      pathName={pathname}
      reportLink={formatReportLink(
        config.titleSuffix || "",
        typeof document !== "undefined" ? document.title : ""
      )}
      question="Was this chapter helpful?"
      {...props}
    />
  )
}

export default Feedback
