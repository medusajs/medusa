# Segment

Track essential commerce analytics with Segment.

[Segment Plugin Documentation](https://docs.medusajs.com/plugins/analytics/segment) | [Medusa Website](https://medusajs.com) | [Medusa Repository](https://github.com/medusajs/medusa)

## Features

- Automatic analytics tracking for events related to Orders, Swaps, and Claims.
- Flexibility to track analytics for custom events or operations.

---

## Prerequisites

- [Medusa backend](https://docs.medusajs.com/development/backend/install)
- [Segment account](https://app.segment.com/signup)

---

## How to Install

1\. Run the following command in the directory of the Medusa backend:

  ```bash
  npm install medusa-plugin-segment
  ```

2\. Set the following environment variable in `.env`:

  ```bash
  SEGMENT_WRITE_KEY=<YOUR_SEGMENT_WRITE_KEY>
  ```

3\. In `medusa-config.js` add the following at the end of the `plugins` array:

  ```js
  const plugins = [
    // ...
    {
      resolve: `medusa-plugin-segment`,
      options: {
        write_key: process.env.SEGMENT_WRITE_KEY,
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

2\. Place an order using a storefront or the [Store APIs](https://docs.medusajs.com/api/store). You should see the event tracked in Segment.

---

## Additional Resources

- [Segment Plugin Documentation](https://docs.medusajs.com/plugins/analytics/segment)
