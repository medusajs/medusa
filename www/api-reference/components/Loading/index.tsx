import clsx from "clsx"
import Skeleton, { SkeletonProps } from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"

const Loading = (props: SkeletonProps) => {
  return (
    <Skeleton
      count={10}
      containerClassName={clsx(
        "w-api-ref-content block",
        props.containerClassName
      )}
      {...props}
    />
  )
}

export default Loading
