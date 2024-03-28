import PaypalProvider from "../../../services/paypal-provider"
import { webhookEventHandler } from '../../../services/utils/webhook-event'

export default async (req, res) => {
  const auth_algo = req.headers["paypal-auth-algo"]
  const cert_url = req.headers["paypal-cert-url"]
  const transmission_id = req.headers["paypal-transmission-id"]
  const transmission_sig = req.headers["paypal-transmission-sig"]
  const transmission_time = req.headers["paypal-transmission-time"]

  const paypalService: PaypalProvider = req.scope.resolve(
    "paypalProviderService"
  )

  try {
    await paypalService.verifyWebhook({
      auth_algo,
      cert_url,
      transmission_id,
      transmission_sig,
      transmission_time,
      webhook_event: req.body,
    })
  } catch (err) {
    res.sendStatus(401)
    return
  }

  const { event_type } = req.body
  return webhookEventHandler.handle(event_type, req, res);
}
