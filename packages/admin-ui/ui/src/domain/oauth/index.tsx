import { useParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import Button from "../../components/fundamentals/button"
import Medusa from "../../services/api"

const Oauth = () => {
  const { t } = useTranslation()
  const { app_name, code, state } = useParams()
  return (
    <>
      <div>{app_name}</div>
      <Button
        variant="primary"
        size="large"
        onClick={() =>
          Medusa.apps.authorize({
            application_name: app_name,
            code,
            state,
          })
        }
      >
        {t("oauth-complete-installation", "Complete Installation")}
      </Button>
    </>
  )
}

export default Oauth
