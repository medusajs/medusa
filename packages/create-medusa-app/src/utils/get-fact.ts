const facts = [
  "Plugins allow you to integrate third-party services for payment, fulfillment, notifications, and more.",
  "You can specify a product's availability in one or more sales channels.",
  "Payment and shipping options and providers can be configured per region.",
  "Tax-inclusive pricing allows you to set prices for products, shipping options, and more without having to worry about calculating taxes.",
  "Medusa provides multi-currency and region support, with full control over prices for each currency and region.",
  "You can organize customers by customer groups and set special prices for them.",
  "You can specify the inventory of products per location and sales channel.",
  "Publishable-API Keys allow you to send requests to the backend within a scoped resource.",
  "You can create custom endpoints by creating a TypeScript file under the src/api directory.",
  "You can listen to events to perform asynchornus actions using Subscribers.",
  "An entity represents a table in the database. You can create a table by creating a custom entity and migration.",
  "Medusa's store endpoint paths are prefixed by /store. The admin endpoints are prefixed by /admin.",
  "Medusa provides a JavaScript client and a React library that you can use to build a storefront or a custom admin.",
  "Services are classes with methods related to an entity or functionality. You can create a custom service in a TypeScript file under src/services.",
  "Modules allow you to replace an entire functionality with your custom logic.",
  "The event bus module is responsible for triggering events and relaying them to subscribers.",
  "The cache module is responsible for caching data that requires heavy computation.",
]

export default (lastFact = "") => {
  let index = 0
  if (lastFact.length) {
    const lastFactIndex = facts.findIndex((fact) => fact === lastFact)

    if (lastFactIndex !== facts.length - 1) {
      index = lastFactIndex + 1
    }
  }

  return facts[index]
}
