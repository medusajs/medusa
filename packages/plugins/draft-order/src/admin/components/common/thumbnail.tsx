import { Photo } from "@zjedene-medusa/icons"

interface ThumbnailProps {
  thumbnail?: string | null
  alt?: string | null
}

export const Thumbnail = ({ thumbnail, alt = "" }: ThumbnailProps) => {
  return (
    <div className="relative w-6 h-8 rounded overflow-hidden flex items-center justify-center bg-ui-bg-component">
      {thumbnail ? (
        <img
          src={thumbnail}
          className="w-full h-full object-cover"
          alt={alt ?? undefined}
        />
      ) : (
        <Photo />
      )}
    </div>
  )
}
