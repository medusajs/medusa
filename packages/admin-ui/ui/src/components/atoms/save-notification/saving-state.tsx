import React from "react"
import type { Toast } from "react-hot-toast"
import Spinner from "../spinner"
import ToasterContainer from "../toaster-container"

type SavingStateProps = {
  toast: Toast
  title?: string
  message?: string
}

const SavingState: React.FC<SavingStateProps> = ({
  toast,
  title = "Saving changes",
  message = "Hang on, this may take a few moments.",
}) => {
  return (
    <ToasterContainer visible={toast.visible} className="w-[448px]">
      <div>
        <Spinner variant="secondary" size="large" />
      </div>
      <div className="ml-small mr-base gap-y-2xsmall flex flex-grow flex-col">
        <span className="inter-small-semibold">{title}</span>
        <span className="inter-small-regular text-grey-50">{message}</span>
      </div>
    </ToasterContainer>
  )
}

export default SavingState
