import React from "react"
import { toast as Controller, Toast } from "react-hot-toast"
import ToasterContainer from "../../atoms/toaster-container"
import CrossIcon from "../../fundamentals/icons/cross-icon"
import XCircleIcon from "../../fundamentals/icons/x-circle-icon"

type FormErrorToasterProps = {
  toast: Toast
  message: string | React.ReactNode
  title: string
}

const FormErrorToaster: React.FC<FormErrorToasterProps> = ({
  toast,
  message,
  title,
}) => {
  const onDismiss = () => {
    Controller.dismiss(toast.id)
  }

  return (
    <ToasterContainer visible={toast.visible}>
      <div>
        <XCircleIcon size={20} className="text-rose-40" />
      </div>
      <div className="ml-small mr-base gap-y-2xsmall text-grey-0 flex flex-grow flex-col">
        <span className="inter-small-semibold">{title}</span>
        <span className="inter-small-regular text-grey-20">{message}</span>
      </div>
      <div>
        <button onClick={onDismiss}>
          <CrossIcon size={20} className="text-grey-40" />
        </button>
        <span className="sr-only">Close</span>
      </div>
    </ToasterContainer>
  )
}

export default FormErrorToaster
