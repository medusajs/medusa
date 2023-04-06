# Mailchimp

Manage newsletter subscriptions in your commerce application with Mailchimp.

[Mailchimp Plugin Documentation](https://docs.medusajs.com/plugins/notifications/mailchimp) | [Medusa Website](https://medusajs.com/) | [Medusa Repository](https://github.com/medusajs/medusa)

## Features

- Allow customers to subscribe to your newsletter.
- Provides custom services and endpoints to give developers flexibility in how to implement newsletter subscription.

---

## Prerequisites

- [Medusa backend](https://docs.medusajs.com/development/backend/install)
- [Mailchimp account](https://mailchimp.com/signup)

---

## How to Install

1\. Run the following command in the directory of the Medusa backend:

  ```bash
  npm install medusa-plugin-mailchimp
  ```

2\. Set the following environment variables in `.env`:

  ```bash
  MAILCHIMP_API_KEY=<YOUR_API_KEY>
  MAILCHIMP_NEWSLETTER_LIST_ID=<YOUR_NEWSLETTER_LIST_ID>
  ```

3\. In `medusa-config.js` add the following at the end of the `plugins` array:

  ```js
  const plugins = [
    // ...,
    {
      resolve: `medusa-plugin-mailchimp`,
      options: {
        api_key: process.env.MAILCHIMP_API_KEY,
        newsletter_list_id: 
          process.env.MAILCHIMP_NEWSLETTER_LIST_ID,
      },
    },
  ]
  ```

---

## Test the Plugin

1\. Run the following command in the directory of the Medusa backend to run the backend:

  ```bash
  npm run start
  ```

2\. Use the `/mailchimp/subscribe` endpoint or the `MailchimpService` to subscribe to the newsletter.

---

## Additional Resources

- [Mailchimp Plugin Documentation](https://docs.medusajs.com/plugins/notifications/mailchimp)
