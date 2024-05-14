"use client"

import {
  Feedback as UiFeedback,
  FeedbackProps as UiFeedbackProps,
  formatReportLink,
  useIsBrowser,
} from "docs-ui"
import { usePathname } from "next/navigation"
import { config } from "../../config"
import { useMemo } from "react"
import { basePathUrl } from "../../utils/base-path-url"

type FeedbackProps = Omit<UiFeedbackProps, "event" | "pathName">

export const Feedback = (props: FeedbackProps) => {
  const pathname = usePathname()
  const isBrowser = useIsBrowser()

  const feedbackPathname = useMemo(() => basePathUrl(pathname), [pathname])
  const reportLink = useMemo(
    () =>
      formatReportLink(
        config.titleSuffix || "",
        isBrowser ? document.title : ""
      ),
    [isBrowser]
  )

  return (
    <UiFeedback
      event="survey"
      pathName={feedbackPathname}
      reportLink={reportLink}
      question="Was this page helpful?"
      {...props}
    />
  )
}
