import { useTranslation } from "react-i18next"
import LanguageMenu from "./language-menu"

const LanguageSettings = () => {
  const { t } = useTranslation()

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="gap-y-2xsmall flex flex-col">
          <div className="gap-x-xsmall flex items-center">
            <h2 className="inter-base-semibold">
              {t("personal-information-language-settings-title", "Language")}
            </h2>
          </div>
          <p className="inter-base-regular text-grey-50">
            {t(
              "personal-information-language-settings-description",
              "Adjust the language of Medusa Admin"
            )}
          </p>
        </div>
        <LanguageMenu />
      </div>
      <div className="mt-small">
        <a
          href="/"
          target="_blank"
          className="text-blue-500"
          rel="noopener noreferrer"
        >
          {t(
            "personal-information-language-settings-help-us-translate",
            "Help us translate"
          )}
        </a>
      </div>
    </>
  )
}

export default LanguageSettings
