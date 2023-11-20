import { useTranslation } from "react-i18next"
import SEO from "../components/seo"
import Layout from "../components/templates/layout"

const NotFoundPage = () => {
  const { t } = useTranslation()
  return (
    <Layout>
      <SEO title="404: Not found" />
      <h1>{t("NOT FOUND")}</h1>
      <p>{t("You just hit a route that doesn't exist... the sadness.")}</p>
    </Layout>
  )
}

export default NotFoundPage
