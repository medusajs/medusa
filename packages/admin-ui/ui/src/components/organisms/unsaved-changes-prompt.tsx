import { FC } from "react"
import { Prompt, PromptProps } from "./prompt"

export interface UnsavedChangesPromptProps extends PromptProps {
  successText?: string | null
}

export const UnsavedChangesPrompt: FC<UnsavedChangesPromptProps> = ({
  cancelProps,
  confirmProps,
  saveAndConfirmProps,
  ...props
}) => (
  <Prompt
    heading="Are you sure you want to leave?"
    text={
      <div className="flex flex-col mt-3 gap-4">
        <p>
          Hey there! It looks like you're in the middle of writing something and
          you haven't saved all of your content.
        </p>
        <p>Save before you go!</p>
      </div>
    }
    cancelText="Stay"
    confirmText="Discard and leave"
    saveAndConfirmText="Save and leave"
    successText={null}
    cancelProps={{ variant: "secondary", ...cancelProps }}
    confirmProps={{ variant: "nuclear", ...confirmProps }}
    saveAndConfirmProps={{ variant: "primary", ...saveAndConfirmProps }}
    {...props}
  />
)
