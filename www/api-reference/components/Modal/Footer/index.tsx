import clsx from "clsx"
import Button, { ButtonProps } from "../../Button"

type ModalFooterProps = {
  actions: ButtonProps[]
  className?: string
}

const ModalFooter = ({ actions, className }: ModalFooterProps) => {
  return (
    <div
      className={clsx(
        "py-1.5 pl-0 pr-2",
        "border-medusa-border-base dark:border-medusa-border-base-dark border-0 border-t border-solid",
        "flex justify-end gap-0.5",
        className
      )}
    >
      {actions.map((action, index) => (
        <Button {...action} key={index} />
      ))}
    </div>
  )
}

export default ModalFooter
