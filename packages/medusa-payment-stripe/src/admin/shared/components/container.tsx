import { PropsWithChildren, ReactNode } from "react"

type Props = PropsWithChildren<{
  title: string
  description?: string
  icon?: ReactNode
}>

export const Container = ({ title, description, icon, children }: Props) => {
  return (
    <div className="border-grey-20 rounded-rounded flex flex-col gap-y-4 border bg-white pt-6 pb-8">
      <div className="px-8">
        <div className="flex items-center">
          {icon && <span className="mr-4">{icon}</span>}
          <h2 className="text-[24px] font-semibold leading-9">{title}</h2>
        </div>
        {description && (
          <p className="mt-2 text-sm text-gray-500">{description}</p>
        )}
      </div>
      <div>{children}</div>
    </div>
  )
}
