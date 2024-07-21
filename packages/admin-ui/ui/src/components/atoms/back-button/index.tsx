import clsx from "clsx"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import ArrowLeftIcon from "../../fundamentals/icons/arrow-left-icon"
import ArrowRightIcon from "../../fundamentals/icons/arrow-right-icon"

type Props = {
  path?: string
  label?: string
  className?: string
}

const BackButton = ({ path, label, className }: Props) => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  return (
    <button
      onClick={() => {
        path ? navigate(path) : navigate(-1)
      }}
      className={clsx("px-small py-xsmall", className)}
    >
      <div className="gap-x-xsmall text-grey-50 inter-grey-40 inter-small-semibold flex items-center">
        {i18n.dir() == "rtl" ? (
          <ArrowRightIcon size={20} />
        ) : (
          <ArrowLeftIcon size={20} />
        )}

        <span className="ms-1">
          {label || t("back-button-go-back", "Go back")}
        </span>
      </div>
    </button>
  )
}

export default BackButton
