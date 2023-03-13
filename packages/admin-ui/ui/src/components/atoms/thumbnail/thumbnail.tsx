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
        "bg-grey-5 rounded-rounded flex items-center justify-center overflow-hidden",
        {
          "h-10 w-[30px]": size === "small",
          "h-12 w-9": size === "medium",
          "h-[226px] w-[170px]": size === "large",
        },
        className
      )}
    >
      {src ? (
        <img src={src} className="flex-1 object-cover object-center" />
      ) : (
        <ImagePlaceholderIcon />
      )}
    </div>
  )
}
