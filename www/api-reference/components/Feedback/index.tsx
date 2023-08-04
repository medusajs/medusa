"use client"

import React, { useRef, useState } from "react"
import { CSSTransition, SwitchTransition } from "react-transition-group"
import Solutions from "./Solutions/index"
import Button from "../Button"
import { ExtraData, useAnalytics } from "@/providers/analytics"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { useArea } from "../../providers/area"
import clsx from "clsx"

type FeedbackProps = {
  event: string
  question?: string
  positiveBtn?: string
  negativeBtn?: string
  positiveQuestion?: string
  negativeQuestion?: string
  submitBtn?: string
  submitMessage?: string
  showPossibleSolutions?: boolean
  className?: string
  extraData?: ExtraData
  sectionTitle?: string
} & React.HTMLAttributes<HTMLDivElement>

const Feedback: React.FC<FeedbackProps> = ({
  event,
  question = "Was this section helpful?",
  positiveBtn = "Yes",
  negativeBtn = "No",
  positiveQuestion = "What was most helpful?",
  negativeQuestion = "What can we improve?",
  submitBtn = "Submit",
  submitMessage = "Thank you for helping improve our documentation!",
  showPossibleSolutions = true,
  className = "",
  extraData = {},
  sectionTitle = "",
}) => {
  const [showForm, setShowForm] = useState(false)
  const [submittedFeedback, setSubmittedFeedback] = useState(false)
  const [loading, setLoading] = useState(false)
  const inlineFeedbackRef = useRef<HTMLDivElement>(null)
  const inlineQuestionRef = useRef<HTMLDivElement>(null)
  const inlineMessageRef = useRef<HTMLDivElement>(null)
  const [positiveFeedback, setPositiveFeedback] = useState(false)
  const [message, setMessage] = useState("")
  const nodeRef: React.RefObject<HTMLDivElement> = submittedFeedback
    ? inlineMessageRef
    : showForm
    ? inlineQuestionRef
    : inlineFeedbackRef

  const pathname = usePathname()
  const { loaded, track } = useAnalytics()
  const { area } = useArea()

  function handleFeedback(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    if (!loaded) {
      return
    }
    const feedback = (e.target as Element).classList.contains("positive")
    setPositiveFeedback(feedback)
    setShowForm(true)
    submitFeedback(e, feedback)
  }

  function submitFeedback(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    feedback = false
  ) {
    if (showForm) {
      setLoading(true)
    }
    track(
      event,
      {
        url: pathname,
        label: document.title,
        feedback:
          (feedback !== null && feedback) ||
          (feedback === null && positiveFeedback)
            ? "yes"
            : "no",
        message: message?.length ? message : null,
        ...extraData,
      },
      function () {
        if (showForm) {
          setLoading(false)
          resetForm()
        }
      }
    )
  }

  function resetForm() {
    setShowForm(false)
    setSubmittedFeedback(true)
  }

  return (
    <div className={clsx("mt-3", className)}>
      <SwitchTransition mode="out-in">
        <CSSTransition
          key={
            showForm
              ? "show_form"
              : !submittedFeedback
              ? "feedback"
              : "submitted_feedback"
          }
          nodeRef={nodeRef}
          timeout={300}
          addEndListener={(done) => {
            nodeRef.current?.addEventListener("transitionend", done, false)
          }}
          classNames={{
            enter: "animate-fadeIn animate-fill-forwards animate-fast",
            exit: "animate-fadeOut animate-fill-forwards animate-fast",
          }}
        >
          <>
            {!showForm && !submittedFeedback && (
              <div
                className="flex flex-row items-center"
                ref={inlineFeedbackRef}
              >
                <span className="text-body-regular mr-1.5">{question}</span>
                <Button
                  onClick={handleFeedback}
                  className="positive mr-0.5 w-fit last:mr-0"
                >
                  {positiveBtn}
                </Button>
                <Button
                  onClick={handleFeedback}
                  className="mr-0.5 w-fit last:mr-0"
                >
                  {negativeBtn}
                </Button>
                <Link
                  href={`https://github.com/medusajs/medusa/issues/new?assignees=&labels=type%3A+docs&template=docs.yml&title=API%20Ref%28${area}%29%3A%20Issue%20in%20${encodeURI(
                    sectionTitle
                  )}`}
                  className="btn-primary"
                >
                  Report Issue
                </Link>
              </div>
            )}
            {showForm && !submittedFeedback && (
              <div className="flex flex-col" ref={inlineQuestionRef}>
                <span className="mb-1">
                  {positiveFeedback ? positiveQuestion : negativeQuestion}
                </span>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="border-medusa-border-base dark:border-medusa-border-base-dark font-base rounded-sm border bg-transparent p-1"
                ></textarea>
                <Button
                  onClick={submitFeedback}
                  disabled={loading}
                  className="mt-1 w-fit"
                >
                  {submitBtn}
                </Button>
              </div>
            )}
            {submittedFeedback && (
              <div>
                <div
                  className="text-label-large-plus flex flex-col"
                  ref={inlineMessageRef}
                >
                  <span>{submitMessage}</span>
                  {showPossibleSolutions && (
                    <Solutions message={message} feedback={positiveFeedback} />
                  )}
                </div>
              </div>
            )}
          </>
        </CSSTransition>
      </SwitchTransition>
    </div>
  )
}

export default Feedback
