"use client"

import clsx from "clsx"
import { useEffect, useRef, useState } from "react"
import { subscribeToNewsletter } from "../../../utils/subscribe"

type HomepageNewsletterFormProps = {
  className?: string
  autoFocus?: boolean
}

const HomepageNewsletterForm = ({
  className,
  autoFocus = false,
}: HomepageNewsletterFormProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState<{
    type: "error" | "success"
    text: string
  } | null>(null)
  const [loading, setLoading] = useState(false)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const { success, message } = await subscribeToNewsletter(email)

    if (success) {
      setMessage({
        type: "success",
        text: "You've been subscribed to the newsletter!",
      })
      setEmail("")
    } else {
      setMessage({
        type: "error",
        text: message || "An error occurred. Please try again later.",
      })
    }

    setLoading(false)
  }
  useEffect(() => {
    if (autoFocus) {
      inputRef.current?.focus()
    }
  }, [autoFocus])
  useEffect(() => {
    if (message?.type === "error") {
      return
    }

    const timer = setTimeout(() => {
      setMessage(null)
    }, 5000)

    return () => clearTimeout(timer)
  }, [message])

  return (
    <div className={clsx("flex flex-col gap-0.5", className)}>
      <form
        className={clsx(
          "py-[10px] px-0.75 flex gap-0.75 bg-medusa-bg-base",
          "shadow-elevation-card-rest dark:shadow-elevation-card-rest-dark",
          "rounded-sm w-full justify-between"
        )}
        onSubmit={handleSubmit}
      >
        <input
          className={clsx(
            "appearance-none text-base lg:text-compact-medium",
            "placeholder:text-medusa-fg-muted bg-transparent",
            "focus:outline-none flex-1 min-w-0"
          )}
          ref={inputRef}
          name="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          type="submit"
          className={clsx(
            "appearance-none bg-transparent p-0 text-compact-medium-plus",
            "text-medusa-fg-base disabled:text-medusa-fg-disabled flex-shrink-0 whitespace-nowrap",
            "hover:text-medusa-fg-subtle cursor-pointer"
          )}
          disabled={loading}
        >
          Subscribe
        </button>
      </form>
      {message && <span className="text-medusa-fg-subtle">{message.text}</span>}
    </div>
  )
}

export default HomepageNewsletterForm
