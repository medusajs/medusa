# medusa-plugin-mailchimp

Mailchimp plugin for Medusa that supports newsletter subscriptions.

Learn more about how you can use this plugin in the [documentaion](https://docs.medusajs.com/add-plugins/mailchimp).

## Options

```js
{
  api_key: "MAILCHIMP_API_KEY",
  newsletter_list_id: ["123456789"]
}
```

## Dynamic usage

You can resolve the Mailchimp service, such that your server can handle newsletter subscriptions.

Example:

```js
const mailchimpService = req.scope.resolve("mailchimpService")
mailchimpService.subscribeNewsletter(
  "acme@mail.com",
  // merge_fields to include in the subscription
  { FIRSTNAME: "Acme", LASTNAME: "Inc." }
)
```
