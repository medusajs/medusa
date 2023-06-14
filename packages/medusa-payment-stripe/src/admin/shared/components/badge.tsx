import React from "react"

type BadgeProps = React.HTMLAttributes<HTMLDivElement>

const Badge: React.FC<BadgeProps> = ({
  children,
  onClick,
  className,
  ...props
}) => {
  return (
    <div
      className="badge badge-ghost rounded-full py-1 px-3"
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  )
}

export default Badge
