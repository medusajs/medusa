# Segment

Modern e-commerce businesses have to integrate with a wide spectrum of tools from marketing and personalization to analytics and business intelligence. Integrations to these tools quickly become hard to maintain and new integrations become overly complex to implement putting a stretch on an e-commerce organization's resources.

The CDP (Customer Data Platform) [Segment](https://segment.com/) solves this problem by allowing users to instantly integrate with +100 tools through a single unified API.

Medusa has an official plugin `medusa-plugin-segment` that instantly gives you access to all Segment integrations and comes preconfigured with powerful server-side tracking

## Why Segment?

Segment is a powerful Customer Data Platform that allows users to collect, transform, send and archive their customer data.

Segment allows users to manage different tracking and marketing tools using one API and interface, making it very simple to try out and integrate with different services in your e-commerce stack.

Common integration use cases that can be implemented with Segment include:

- Mailchimp
- Klaviyo
- Google Analytics Enhanced E-commerce tracking
- Data warehousing for advanced data analytics and segmentation through services like Snowflake

## Adding Segment to your Medusa store

> Note: you should create a [Node.js source in Segment](https://segment.com/docs/connections/sources/catalog/libraries/server/node/quickstart/) in order to obtain the write key that will be provided in the plugin options.

Plugins in Medusa's ecosystem come as separate npm packages, that can be installed from the npm registry.

```bash
yarn add medusa-plugin-segment
```

After installation open `medusa-config.js` to configure the Segment plugin, by adding it to your project's plugin array and providing the options required by the plugin, namely the write key obtained from the Segment dashboard.

```jsx
{
    resolve: `medusa-plugin-segment`,
    options: {
      write_key: SEGMENT_WRITE_KEY,
    }
}
```

After the plugin has been configured you will get instant access to +100 services through the Segment dashboard. This allows you to try out new services for your e-commerce stack without having to make heavy integration investments.

## Default tracking

`medusa-plugin-segment` comes with prebuilt tracking for common flows for Orders, Returns, Swaps, and Claims. Where applicable the events follow the [Segment Ecommerce Spec](https://segment.com/docs/connections/spec/ecommerce/v2/).

Below is a list of some of the events that are tracked by default:

- Orders
  - Order Completed
  - Order Shipped
  - Order Refunded ← Without returned products
  - Order Cancelled
- Returns
  - Order Refunded ← With returned products
- Swaps
  - Swap Created
  - Swap Confirmed
  - Swap Shipped
- Claims
  - Item Claimed

The default events serve as a good foundation for e-commerce tracking, allowing you to answer questions regarding product performance, return ratios, claim statistics, and more.

In many cases you will want to track other events that are specific to your store - this is also possible through the Segment plugin, as the plugin registers the `segmentService` in your Medusa project.

## Tracking custom events

Building from the custom functionality that can be guided by [the tutorial](https://docs.medusajs.com/tutorial/adding-custom-functionality) in Medusa docs, imagine that you want to track all welcome opt-ins.

The `segmentService` exposes a `track` method that wraps [Segment's Track Spec](https://segment.com/docs/connections/spec/track/), allowing you to send events to the Segment from anywhere in your Medusa project.

For example, to add tracking of the opt-ins in the `POST /welcome/:cart_id` endpoint, you could add the following code:

```jsx
const segmentService = req.scope.resolve("segmentService")
segmentService.track({
  event: "Welcome Opt-In Registered",
  properties: {
    cart_id,
    optin,
  },
})
```

The above snippet would send an event to Segment for further processing. The event data could be used for:

- Segmentation of a mailing list in MailChimp or Klaviyo based on whether the customer opted in for welcomes
- Storage in the data warehouse for later analysis to answer questions like "Are customers who opt-in for welcomes more likely to become recurring customers?"
- Integration to Google Analytics's events
- etc.

## What's next?

This article covers the introduction to one of many Medusa plugins and an explanation of how you can enhance your e-commerce stack, which will help you to build a successful e-commerce project.

Not sure where to start? We are happy to help and talk to you at our [Discord](https://discord.gg/EA5pd3WG)!
