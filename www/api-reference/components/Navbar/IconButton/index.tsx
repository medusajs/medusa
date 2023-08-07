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
