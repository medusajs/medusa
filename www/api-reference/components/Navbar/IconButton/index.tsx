import clsx from "clsx"

export type NavbarIconButtonProps = React.HTMLAttributes<HTMLButtonElement>

const NavbarIconButton = ({
  children,
  className,
  ...props
}: NavbarIconButtonProps) => {
  return (
    <button
      className={clsx(
        "btn-secondary btn-secondary-icon",
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
