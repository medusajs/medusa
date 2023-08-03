import clsx from "clsx"

type NavbarIconButtonProps = React.HTMLAttributes<HTMLButtonElement>

const NavbarIconButton = ({
  children,
  className,
  ...props
}: NavbarIconButtonProps) => {
  return (
    <button
      className={clsx(
        // "bg-button-neutral dark:bg-button-neutral-dark",
        // "hover:bg-button-neutral-hover dark:hover:bg-no-image dark:hover:bg-medusa-button-neutral-hover-dark",
        // "active:bg-button-neutral-pressed dark:active:!bg-no-image dark:active:bg-medusa-button-neutral-pressed-dark",
        // "focus:bg-button-neutral focus:dark:bg-button-neutral-dark",
        // "focus:shadow-button-secondary-focus dark:focus:shadow-button-secondary-focus-dark",
        // "disabled:!bg-no-image disabled:bg-medusa-bg-disabled dark:disabled:bg-medusa-bg-disabled-dark",
        // "disabled:cursor-not-allowed",
        // "border-medusa-border-loud-muted dark:border-medusa-border-loud-muted-dark rounded border border-solid",
        // "flex cursor-pointer items-center justify-center p-[4px]",
        // "[&>svg]:h-[22px] [&>svg]:w-[22px]",
        "btn-primary btn-primary-icon",
        "[&>svg]:h-[22px] [&>svg]:w-[22px]",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export default NavbarIconButton
