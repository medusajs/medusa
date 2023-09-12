import React, { cloneElement, useRef, useState } from "react"
import clsx from "clsx"
import { CSSTransition } from "react-transition-group"
import MDXSummary from "../MDXComponents/Summary"

export type DetailsProps = {
  openInitial?: boolean
  summary: React.ReactNode
  className?: string
} & React.HTMLAttributes<HTMLDetailsElement>

export default function Details({
  openInitial = false,
  summary,
  children,
  ...props
}: DetailsProps): JSX.Element {
  const [open, setOpen] = useState(openInitial)
  const [showContent, setShowContent] = useState(openInitial)
  const ref = useRef<HTMLDetailsElement>(null)
  const summaryElement = React.isValidElement(summary) ? (
    summary
  ) : (
    <MDXSummary>{summary ?? "Details"}</MDXSummary>
  )

  const handleToggle = () => {
    if (open) {
      setShowContent(false)
    } else {
      setOpen(true)
      setShowContent(true)
    }
  }

  return (
    <details
      {...props}
      ref={ref}
      open={open}
      onClick={(event) => {
        event.preventDefault()
      }}
      onToggle={(event) => {
        // this is to avoid event propagation
        // when details are nested, which is a bug
        // in react. Learn more here:
        // https://github.com/facebook/react/issues/22718
        event.stopPropagation()
      }}
      className={clsx(
        "border-x-0 border-y border-solid border-medusa-border-base dark:border-medusa-border-base-dark",
        "overflow-hidden [&>summary]:relative [&>summary]:z-[398]",
        props.className
      )}
    >
      {cloneElement(summaryElement, {
        open,
        onClick: handleToggle,
      })}
      {/* Solve type error as explained here: https://github.com/reactjs/react-transition-group/issues/729 */}
      <CSSTransition<undefined>
        unmountOnExit
        in={showContent}
        timeout={150}
        onEnter={(node: HTMLElement) => {
          node.classList.add(
            "!mb-2",
            "!mt-0",
            "translate-y-1",
            "transition-transform"
          )
        }}
        onExit={(node: HTMLElement) => {
          node.classList.add("transition-transform", "!-translate-y-1")
          setTimeout(() => {
            setOpen(false)
          }, 100)
        }}
      >
        <div>{children}</div>
      </CSSTransition>
    </details>
  )
}
