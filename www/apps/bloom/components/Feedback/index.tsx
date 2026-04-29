"use client"

import {
  DocsTrackingEvents,
  Feedback as UiFeedback,
  FeedbackProps as UiFeedbackProps,
} from "docs-ui"

type FeedbackProps = Omit<UiFeedbackProps, "event" | "pathName">

const Feedback = (props: FeedbackProps) => {
  return (
    <UiFeedback
      event={DocsTrackingEvents.SURVEY}
      question="Was this guide helpful?"
      {...props}
    />
  )
}

export default Feedback
