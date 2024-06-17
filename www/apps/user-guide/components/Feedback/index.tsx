"use client"

import {
  Feedback as UiFeedback,
  FeedbackProps as UiFeedbackProps,
  formatReportLink,
  useIsBrowser,
} from "docs-ui"
import { usePathname } from "next/navigation"
import { config } from "../../config"
import { basePathUrl } from "../../utils/base-path-url"
import { useMemo } from "react"

type FeedbackProps = Omit<UiFeedbackProps, "event" | "pathName">

const Feedback = (props: FeedbackProps) => {
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
      question="Was this chapter helpful?"
      {...props}
    />
  )
}

export default Feedback
