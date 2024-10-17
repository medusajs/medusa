import { PropsWithChildren } from "react"

export const VisuallyHidden = ({ children }: PropsWithChildren) => {
  return <span className="sr-only">{children}</span>
}
