"use client"

import React, { useRef, useState } from "react"
import { CSSTransition, SwitchTransition } from "react-transition-group"
import { Solutions } from "./Solutions"
import { ExtraData, useAnalytics } from "@/providers/Analytics"
import clsx from "clsx"
import { Button, TextArea, Label, Details, InputText } from "@/components"

export type FeedbackProps = {
  event: string
  pathName: string
  reportLink?: string
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
  vertical?: boolean
  showLongForm?: boolean
} & React.HTMLAttributes<HTMLDivElement>

export const Feedback = ({
  event,
  pathName,
  reportLink,
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
  vertical = false,
  showLongForm = false,
}: FeedbackProps) => {
  const [showForm, setShowForm] = useState(false)
  const [submittedFeedback, setSubmittedFeedback] = useState(false)
  const [loading, setLoading] = useState(false)
  const inlineFeedbackRef = useRef<HTMLDivElement>(null)
  const inlineQuestionRef = useRef<HTMLDivElement>(null)
  const inlineMessageRef = useRef<HTMLDivElement>(null)
  const [positiveFeedback, setPositiveFeedback] = useState(false)
  const [message, setMessage] = useState("")
  const [steps, setSteps] = useState("")
  const [medusaVersion, setMedusaVersion] = useState("")
  const [errorFix, setErrorFix] = useState("")
  const [contactInfo, setContactInfo] = useState("")
  const nodeRef: React.RefObject<HTMLDivElement> = submittedFeedback
    ? inlineMessageRef
    : showForm
    ? inlineQuestionRef
    : inlineFeedbackRef
  const { loaded, track } = useAnalytics()

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
        url: pathName,
        label: document.title,
        feedback:
          (feedback !== null && feedback) ||
          (feedback === null && positiveFeedback)
            ? "yes"
            : "no",
        message: message?.length ? message : null,
        os: window.navigator.userAgent,
        steps,
        medusaVersion,
        errorFix,
        contactInfo,
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
    <div className={clsx("mt-docs_3", className)}>
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
            enter: "animate-fadeIn animation-fill-forwards animate-fast",
            exit: "animate-fadeOut animation-fill-forwards animate-fast",
          }}
        >
          <>
            {!showForm && !submittedFeedback && (
              <div
                className={clsx(
                  "flex",
                  !vertical && "flex-row items-center",
                  vertical && "flex-col justify-center gap-docs_1"
                )}
                ref={inlineFeedbackRef}
              >
                <Label className="mr-docs_1.5">{question}</Label>
                <div
                  className={clsx("flex flex-row items-center gap-docs_0.5")}
                >
                  <Button
                    onClick={handleFeedback}
                    className="positive w-fit"
                    variant="secondary"
                  >
                    {positiveBtn}
                  </Button>
                  <Button
                    onClick={handleFeedback}
                    className="w-fit"
                    variant="secondary"
                  >
                    {negativeBtn}
                  </Button>
                  {reportLink && (
                    <Button variant="secondary">
                      <a href={reportLink}>Report Issue</a>
                    </Button>
                  )}
                </div>
              </div>
            )}
            {showForm && !submittedFeedback && (
              <div className="flex flex-col gap-docs_1" ref={inlineQuestionRef}>
                <Label>
                  {positiveFeedback ? positiveQuestion : negativeQuestion}
                </Label>
                <TextArea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                {showLongForm && !positiveFeedback && (
                  <Details summaryContent="More Details" className="mt-docs_1">
                    <div className="flex flex-col gap-docs_0.5">
                      <div className="flex flex-col gap-docs_0.5">
                        <Label>
                          Can you provide the exact steps you took before
                          receiving the error? For example, the commands you
                          ran.
                        </Label>
                        <TextArea
                          rows={4}
                          value={steps}
                          onChange={(e) => setSteps(e.target.value)}
                          placeholder="1. I ran npm dev..."
                        />
                      </div>
                      <div className="flex flex-col gap-docs_0.5">
                        <Label>
                          If applicable, what version of Medusa are you using?
                          If a plugin is related to the error, please provide a
                          version of that as well.
                        </Label>
                        <TextArea
                          rows={4}
                          value={medusaVersion}
                          onChange={(e) => setMedusaVersion(e.target.value)}
                          placeholder="@medusajs/medusa: vX"
                        />
                      </div>
                      <div className="flex flex-col gap-docs_0.5">
                        <Label>
                          Were you able to fix the error? If so, what steps did
                          you follow?
                        </Label>
                        <TextArea
                          rows={4}
                          value={errorFix}
                          onChange={(e) => setErrorFix(e.target.value)}
                          placeholder="@medusajs/medusa: vX"
                        />
                      </div>
                      <div className="flex flex-col gap-docs_0.5">
                        <Label>
                          Can you provide your email or discord username? This
                          would allow us to contact you for further info or
                          assist you with your issue.
                        </Label>
                        <InputText
                          value={contactInfo}
                          onChange={(e) => setContactInfo(e.target.value)}
                          placeholder="user@example.com"
                        />
                      </div>
                    </div>
                  </Details>
                )}
                <Button
                  onClick={submitFeedback}
                  disabled={loading}
                  className="w-fit"
                  variant="secondary"
                >
                  {submitBtn}
                </Button>
              </div>
            )}
            {submittedFeedback && (
              <div>
                <div
                  className="text-compact-large-plus flex flex-col"
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
