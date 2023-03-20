import clsx from "clsx"

import Button from "../../fundamentals/button"
import CrossIcon from "../../fundamentals/icons/cross-icon"
import { ReactFCWithChildren } from "../../../types/utils"

type FocusModalElementProps = {
  className?: string
  children?: React.ReactNode
}

type IFocusModal = ReactFCWithChildren<FocusModalElementProps> & {
  Header: ReactFCWithChildren<FocusModalElementProps>
  Main: ReactFCWithChildren<FocusModalElementProps>
  BasicFocusModal: ReactFCWithChildren<BasicFocusModalProps>
}

type BasicFocusModalProps = {
  handleClose: (e) => void
  onSubmit: (e) => void
  cancelText?: string
  submitText?: string
  children?: React.ReactNode
}

const FocusModal: IFocusModal = ({ className, children }) => (
  <div
    className={clsx(
      "bg-grey-0 absolute inset-0 z-50 flex flex-col items-center",
      className
    )}
  >
    {children}
  </div>
)

FocusModal.Header = ({ children, className }) => (
  <div
    className={clsx(
      "border-b-grey-20 flex w-full justify-center border-b py-4",
      className
    )}
  >
    {children}
  </div>
)

FocusModal.Main = ({ children, className }) => (
  <div className={clsx("h-full w-full overflow-y-auto px-8", className)}>
    {children}
  </div>
)

FocusModal.BasicFocusModal = ({
  handleClose,
  onSubmit,
  children,
  cancelText = "Cancel",
  submitText = "Save changes",
}) => {
  return (
    <FocusModal>
      <BasicFocusModalHeader
        handleClose={handleClose}
        onSubmit={onSubmit}
        cancelText={cancelText}
        submitText={submitText}
      />
      <FocusModal.Main>{children}</FocusModal.Main>
    </FocusModal>
  )
}

const BasicFocusModalHeader: React.FC<BasicFocusModalProps> = ({
  handleClose,
  onSubmit,
  cancelText,
  submitText,
}) => {
  return (
    <FocusModal.Header>
      <div className="medium:w-8/12 flex w-full justify-between px-8">
        <Button
          size="small"
          variant="ghost"
          onClick={handleClose}
          className="rounded-rounded h-8 w-8 border"
        >
          <CrossIcon size={20} />
        </Button>
        <div className="gap-x-small flex">
          <Button
            onClick={handleClose}
            size="small"
            variant="ghost"
            className="rounded-rounded border"
          >
            {cancelText || "Cancel"}
          </Button>
          <Button
            size="small"
            variant="primary"
            onClick={onSubmit}
            className="rounded-rounded"
          >
            {submitText || "Save changes"}
          </Button>
        </div>
      </div>
    </FocusModal.Header>
  )
}

export default FocusModal
