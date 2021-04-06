# medusa-plugin-restock-notification

Twilio SMS / Messaging plugin.

## Plugin Options

```
{
  account_sid: [twilio messaging account sid] (required),
  auth_token: [twilio massaging authentication token] (required),
  from_number: [the number used as sender SMS],
}
```

## Dynamic usage

You can resolve the Twilio SMS service to dynamically send SMS's via Twilio.

Example:

```js
const twilioSmsService = scope.resolve("twilioSmsService")
twilioSmsService.sendSms({ to: "+4500112233", body: "Hello world!" })
```
