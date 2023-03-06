import React from "react"
import Actionables, { ActionType } from "../../molecules/actionables"

type BannerCardProps = {
  actions?: ActionType[]
  title: string
  thumbnail: string | null
} & React.RefAttributes<HTMLDivElement>

type BannerCardDescriptionProps = {
  cta?: {
    label: string
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void
  }
}

const BannerCard: React.FC<BannerCardProps> & {
  Description: React.FC<BannerCardDescriptionProps>
  Footer: React.FC
} = ({ title, thumbnail, actions, children }) => {
  return (
    <div className="rounded-rounded border bg-grey-0 border-grey-20 w-full p-base medium:p-xlarge">
      <div className="flex gap-large items-start">
        {thumbnail && (
          <div className="min-w-[72px] min-h-[72px] w-[72px] h-[72px] rounded-base overflow-hidden">
            <img
              src={thumbnail}
              alt="Thumbnail"
              className="w-full h-full object-cover"
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
      <p className="inter-small-regular text-grey-50 max-w-[460px] line-clamp-2">
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

const Footer: React.FC = ({ children }) => {
  return <div className="mt-base">{children}</div>
}

BannerCard.Description = Description
BannerCard.Footer = Footer

export default BannerCard
