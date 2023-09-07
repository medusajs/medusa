import { CopyButtonProps } from "@/components/CopyButton"
import clsx from "clsx"
import dynamic from "next/dynamic"
import SpinnerLoading from "../Loading/Spinner"

const CopyButton = dynamic<CopyButtonProps>(
  async () => import("../CopyButton"),
  {
    loading: () => <SpinnerLoading />,
  }
) as React.FC<CopyButtonProps>

export type InlineCodeProps = React.ComponentProps<"code">

const InlineCode = (props: InlineCodeProps) => {
  const isInline = typeof props.children === "string"
  return (
    <>
      {!isInline && <code {...props} />}
      {isInline && (
        <CopyButton
          text={props.children as string}
          buttonClassName={clsx(
            "bg-transparent border-0 p-0 inline text-medusa-fg-subtle dark:text-medusa-fg-subtle-dark",
            "active:[&>code]:bg-medusa-bg-subtle-pressed dark:active:[&>code]:bg-medusa-bg-subtle-pressed-dark",
            "focus:[&>code]:bg-medusa-bg-subtle-pressed dark:focus:[&>code]:bg-medusa-bg-subtle-pressed-dark",
            "hover:[&>code]:bg-medusa-bg-subtle-hover dark:hover:[&>code]:bg-medusa-bg-base-hover-dark"
          )}
        >
          <code
            {...props}
            className={clsx(
              "border-medusa-tag-neutral-border dark:border-medusa-tag-neutral-border-dark border",
              "text-medusa-tag-neutral-text dark:text-medusa-tag-neutral-text-dark",
              "bg-medusa-tag-neutral-bg dark:bg-medusa-tag-neutral-bg-dark font-monospace text-code-label rounded-sm py-0 px-[6px]",
              props.className
            )}
          />
        </CopyButton>
      )}
    </>
  )
}

export default InlineCode
