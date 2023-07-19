import IconSpinner from "@/components/Icons/Spinner"
import type IconProps from "@/components/Icons/types"
import clsx from "clsx"

type SpinnerLoadingProps = {
  iconProps?: IconProps
}

const SpinnerLoading = ({ iconProps }: SpinnerLoadingProps) => {
  return (
    <span role="status">
      <IconSpinner
        {...iconProps}
        className={clsx("animate-spin", iconProps?.className)}
      />
    </span>
  )
}

export default SpinnerLoading
