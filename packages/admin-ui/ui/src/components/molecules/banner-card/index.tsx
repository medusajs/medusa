import React, { PropsWithChildren } from "react"
import Actionables, { ActionType } from "../../molecules/actionables"

type BannerCardProps = PropsWithChildren<{
  actions?: ActionType[]
  title: string
  thumbnail?: string | null
}> &
  React.RefAttributes<HTMLDivElement>

type BannerCardDescriptionProps = PropsWithChildren<{
  cta?: {
    label: string
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void
  }
}>

const BannerCard: React.FC<BannerCardProps> & {
  Description: React.FC<BannerCardDescriptionProps>
  Footer: React.FC<PropsWithChildren>
} = ({ title, thumbnail, actions, children }) => {
  return (
    <div className="rounded-rounded bg-grey-0 border-grey-20 p-base medium:p-xlarge w-full border">
      <div className="gap-large flex items-start">
        {thumbnail && (
          <div className="rounded-base h-[72px] min-h-[72px] w-[72px] min-w-[72px] overflow-hidden">
            <img
              src={thumbnail}
              alt="Thumbnail"
              className="h-full w-full object-cover"
            />
          </div>
        )}
        <div className="w-full">
          <div className="flex items-center justify-between pb-2">
            <p className="inter-large-semibold">{title}</p>
            <Actionables actions={actions} />
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}

const Description: React.FC<BannerCardDescriptionProps> = ({
  cta,
  children,
}) => {
  return (
    <div>
      <p className="inter-small-regular text-grey-50 line-clamp-2 max-w-[460px]">
        {children}
      </p>
      {cta && (
        <button
          className="text-violet-60 inter-small-semibold mt-base"
          onClick={cta.onClick}
        >
          {cta.label}
        </button>
      )}
    </div>
  )
}

const Footer = ({ children }: PropsWithChildren) => {
  return <div className="mt-base">{children}</div>
}

BannerCard.Description = Description
BannerCard.Footer = Footer

export default BannerCard
