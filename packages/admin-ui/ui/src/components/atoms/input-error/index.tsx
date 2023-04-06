import { ErrorMessage } from "@hookform/error-message"
import clsx from "clsx"
import { MultipleFieldErrors } from "react-hook-form"
import Tooltip from "../tooltip"

type InputErrorProps = {
  errors?: { [x: string]: unknown }
  name?: string
  className?: string
}

const InputError = ({ errors, name, className }: InputErrorProps) => {
  if (!errors || !name) {
    return null
  }

  return (
    <ErrorMessage
      name={name}
      errors={errors}
      render={({ message, messages }) => {
        return (
          <div
            className={clsx("inter-small-regular mt-2 text-rose-50", className)}
          >
            {messages ? (
              <MultipleMessages messages={messages} />
            ) : (
              <p>{message}</p>
            )}
          </div>
        )
      }}
    />
  )
}

const MultipleMessages = ({ messages }: { messages: MultipleFieldErrors }) => {
  const errors = Object.entries(messages).map(([_, message]) => message)

  const displayedError = errors[0]
  const remainderErrors = errors.slice(1)

  return (
    <div className="flex cursor-default items-center gap-x-1">
      <p>{displayedError}</p>
      {remainderErrors?.length > 0 && (
        <Tooltip
          content={
            <div className="inter-small-regular text-rose-50">
              {remainderErrors.map((e, i) => {
                return (
                  <p key={i}>
                    {Array.from(Array(i + 1)).map((_) => "*")}
                    {e}
                  </p>
                )
              })}
            </div>
          }
        >
          <p>
            +{remainderErrors.length}{" "}
            {remainderErrors.length > 1 ? "errors" : "error"}
          </p>
        </Tooltip>
      )}
    </div>
  )
}

export default InputError
