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
        "bg-button-neutral dark:bg-button-neutral-dark hover:!bg-no-image active:!bg-no-image hover:bg-medusa-button-neutral-hover dark:hover:bg-medusa-button-neutral-hover-dark",
        "active:bg-medusa-button-neutral-pressed dark:active:bg-medusa-button-neutral-pressed-dark",
        "focus:shadow-neutral-button-focused dark:focus:shadow-neutral-button-focused-dark",
        "border-medusa-border-neutral-buttons dark:border-medusa-border-neutral-buttons-dark rounded border border-solid",
        "flex h-2 w-2 cursor-pointer items-center justify-center",
        "hover:!bg-medusa-button-neutral-hover dark:hover:!bg-medusa-button-neutral-hover-dark",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export default NavbarIconButton
