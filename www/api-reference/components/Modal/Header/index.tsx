import clsx from "clsx"
import { useModal } from "../../../providers/modal"
import IconXMark from "../../Icons/XMark"
import Button from "../../Button"

type ModalHeaderProps = {
  title?: string
}

const ModalHeader = ({ title }: ModalHeaderProps) => {
  const { closeModal } = useModal()

  return (
    <div
      className={clsx(
        "border-medusa-border-base dark:border-medusa-border-base-dark border-0 border-b border-solid py-1.5 px-2",
        "flex items-center justify-between"
      )}
    >
      <span
        className={clsx(
          "text-medusa-fg-base dark:text-medusa-fg-base-dark text-h2"
        )}
      >
        {title}
      </span>
      <Button
        variant="clear"
        className="cursor-pointer"
        onClick={() => closeModal()}
      >
        <IconXMark />
      </Button>
    </div>
  )
}

export default ModalHeader
