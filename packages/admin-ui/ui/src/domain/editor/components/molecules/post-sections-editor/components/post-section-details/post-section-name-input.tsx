import { FC, useEffect, useRef, useState } from "react"
import { Controller, useFormContext } from "react-hook-form"
import clsx from "clsx"
import EditIcon from "../../../../../../../components/fundamentals/icons/edit-icon"

export interface PostSectionNameInputProps {
  className?: string
}

export const PostSectionNameInput: FC<PostSectionNameInputProps> = ({
  className,
}) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const { control } = useFormContext()
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isEditing])

  return (
    <div
      className={clsx(
        "relative inter-xlarge-semibold leading-none flex items-center -mb-[3px] flex-grow-0 max-w-[560px]",
        className
      )}
    >
      <Controller
        name="name"
        control={control}
        render={({ field: { value, onChange } }) => (
          <>
            {isEditing && (
              <input
                ref={inputRef}
                value={value}
                onChange={onChange}
                onBlur={() => setIsEditing(false)}
                placeholder="Untitled"
                className={clsx(
                  "-mt-[0.5px] absolute top-0 left-0 w-[calc(100%+6px)] h-8 truncate !border-none placeholder:text-inherit focus:placeholder:text-grey-30 !bg-transparent outline-none leading-[inherit] truncate"
                )}
              />
            )}

            <>
              <button
                type="button"
                className="w-full inline-block flex gap-0 p-0 h-8 leading-8 items-center focus:text-violet-60 focus:outline-none focus:shadow-cta rounded-rounded"
                onClick={() => setIsEditing(true)}
              >
                <span
                  className={clsx("block max-w-full truncate", {
                    "opacity-0 invisible": isEditing,
                  })}
                >
                  {value || "Untitled"}
                </span>
                {!isEditing && (
                  <EditIcon className="w-5 h-5 ml-2 text-grey-40 flex-shrink-0" />
                )}
              </button>
            </>
          </>
        )}
      />
    </div>
  )
}
