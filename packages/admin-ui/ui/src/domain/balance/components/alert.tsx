import { FC } from "react"
import { useNavigate } from "react-router-dom"
import Alert from "../../../components/molecules/alert"
import { useBasePath } from "../../../utils/routePathing"

export const BalanceAlert: FC<{}> = () => {
  const navigate = useNavigate()
  const basePath = useBasePath()
  return (
    <Alert
      variant="danger"
      className="mb-6"
      title="Payouts disabled"
      content={
        <>
          You must address any issues with your bank account before payouts can
          be re-enabled.
        </>
      }
      actions={[
        {
          label: "Fix account",
          onClick: () => navigate(`${basePath}/payouts/manage/update`),
        },
      ]}
    />
  )
}
