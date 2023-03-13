import { ReactNode } from "react"

type Props = {
  fileName: string
  fileSize?: string
  icon?: ReactNode
  onClick?: () => void
}

const BatchJobFileCard = ({ fileName, fileSize, icon, onClick }: Props) => {
  const preparedOnClick = onClick ?? (() => void 0)

  return (
    <div
      className="mt-4 flex w-full cursor-pointer items-center"
      onClick={preparedOnClick}
    >
      <div
        className="border-grey-20 flex items-center justify-center rounded-lg border p-2.5"
        title={fileName}
      >
        {!!icon && icon}
      </div>

      <div className="relative w-full pl-4 text-left">
        <div className="inter-small-regular max-w-[80%] overflow-hidden truncate">
          {fileName}
        </div>

        {!!fileSize && (
          <div className="text-grey-40 inter-small-regular">{fileSize}</div>
        )}
      </div>
    </div>
  )
}

export default BatchJobFileCard
