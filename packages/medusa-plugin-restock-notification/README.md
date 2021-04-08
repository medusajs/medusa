# medusa-plugin-restock-notification


## Usage

Install the plugin:

`$ yarn add medusa-plugin-restock-notification`

```js
// medusa-config.js

module.exports = {
  ...,
  plugins: [
    ...,
    `medusa-plugin-restock-notification`
  ]
}
```

The plugin will migrate your database to include the RestockNotification entity, which consists of a variant id of a sold out item and a jsonb list of arrays that wish to be notified about restocks for the item.


## API endpoint

The plugin exposes an endpoint to sign emails up for restock notifications:

```
POST /restock-notifications/variants/:variant_id

Body
{
  "email": "seb@test.com"
}
```

The endpoint responds with `200 OK` on succesful signups. If a signup for an already in stock item is attempted the endpoint will have a 400 response code.


## Restock events

The plugin listens for the `product-variant.updated` call and emits a `restock-notification.restocked` event when a variant with restock signups become available.

The data sent with the `restock-notification.restocked` event is:
```
variant_id: The id of the variant to listen for restock events for.
emails: An array of emails that are to be notified of restocks.

e.g.

{
  "variant_id": "variant_1234567890",
  "emails": ["seb@test.com", "oli@test.com"]
}
```

*Note: This plugin does not send any communication to the customer, communication logic must be implemented or provided through a communication plugin.*

You may use `medusa-plugin-sendgrid` to orchestrate transactional emails.


## Usage with medusa-plugin-sendgrid

Install the plugins:
`$ yarn add medusa-plugin-restock-notification medusa-plugin-sendgrid`

```js
// medusa-config.js

module.exports = {
  ...,
  plugins: [
    ...,
    `medusa-plugin-restock-notification`,
    {
      resolve: `medusa-plugin-sendgrid`,
      options: {
        from: SENDGRID_FROM,
        api_key: SENDGRID_API_KEY,
        medusa_restock_template: `d-13141234123412342314`
      }
    }
  ]
}
```

You should set up a dynamic template in SendGrid which will be send for each of the emails in the restock notification.

