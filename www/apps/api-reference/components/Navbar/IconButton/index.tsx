import clsx from "clsx"
import { Button, ButtonProps } from "docs-ui"

export type NavbarIconButtonProps = ButtonProps

const NavbarIconButton = ({
  children,
  className,
  ...props
}: NavbarIconButtonProps) => {
  return (
    <Button
      className={clsx(
        "[&>svg]:h-[22px] [&>svg]:w-[22px] btn-secondary-icon",
        className
      )}
      variant="secondary"
      {...props}
    >
      {children}
    </Button>
  )
}

export default NavbarIconButton
