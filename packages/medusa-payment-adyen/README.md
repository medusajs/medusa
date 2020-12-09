# medusa-payment-adyen

Adyen Drop-in plugin that support following payment methods:
- Credit cards
- MobilePay
- GooglePay
- ApplePay
- PayPal
- Klarna
- iDEAL

## Plugin Options
```
{
  api_key: "",
  notification_hmac: "",
  merchant_account: "",
  return_url: "",
}
```

**api_key:** Go to `Adyen > Account > Users > Web service` to generate API key
**notification_hmac:** Go to `Adyen > Account > Users > Web service` to generate HMAC for notification validation
**merchant_account:** Adyen merchant account
**return_url:** The URL you will be returned to when using redirecting payment methods
