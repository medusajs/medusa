"use client"

import React from "react"
import {
  Feedback as UiFeedback,
  FeedbackProps,
  DocsTrackingEvents,
} from "docs-ui"
import { useArea } from "@/providers/area"

export const Feedback = (props: Partial<FeedbackProps>) => {
  const { area } = useArea()

  return (
    <UiFeedback
      vertical={true}
      {...props}
      event={DocsTrackingEvents.SURVEY_API}
      extraData={{
        area,
        ...props.extraData,
      }}
    />
  )
}
