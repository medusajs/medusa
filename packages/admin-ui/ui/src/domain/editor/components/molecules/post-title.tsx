import {
  ChangeEvent,
  FC,
  forwardRef,
  InputHTMLAttributes,
  useEffect,
  useRef,
  useState,
} from "react"
import { Controller, useFormContext } from "react-hook-form"
import TextareaAutosize, {
  TextareaAutosizeProps,
} from "react-textarea-autosize"
import clsx from "clsx"
import { useUpdatePostDraft } from "../../helpers/use-update-post-draft"
import { usePostContext } from "../../context"
import { checkHandle } from "../../helpers/check-handle"
import EditIcon from "../../../../components/fundamentals/icons/edit-icon"

export interface PostTitleProps {
  variant: "basic" | "advanced"
}

export interface PostTitleBasicProps extends TextareaAutosizeProps {}

export interface PostTitleAdvancedProps {
  className?: string
  inputProps?: InputHTMLAttributes<HTMLInputElement>
}

const PostTitleBasic = forwardRef<HTMLTextAreaElement, PostTitleBasicProps>(
  (props, ref) => {
    const handleKeyDown = (event) => {
      if (event.key === "Enter") {
        // Prevent line breaks in title
        event.preventDefault()
      }
    }

    return (
      <TextareaAutosize
        {...props}
        ref={ref}
        className="text-5xl font-bold outline-none resize-none overflow-hidden"
        onKeyDown={handleKeyDown}
      />
    )
  }
)

const PostTitleAdvanced: FC<PostTitleAdvancedProps> = ({
  className,
  inputProps,
}) => {
  const isReadOnly = inputProps?.readOnly
  const inputRef = useRef<HTMLInputElement>(null)
  const { control } = useFormContext()
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isEditing])

  const placeholder = inputProps?.placeholder || "Untitled"

  return (
    <div>
      <div
        className={clsx(
          "relative inter-xlarge-semibold flex items-center flex-grow-0 max-w-full",
          className
        )}
      >
        <Controller
          name="title"
          control={control}
          render={({ field: { value } }) => {
            return (
              <>
                {!isReadOnly && isEditing && (
                  <input
                    {...inputProps}
                    ref={inputRef}
                    value={value || ""}
                    onBlur={(event) => {
                      if (inputProps?.onBlur) inputProps?.onBlur(event)
                      setIsEditing(false)
                    }}
                    placeholder={placeholder}
                    className={clsx(
                      "absolute top-0 left-0 w-full truncate leading-[inherit] !border-none placeholder:text-inherit focus:placeholder:text-grey-40 !bg-transparent outline-none"
                    )}
                  />
                )}

                <>
                  <button
                    type="button"
                    className={clsx(
                      "flex max-w-full gap-0 p-0 items-center leading-[inherit] focus:text-violet-60 focus:outline-none focus:shadow-cta rounded-rounded",
                      {
                        "text-grey-40": !value,
                        "pointer-events-none": isReadOnly,
                      }
                    )}
                    onClick={() => (!isReadOnly ? setIsEditing(true) : null)}
                  >
                    <span
                      className={clsx("max-w-full truncate", {
                        "opacity-0 invisible": isEditing,
                      })}
                    >
                      {value || placeholder}
                    </span>

                    {!isReadOnly && !isEditing && (
                      <EditIcon className="w-5 h-5 ml-1 -mr-1 text-grey-40 flex-shrink-0" />
                    )}
                  </button>
                </>
              </>
            )
          }}
        />
      </div>
    </div>
  )
}

export const PostTitle: FC<PostTitleProps> = ({ variant }) => {
  const { register, setValue, getValues } = useFormContext()
  const { post, postTypeLabel, featureFlags } = usePostContext()
  const { updatePostDraft } = useUpdatePostDraft()

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (featureFlags.title !== true) return

    const title = event.target.value

    setValue("title", title, { shouldDirty: true })
    updatePostDraft({ title })
  }

  const handleBlur = async (event) => {
    if (featureFlags.title !== true) return

    const handle = getValues("handle")
    const title = event.target.value

    if (handle || !title) {
      // Don't update handle if it's already set or if title is empty
      return
    }

    const { suggestedHandle } = await checkHandle(title, post?.id)

    setValue("handle", suggestedHandle)
    updatePostDraft({ handle: suggestedHandle })
  }

  if (!featureFlags.title) return null

  return (
    <>
      {variant === "basic" && (
        <PostTitleBasic
          placeholder={`${postTypeLabel} title`}
          readOnly={featureFlags.title === "readonly"}
          {...register("title", {
            onChange: handleChange,
            onBlur: handleBlur,
          })}
        />
      )}

      {variant === "advanced" && (
        <PostTitleAdvanced
          inputProps={{
            placeholder: `${postTypeLabel} title`,
            onChange: handleChange,
            onBlur: handleBlur,
            readOnly: featureFlags.title === "readonly",
          }}
        />
      )}
    </>
  )
}
