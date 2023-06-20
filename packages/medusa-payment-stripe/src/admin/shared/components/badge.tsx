import { HTMLAttributes, FC } from "react"

type BadgeProps = HTMLAttributes<HTMLDivElement>

const Badge: FC<BadgeProps> = ({ children, onClick, ...props }) => {
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
