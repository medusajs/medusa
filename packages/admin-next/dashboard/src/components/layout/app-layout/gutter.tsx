import { PropsWithChildren } from "react"

export const Gutter = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex w-full max-w-[1200px] flex-col gap-y-2">
      {children}
    </div>
  )
}
