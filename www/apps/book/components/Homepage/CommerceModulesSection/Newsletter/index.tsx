"use client"

import clsx from "clsx"
import HomepageCodeIcon from "./Code"
import { subscribeToNewsletter } from "../../../../utils/subscribe"
import { useEffect, useState } from "react"

const HomepageNewsletter = () => {
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
    if (message?.type === "error") {
      return
    }

    const timer = setTimeout(() => {
      setMessage(null)
    }, 5000)

    return () => clearTimeout(timer)
  }, [message])

  return (
    <div
      className={clsx(
        "p-2 w-full sm:w-1/2 lg:w-1/3",
        "flex flex-col gap-1",
        "bg-medusa-bg-component"
      )}
    >
      <div className="flex flex-col">
        <span className="text-medium-plus text-medusa-fg-base">
          Updates delivered monthly
        </span>
        <span className="text-medium text-medusa-fg-subtle">
          Get the latest product news and behind the scenes updates. Unsubscribe
          at any time.
        </span>
      </div>
      <HomepageCodeIcon />
      <div className="flex flex-col gap-0.5">
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
        {message && (
          <span className="text-medusa-fg-subtle">{message.text}</span>
        )}
      </div>
    </div>
  )
}

export default HomepageNewsletter
