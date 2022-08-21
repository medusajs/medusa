# Segment

In this document, you’ll learn about the [Segment plugin](https://github.com/medusajs/medusa/tree/master/packages/medusa-plugin-segment), what it does, and how to install and use it.

## Overview

[Segment](https://github.com/medusajs/medusa/tree/master/packages/medusa-plugin-segment) is a powerful Customer Data Platform that allows users to collect, transform, send and archive their customer data.

Segment allows users to manage different tracking and marketing tools using one API and interface, making it very simple to try out and integrate with different services in your ecommerce stack.

Common integration use cases that can be implemented with Segment include:

- Google Analytics
- Mailchimp
- Zendesk
- Data warehousing for advanced data analytics and segmentation through services like Snowflake

The Segment plugin in Medusa allows you to track ecommerce events and record them in Segment. Then, you can push these events to other destinations using Segment.

### Events That the Segment Plugin Tracks

By default, the Segment plugin tracks the following events:

1. `order.placed`: Triggered when an order is placed.
2. `order.shipment_created`: Triggered when a shipment is created for an order.
3. `claim.created`: Triggered when a new claim is created.
4. `order.items_returned`: Triggered when an item in an order is returned.
5. `order.canceled`: Triggered when an order is canceled.
6. `swap.created`: Triggered when a swap is created.
7. `swap.shipment_created`: Triggered when a shipment is created for a swap.
8. `swap.payment_completed`: Triggered when payment for a swap is completed.

:::tip

Check out the [Event Reference](../advanced/backend/subscribers/events-list.md) to learn about all available events in Medusa.

:::

## Prerequisites

### Medusa Server

It is assumed you already have a Medusa server installed. If not, please follow the [Quickstart guide](../quickstart/quick-start.md) to get started in minutes.

In addition, make sure to have Redis installed and configured with your Medusa server. If not, follow [this documentation](../tutorial/0-set-up-your-development-environment.mdx#redis) to install Redis and then [configure it](../usage/configurations.md#redis).

### Segment Account

You need to [create a Segment account](https://app.segment.com/signup/) to follow along with the tutorial. Segment offers a free plan to get started quickly.

## Create a Segment Source

On your Segment dashboard, choose Catalog from the sidebar under Connections.

![Under Connections in the sidebar choose Catalog](https://i.imgur.com/rAeJkP3.png)

Then, in the catalog list find the Server category and choose Node.js from the list.

![Choose Node.js under the Server category](https://i.imgur.com/6RxQbW6.png)

This opens a new side menu. In the side menu, click on Add Source.

![Click on Add Source in the side menu showing information about the Node.js source](https://i.imgur.com/0VZJnpd.png)

This opens a new page to create a Node.js source. Enter the name of the source then click Add Source.

![Enter a name under the Name field then click on the Add Source button](https://i.imgur.com/u2hzkB5.png)

On the new source dashboard, you should find a Write Key. You’ll use this key in the next section after you install the Segment plugin on your Medusa server.

![The Write Key is available on the new source's page](https://i.imgur.com/OTJVsz7.png)

### Optional: Add Destination

After you create the Segment source, you can add destinations. This is where the data is sent when you send them to Segment. You can add more than one destination.

To add a destination, on the same Segment source page, click on Add Destination in the Destinations section.

![Click on the Add Destination button on the source page](https://i.imgur.com/FrKlUxh.png)

You can then choose from a list of destinations such as Google Universal Analytics or Facebook Pixel.

![List of some of the available destinations in Segment's catalog](https://i.imgur.com/y2YnPUh.png)

The process of integrating each destination is different, so you must follow the steps detailed in Segment for each destination you choose.

## Install the Segment Plugin

In the directory of your Medusa server, run the following command to install the Segment plugin:

```bash npm2yarn
npm install medusa-plugin-segment
```

Then, add the following environment variable:

```bash
SEGMENT_WRITE_KEY=<YOUR_SEGMENT_WRITE_KEY>
```

Where `<YOUR_SEGMENT_WRITE_KEY>` is the Write Key shown on the page of the Segment source you created in the previous section.

Finally, in `medusa-config.js`, add the following new item to the `plugins` array:

```jsx
const plugins = [
  //...
  {
    resolve: `medusa-plugin-segment`,
    options: {
      write_key: process.env.SEGMENT_WRITE_KEY,
    }
  }
];
```

## Test the Plugin

Run your server with the following command:

```bash npm2yarn
npm start
```

Then, try triggering one of the [mentioned events earlier in this document](#events-that-the-segment-plugin-tracks). For example, you can place an order either using the [REST APIs](https://docs.medusajs.com/api/store) or using the [Next.js](../starters/nextjs-medusa-starter.md) or [Gatsby](../starters/gatsby-medusa-starter.md) storefronts.

After you place an order, on the Segment source that you created, click on the Debugger tab. You should see at least one event triggered for each order you place. If you click on the event, you can see the order details are passed to the event.

![The order completed event is recorded on the Segment source](https://i.imgur.com/LQVJTGg.png)

If you added a destination, you can also check your destination to make sure the data is reflected there.

:::note

If the data is not appearing on the destination, the issue is related to your configuration between the Segment source and destination and not related to the Segment plugin. Go over the steps that Segment showed you when you added the destination to figure out the issue.

:::

## Add Custom Tracking

In some cases, you might want to track more events or custom events. You can do that using the `SegmentService` provided by the Segment Plugin.

For example, you can add the following subscriber to listen to the `customer.created` event and add tracking for every customer created:

```jsx
class CustomerSubscriber {
  constructor({ segmentService, eventBusService }) {
    this.segmentService = segmentService;

    eventBusService.subscribe("customer.created", this.handleCustomer);
  }

  handleCustomer = async (data) => {
    const customerData = data;
    delete customerData['password_hash'];

    this.segmentService.track({
      event: 'Customer Created',
      userId: data.id,
      properties: customerData
    })
  };
}

export default CustomerSubscriber;
```

You resolve the `SegmentService` using dependency injection. Then, when the `customer.created` event is triggered, you use the `track` method available in the `SegmentService` to send tracking data to Segment.

:::info

Services can be resolved and used in Subscribers, endpoints, and other Services. Learn [how to resolve services in the Services documentation](../advanced/backend/services/create-service.md#using-your-custom-service).

:::

`track` accepts an object of data, where the keys `event` and `userId` are required. Instead of `userId`, you can use `anonymousId` to pass an anonymous user ID.

If you want to pass additional data to Segment, pass them under the `properties` object key.

The `SegmentServer` also provides the method `identify` to tie a user to their actions or specific traits.

### Test Custom Tracking

After adding the above subscriber, run your server again if it isn’t running and create a customer using the REST APIs or one of the Medusa storefronts. If you check the Debugger in your Segment source, you should see a new event “Customer Created” tracked. If you click on it, you’ll see the data you passed to the `track` method.

![The customer created event is recoreded on the Segment source](https://i.imgur.com/4LD41xE.png)

## What’s Next 🚀

- Learn how [services](../advanced/backend/services/create-service.md) and [subscribers](../advanced/backend/subscribers/create-subscriber.md) work.
- Check out a [full list of events](../advanced/backend/subscribers/events-list.md) in Medusa.
- Learn how to [deploy the Medusa server](../deployments/server/index.mdx).
