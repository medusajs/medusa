# medusa-plugin-mailchimp

Mailchimp plugin for Medusa that supports newsletter subscriptions.

## Plugin Options

```
{
  api_key: [your mailchimp api key] (required),
  newsletter_list_id: ["123456789"] (required)
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
