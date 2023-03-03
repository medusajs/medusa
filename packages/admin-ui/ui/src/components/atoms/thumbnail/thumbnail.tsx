import clsx from "clsx"
import ImagePlaceholderIcon from "../../fundamentals/icons/image-placeholder-icon"

type Props = {
  src?: string | null
  className?: string
  size?: "small" | "medium" | "large"
}

export const Thumbnail = ({ src, className, size = "small" }: Props) => {
  return (
    <div
      className={clsx(
        "bg-grey-5 flex items-center justify-center overflow-hidden rounded-rounded",
        {
          "w-[30px] h-10": size === "small",
          "w-9 h-12": size === "medium",
          "w-[170px] h-[226px]": size === "large",
        },
        className
      )}
    >
      {src ? (
        <img src={src} className="object-cover object-center flex-1" />
      ) : (
        <ImagePlaceholderIcon />
      )}
    </div>
  )
}
