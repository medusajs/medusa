import { Suspense, useState } from "react"
import Loading from "../Loading"

export type DetailsProps = {
  openInitial?: boolean
  summaryContent?: React.ReactNode
  summaryElm?: React.ReactNode
} & React.HTMLAttributes<HTMLDetailsElement>

const Details = ({
  openInitial = false,
  summaryContent,
  summaryElm,
  children,
  ...props
}: DetailsProps) => {
  const [open, setOpen] = useState(openInitial)

  return (
    <details
      open={open}
      onToggle={(event) => {
        // this is to avoid event propagation
        // when details are nested, which is a bug
        // in react. Learn more here:
        // https://github.com/facebook/react/issues/22718
        event.stopPropagation()
        setOpen(!open)
      }}
      {...props}
    >
      {summaryContent && <summary>{summaryContent}</summary>}
      {summaryElm}
      {open && <Suspense fallback={<Loading />}>{children}</Suspense>}
    </details>
  )
}

export default Details
