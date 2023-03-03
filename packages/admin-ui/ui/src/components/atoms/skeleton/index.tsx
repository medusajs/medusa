import clsx from "clsx"
import { PropsWithChildren } from "react"
import { useSkeleton } from "../../../providers/skeleton-provider"

type Props = PropsWithChildren<{
  isLoading?: boolean
}>

const Skeleton = ({ children, isLoading }: Props) => {
  const { isLoading: providerState = false } = useSkeleton()

  const state = isLoading || providerState

  return (
    <div
      className={clsx("h-fit w-fit", {
        "bg-grey-10 rounded-rounded animate-pulse [&>*]:opacity-0": state,
      })}
    >
      {children}
    </div>
  )
}

export default Skeleton
