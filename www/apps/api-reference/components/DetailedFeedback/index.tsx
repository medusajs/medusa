"use client"

import { useState } from "react"
import { Label, TextArea, useAnalytics, useModal, ModalFooter } from "docs-ui"

const DetailedFeedback = () => {
  const [improvementFeedback, setImprovementFeedback] = useState("")
  const [positiveFeedback, setPositiveFeedback] = useState("")
  const [additionalFeedback, setAdditionalFeedback] = useState("")
  const { loaded, track } = useAnalytics()
  const { closeModal } = useModal()

  return (
    <>
      <div className="flex flex-col gap-1 overflow-auto py-1.5 px-2 lg:min-h-[400px]">
        <div className="flex flex-col gap-1">
          <Label>What should be improved in this API reference?</Label>
          <TextArea
            rows={4}
            value={improvementFeedback}
            onChange={(e) => setImprovementFeedback(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label>Is there a feature you like in this API reference?</Label>
          <TextArea
            rows={4}
            value={positiveFeedback}
            onChange={(e) => setPositiveFeedback(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label>Do you have any additional notes or feedback?</Label>
          <TextArea
            rows={4}
            value={additionalFeedback}
            onChange={(e) => setAdditionalFeedback(e.target.value)}
          />
        </div>
      </div>
      <ModalFooter
        actions={[
          {
            children: "Save",
            onClick: (e) => {
              if (
                !loaded ||
                (!improvementFeedback &&
                  !positiveFeedback &&
                  !additionalFeedback)
              ) {
                return
              }
              const buttonElm = e.target as HTMLButtonElement
              buttonElm.classList.add("cursor-not-allowed")
              buttonElm.textContent = "Please wait"
              track(
                "api-ref-general-feedback",
                {
                  feedbackData: {
                    improvementFeedback,
                    positiveFeedback,
                    additionalFeedback,
                  },
                },
                function () {
                  buttonElm.textContent = "Thank you!"
                  setTimeout(() => {
                    closeModal()
                  }, 1000)
                }
              )
            },
            variant: "primary",
          },
        ]}
        className="mt-1"
      />
    </>
  )
}

export default DetailedFeedback
