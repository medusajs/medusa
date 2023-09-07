import React, { useRef, useState, useEffect } from "react"
import { CSSTransition, SwitchTransition } from "react-transition-group"

import useIsBrowser from "@docusaurus/useIsBrowser"
import { useLocation } from "@docusaurus/router"
import uuid from "react-uuid"
import Solutions from "./Solutions/index"
import Button from "../Button"
import { useUser } from "@site/src/providers/User"
import Details from "../../theme/Details"
import TextArea from "../TextArea"
import Label from "../Label"
import InputText from "../Input/Text"

type FeedbackProps = {
  event?: string
  question?: string
  positiveBtn?: string
  negativeBtn?: string
  positiveQuestion?: string
  negativeQuestion?: string
  submitBtn?: string
  submitMessage?: string
  showPossibleSolutions?: boolean
  className?: string
  showLongForm?: boolean
} & React.HTMLAttributes<HTMLDivElement>

const Feedback: React.FC<FeedbackProps> = ({
  event,
  question = "Was this page helpful?",
  positiveBtn = "Yes",
  negativeBtn = "No",
  positiveQuestion = "What was most helpful?",
  negativeQuestion = "What can we improve?",
  submitBtn = "Submit",
  submitMessage = "Thank you for helping improve our documentation!",
  showPossibleSolutions = true,
  className = "",
  showLongForm = true,
}) => {
  const [showForm, setShowForm] = useState(false)
  const [submittedFeedback, setSubmittedFeedback] = useState(false)
  const [loading, setLoading] = useState(false)
  const inlineFeedbackRef = useRef(null)
  const inlineQuestionRef = useRef(null)
  const inlineMessageRef = useRef(null)
  const [positiveFeedback, setPositiveFeedback] = useState(false)
  const [message, setMessage] = useState("")
  const [id, setId] = useState(null)
  const nodeRef = submittedFeedback
    ? inlineMessageRef
    : showForm
    ? inlineQuestionRef
    : inlineFeedbackRef

  const isBrowser = useIsBrowser()
  const location = useLocation()
  const { track } = useUser()
  const [steps, setSteps] = useState("")
  const [medusaVersion, setMedusaVersion] = useState("")
  const [errorFix, setErrorFix] = useState("")
  const [contactInfo, setContactInfo] = useState("")

  function handleFeedback(e) {
    const feedback = e.target.classList.contains("positive")
    setPositiveFeedback(feedback)
    setShowForm(true)
    submitFeedback(e, feedback)
  }

  function submitFeedback(e, feedback = null) {
    if (isBrowser) {
      if (showForm) {
        setLoading(true)
      }
      track(
        event,
        {
          url: location.pathname,
          label: document.title,
          feedback:
            (feedback !== null && feedback) ||
            (feedback === null && positiveFeedback)
              ? "yes"
              : "no",
          message: message?.length ? message : null,
          os: isBrowser ? window.navigator.userAgent : "",
          additional_data: {
            steps,
            medusaVersion,
            errorFix,
            contactInfo,
          },
        },
        function () {
          if (showForm) {
            setLoading(false)
            resetForm()
          }
        }
      )
    }
  }

  function resetForm() {
    setShowForm(false)
    setSubmittedFeedback(true)
    if (message) {
      setId(null)
    }
  }

  useEffect(() => {
    if (!id) {
      setId(uuid())
    }
  }, [id])

  return (
    <div className={`py-2 ${className}`}>
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
            nodeRef.current.addEventListener("transitionend", done, false)
          }}
          classNames={{
            enter: "animate__animated animate__fadeIn animate__fastest",
            exit: "animate__animated animate__fadeOut animate__fastest",
          }}
        >
          <>
            {!showForm && !submittedFeedback && (
              <div
                className="flex flex-row items-center"
                ref={inlineFeedbackRef}
              >
                <Label className="mr-1.5">{question}</Label>
                <Button
                  onClick={handleFeedback}
                  className="w-fit mr-0.5 last:mr-0 positive"
                >
                  {positiveBtn}
                </Button>
                <Button
                  onClick={handleFeedback}
                  className="w-fit mr-0.5 last:mr-0"
                >
                  {negativeBtn}
                </Button>
              </div>
            )}
            {showForm && !submittedFeedback && (
              <div className="flex flex-col" ref={inlineQuestionRef}>
                <Label className="mb-1">
                  {positiveFeedback ? positiveQuestion : negativeQuestion}
                </Label>
                <TextArea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                {showLongForm && !positiveFeedback && (
                  <Details summary="More Details" className="mt-1">
                    <div className="flex flex-col gap-0.5">
                      <div className="flex flex-col gap-0.5">
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
                      <div className="flex flex-col gap-0.5">
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
                      <div className="flex flex-col gap-0.5">
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
                      <div className="flex flex-col gap-0.5">
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
                  className="mt-1 w-fit"
                >
                  {submitBtn}
                </Button>
              </div>
            )}
            {submittedFeedback && (
              <div>
                <div
                  className="flex flex-col text-compact-large-plus"
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
