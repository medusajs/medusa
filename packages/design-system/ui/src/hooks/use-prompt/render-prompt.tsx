"use client"

import * as React from "react"

import { Input } from "@/components/input"
import { Label } from "@/components/label"
import { Prompt } from "@/components/prompt"

export interface RenderPromptProps {
  open: boolean
  title: string
  description: string
  variant?: "danger" | "confirmation"
  verificationText?: string
  verificationInstruction?: string
  cancelText?: string
  confirmText?: string
  onConfirm: () => void
  onCancel: () => void
}

export const RenderPrompt = ({
  /**
   * @ignore
   */
  open,
  /**
   * The variant of the prompt.
   */
  variant = "danger",
  /**
   * The prompt's title.
   */
  title,
  /**
   * The prompt's description.
   */
  description,
  /**
   * The text the user has to input in order to confirm the action.
   */
  verificationText,
  /**
   * The instruction for the verification text. Useful for passing a translated string to use instead of the default english one.
   * Should be in the format: "Please type {val} to confirm:"
   */
  verificationInstruction = "Please type {val} to confirm:",
  /**
   * The label for the Cancel button.
   */
  cancelText = "Cancel",
  /**
   * Label for the Confirm button.
   */
  confirmText = "Confirm",
  /**
   * @ignore
   */
  onConfirm,
  /**
   * @ignore
   */
  onCancel,
}: RenderPromptProps) => {
  const [userInput, setUserInput] = React.useState("")

  const handleUserInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(event.target.value)
  }

  const validInput = React.useMemo(() => {
    if (!verificationText) {
      return true
    }

    return userInput === verificationText
  }, [userInput, verificationText])

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!verificationText) {
      return
    }

    if (validInput) {
      onConfirm()
    }
  }

  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && open) {
        onCancel()
      }
    }

    document.addEventListener("keydown", handleEscape)

    return () => {
      document.removeEventListener("keydown", handleEscape)
    }
  }, [onCancel, open])

  let instructionParts = verificationInstruction.includes("{val}")
    ? verificationInstruction.split("{val}")
    : ["Please type", "to confirm:"]

  if (instructionParts.length !== 2) {
    instructionParts = ["Please type", "to confirm:"]
  }

  return (
    <Prompt open={open} variant={variant}>
      <Prompt.Content>
        <form onSubmit={handleFormSubmit}>
          <Prompt.Header>
            <Prompt.Title>{title}</Prompt.Title>
            <Prompt.Description>{description}</Prompt.Description>
          </Prompt.Header>
          {verificationText && (
            <div className="border-ui-border-base mt-6 flex flex-col gap-y-4 border-y p-6">
              <Label htmlFor="verificationText" className="text-ui-fg-subtle">
                {instructionParts[0]}{" "}
                <span className="text-ui-fg-base txt-compact-medium-plus">
                  {verificationText}
                </span>{" "}
                {instructionParts[1]}
              </Label>
              <Input
                autoFocus
                autoComplete="off"
                id="verificationText"
                placeholder={verificationText}
                onChange={handleUserInput}
              />
            </div>
          )}
          <Prompt.Footer>
            <Prompt.Cancel onClick={onCancel}>{cancelText}</Prompt.Cancel>
            <Prompt.Action
              disabled={!validInput}
              type={verificationText ? "submit" : "button"}
              onClick={verificationText ? undefined : onConfirm}
            >
              {confirmText}
            </Prompt.Action>
          </Prompt.Footer>
        </form>
      </Prompt.Content>
    </Prompt>
  )
}
RenderPrompt.displayName = "RenderPrompt"
