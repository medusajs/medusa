# medusa-payment-adyen

Adyen Drop-in plugin that support following payment methods:
- Credit cards
- MobilePay
- GooglePay
- ApplePay
- PayPal (in progress)
- Klarna (in progress)
- iDEAL (in progress)

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
**notification_hmad:** Go to `Adyen > Account > Users > Web service` to generate HMAC for notification validation
**notification_hmad:** Adyen merchant account
**return_url:** The URL you will be returned to when using redirecting payment methods

## End-to-end payment flow
1. Install Adyen for the web framework in use
2. Create a config for the Adyen web client
3. Retrieve payment methods `/adyen/payment-methods` and add them to the config
4. Present payment methods using the drop-in component as described in: https://docs.adyen.com/checkout/drop-in-web?tab=codeBlock8Zn45_7
5. Use `/adyen/authorize` to complete a payment and react on the status response
