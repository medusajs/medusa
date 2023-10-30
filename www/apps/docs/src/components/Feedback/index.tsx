import React from "react"
import {
  Feedback as UiFeedback,
  type FeedbackProps as UiFeedbackProps,
  GITHUB_ISSUES_PREFIX,
} from "docs-ui"
import useIsBrowser from "@docusaurus/useIsBrowser"
import { useLocation } from "@docusaurus/router"
import clsx from "clsx"

type FeedbackProps = Omit<UiFeedbackProps, "pathName" | "reportLink">

const Feedback = (props: FeedbackProps) => {
  const isBrowser = useIsBrowser()
  const location = useLocation()

  return (
    <UiFeedback
      {...props}
      className={clsx("py-2", props.className)}
      pathName={isBrowser && location ? location.pathname : ""}
      reportLink={GITHUB_ISSUES_PREFIX}
      showLongForm={true}
    />
  )
}

export default Feedback
