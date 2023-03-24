# Twilio SMS

Utilize Twilio's SMS APIs to send customers SMS notifications.

[Twilio SMS Plugin Documentation](https://docs.medusajs.com/plugins/notifications/twilio-sms) | [Medusa Website](https://medusajs.com) | [Medusa Repository](https://github.com/medusajs/medusa)

## Features

- Access Twilio's SMS APIs easily using the `TwilioSmsService`.

---

## Prerequisites

- [Medusa backend](https://docs.medusajs.com/development/backend/install)
- [Twilio account](https://www.twilio.com/sms)

---

## How to Install

1\. Run the following command in the directory of the Medusa backend:

  ```bash
  npm install medusa-plugin-twilio-sms
  ```

2\. Set the following environment variable in `.env`:

  ```bash
  TWILIO_SMS_ACCOUNT_SID=<YOUR_ACCOUNT_SID>
  TWILIO_SMS_AUTH_TOKEN=<YOUR_AUTH_TOKEN>
  TWILIO_SMS_FROM_NUMBER=<YOUR_TWILIO_NUMBER>
  ```

3\. In `medusa-config.js` add the following at the end of the `plugins` array:

  ```js
  const plugins = [
    // ...
    {
      resolve: `medusa-plugin-twilio-sms`,
      options: {
        account_sid: process.env.TWILIO_SMS_ACCOUNT_SID,
        auth_token: process.env.TWILIO_SMS_AUTH_TOKEN,
        from_number: process.env.TWILIO_SMS_FROM_NUMBER,
      },
    },
  ]
  ```

---

## Test the Plugin

In your code, use the `TwilioSmsService` where necessary to send your customers notifications.

---

## Additional Resources

- [Twilio SMS Plugin Documentation](https://docs.medusajs.com/plugins/notifications/twilio-sms)
