import clsx from "clsx"
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react"
import TrashIcon from "../../fundamentals/icons/trash-icon"
import Spinner from "../spinner"
import Tooltip from "../tooltip"

type Props = {
  onDelete: () => void
  deleting?: boolean
  className?: string
  children?: React.ReactNode
}

const TwoStepDelete = forwardRef<HTMLButtonElement, Props>(
  ({ onDelete, deleting = false, children, className }: Props, ref) => {
    const [armed, setArmed] = useState(false)
    const innerRef = useRef<HTMLButtonElement>(null)

    useImperativeHandle<HTMLButtonElement | null, HTMLButtonElement | null>(
      ref,
      () => innerRef.current
    )

    const handleTwoStepDelete = () => {
      if (!armed) {
        setArmed(true)
        return
      }

      onDelete()
      setArmed(false)
    }

    const disarmOnClickOutside = useCallback(
      (e: MouseEvent) => {
        if (innerRef.current && !innerRef.current.contains(e.target as Node)) {
          if (armed) {
            setArmed(false)
          }
        }
      },
      [armed]
    )

    useEffect(() => {
      document.addEventListener("mousedown", disarmOnClickOutside)

      return () => {
        document.removeEventListener("mousedown", disarmOnClickOutside)
      }
    }, [disarmOnClickOutside])

    return (
      <button
        className={clsx(
          "flex items-center justify-center rounded-lg border transition-all",
          {
            "border-rose-50 bg-rose-50 px-3 py-1.5": armed,
            "border-gray-20 bg-transparent p-1.5": !armed,
          },
          {
            "!bg-grey-40 !border-grey-40 !p-1.5": deleting,
          },
          className
        )}
        disabled={deleting}
        onClick={handleTwoStepDelete}
        ref={innerRef}
      >
        <div
          className={clsx("inter-small-semibold text-rose-50", {
            hidden: armed || deleting,
          })}
        >
          {children || <TrashIcon className="text-grey-50" size={20} />}
        </div>
        <span
          className={clsx("inter-small-semibold text-white", {
            hidden: !armed || deleting,
          })}
        >
          <Tooltip
            content="Are you sure?"
            side="top"
            sideOffset={16}
            open={armed}
          >
            Confirm
          </Tooltip>
        </span>
        <span
          className={clsx("flex items-center justify-center", {
            hidden: !deleting,
          })}
        >
          <Spinner size="medium" />
        </span>
      </button>
    )
  }
)

export default TwoStepDelete
