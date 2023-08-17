import React from "react"
import { LearningPathType } from "../providers/LearningPath"
import Link from "@docusaurus/Link"

const paths: LearningPathType[] = [
  {
    name: "simple-quickstart",
    label: "Start Selling in 3 Steps",
    description: "Create and deploy a full-fledged ecommerce store.",
    steps: [
      {
        title: "Create a Next.js Starter Template",
        description:
          "Create a Next.js Starter Template and connect it to your Medusa backend.",
        path: "/starters/nextjs-medusa-starter",
      },
      {
        title: "Deploy the backend",
        path: "/deployments/server/deploying-on-railway",
        descriptionJSX: (
          <>
            Deploy your backend to Railway. You can alternatively check out{" "}
            <Link href="/deployments/server">other deployment guides</Link>
          </>
        ),
      },
      {
        title: "Deploy the storefront",
        description: "Deploy your storefront to your preferred hosting.",
        path: "/deployments/storefront",
      },
    ],
    finish: {
      type: "rating",
      step: {
        title: "Congratulations on building your store!",
        description: "Please rate your experience using this recipe.",
        eventName: "rating_path_simple-quickstart",
      },
    },
  },
  {
    name: "marketplace",
    label: "Build a marketplace",
    description:
      "Customize the backend and handle events to build a marketplace.",
    steps: [
      {
        title: "Extend entities",
        descriptionJSX: (
          <>
            Extend entities, such as <code>User</code> or <code>Product</code>{" "}
            entites, to associate them with the <code>Store</code> entity.
          </>
        ),
        path: "/development/entities/extend-entity",
      },
      {
        title: "Access logged-in user",
        description:
          "Create a middleware that registers the logged-in user in the dependency container.",
        path: "/development/endpoints/example-logged-in-user",
      },
      {
        title: "Extend services",
        descriptionJSX: (
          <>
            Extend services, such as <code>ProductService</code> to customize
            data management functionalities
          </>
        ),
        path: "/development/services/extend-service",
      },
      {
        title: "Handle events",
        descriptionJSX: (
          <>
            Listen to events like <code>order.placed</code> and handle them with
            subscribers
          </>
        ),
        path: "/development/events/create-subscriber",
      },
      {
        title: "Add Payment Provider",
        path: "/plugins/payment",
        descriptionJSX: (
          <>
            Add a payment provider to your Medusa backend. You can choose to
            install a plugin or{" "}
            <Link href="/modules/carts-and-checkout/backend/add-payment-provider">
              create your own provider
            </Link>
            .
          </>
        ),
      },
      {
        title: "Create a storefront",
        path: "/starters/nextjs-medusa-starter",
        descriptionJSX: (
          <>
            Build a storefront either using the Next.js Starter Template or{" "}
            <Link href="/storefront/roadmap">from scratch</Link>.
          </>
        ),
      },
      {
        title: "Deploy the backend",
        path: "/deployments/server/deploying-on-railway",
        descriptionJSX: (
          <>
            Deploy your backend to Railway. You can alternatively check out{" "}
            <Link href="/deployments/server">other deployment guides</Link>
          </>
        ),
      },
    ],
    finish: {
      type: "rating",
      step: {
        title: "Congratulations on building your marketplace!",
        description: "Please rate your experience using this recipe.",
        eventName: "rating_path_marketplace",
      },
    },
  },
  {
    name: "subscriptions",
    label: "Build Subscription-based Purchases",
    description:
      "Customize the backend and handle events to implement subscriptions",
    steps: [
      {
        title: "Extend entities",
        path: "/development/entities/extend-entity",
        descriptionJSX: (
          <>
            Extend entities, such as the <code>Order</code> entity, to associate
            them with the <code>Store</code> entity. You can also{" "}
            <Link href="/development/entities/create">
              Create a custom entity
            </Link>
            .
          </>
        ),
      },
      {
        title: "Handle events",
        descriptionJSX: (
          <>
            Create a subscriber that listens to the <code>order.placed</code>{" "}
            event, or other{" "}
            <Link href="/development/events/events-list">events</Link>, and
            handles creating the subscription in Medusa.
          </>
        ),
        path: "/development/events/create-subscriber",
      },
      {
        title: "Create a Scheduled Job",
        description:
          "Create a scheduled job that checks daily for subscriptions that needs renewal.",
        path: "/development/scheduled-jobs/create",
      },
      {
        title: "Create a storefront",
        path: "/starters/nextjs-medusa-starter",
        descriptionJSX: (
          <>
            Build a storefront either using the Next.js Starter Template or{" "}
            <Link href="/storefront/roadmap">from scratch</Link>.
          </>
        ),
      },
      {
        title: "Deploy the backend",
        path: "/deployments/server/deploying-on-railway",
        descriptionJSX: (
          <>
            Deploy your backend to Railway. You can alternatively check out{" "}
            <Link href="/deployments/server">other deployment guides</Link>
          </>
        ),
      },
    ],
    finish: {
      type: "rating",
      step: {
        title: "Congratulations on implementing subscription-based purchases!",
        description: "Please rate your experience using this recipe.",
        eventName: "rating_path_subscriptions",
      },
    },
  },
  {
    name: "entity-and-api",
    label: "Create Entity and Expose it with Endpoints",
    description:
      "Learn how to create a new table in your database, then create endpoints to expose and manipulate its data.",
    steps: [
      {
        title: "Create entity",
        path: "/development/entities/create",
        description: "Create your entity, its migration, and repository.",
      },
      {
        title: "Create service",
        path: "/development/services/create-service",
        description:
          "A service is a class that defines helper methods for your entity. The service will be used by the endpoints to access or modify the entity's data.",
      },
      {
        title: "Create endpoints",
        path: "/development/endpoints/create",
      },
    ],
    finish: {
      type: "rating",
      step: {
        title: "Congratulations on creating your entity and endpoints!",
        description: "Please rate your experience using this recipe.",
        eventName: "rating_path_entity-and-api",
      },
    },
  },
  {
    name: "storefront",
    label: "Create a Custom Storefront",
    description:
      "Learn how to create a custom storefront with your preferred language or framework.",
    steps: [
      {
        title: "Choose your client",
        path: "/medusa-react/overview",
        descriptionJSX: (
          <>
            As your storefront connect to the Medusa backend, you need a way to
            interact with the backend&apos;s REST APIs. There are three ways to
            do so, based on your type of project:
            <ul>
              <li>
                <Link to="/medusa-react/overview">Medusa React</Link>: Can be
                used in any React-based project. For example, in a Next.js
                storefront.
              </li>
              <li>
                <Link to="/js-client/overview">Medusa JS Client</Link>: Can be
                used in any JavaScript and NPM based project. For example, in a
                Nuxt storefront.
              </li>
              <li>
                <Link to={`https://docs.medusajs.com/api/store`}>
                  Store REST APIs
                </Link>
                : You can send requests directly to the API endpoints without
                using Medusa&apos;s clients.
              </li>
            </ul>
          </>
        ),
      },
      {
        title: "Set CORS configurations in Backend",
        path: "/development/backend/configurations#admin_cors-and-store_cors",
        description:
          "To ensure your storefront can connect to the backend, make sure to configure the backend's CORS configuration based on your storefront's local or remote URL.",
      },
      {
        title: "Create a Publishable API Key",
        path: "/user-guide/settings/publishable-api-keys",
        descriptionJSX: (
          <>
            A publishable API key allows you to associate a key with a sales
            channel. Then, you can include that key in the headers of all your
            requests.
            <br />
            You can create the publishable API key from the dashboard.
            Alternatively, you can create it using the{" "}
            <Link to="/development/publishable-api-keys/admin/manage-publishable-api-keys">
              Admin APIs
            </Link>
          </>
        ),
      },
      {
        title: "Use Publishable API Key",
        path: "/development/publishable-api-keys/storefront/use-in-requests",
        description:
          "After creating the publishable API key and associating it with sales channels, you can pass it in the header of your requests to Store API endpoints.",
      },
      {
        title: "Add Region Selection",
        path: "/modules/regions-and-currencies/storefront/use-regions",
        description:
          "In your storefront, you can allow your customers to view available regions and select their current region. This can affect the prices, discounts, and shipping and payment providers available to the customer.",
      },
      {
        title: "Display Products",
        path: "/modules/products/storefront/show-products",
        description: "Display products to your customers in the storefront.",
      },
      {
        title: "Implement Cart Functionalities",
        path: "/modules/carts-and-checkout/storefront/implement-cart",
        description:
          "Allow your customers to add items to their cart, update them, and more in preparation for checkout.",
      },
      {
        title: "Implement Checkout Flow",
        path: "/modules/carts-and-checkout/storefront/implement-checkout-flow",
        description:
          "Implement the checkout flow that allows customers to handle shipping and payment, then place their orders.",
      },
      {
        title: "Implement Customer Profiles",
        path: "/modules/customers/storefront/implement-customer-profiles",
        description:
          "Allow customers to register, login, edit their profile information, and more.",
      },
      {
        title: "More Commerce Functionalities",
        path: "/modules/overview",
        descriptionJSX: (
          <>
            This recipe guided you to create a storefront with basic
            functionalities. You can add more functionalities to your storefront
            based on your use case.
            <ul>
              <li>
                The <Link to="/modules/overview">Commerce Modules</Link>{" "}
                documentation holds various storefront-related how-to guides to
                help you implement different features.
              </li>
              <li>
                You can also checkout the{" "}
                <Link to={`https://docs.medusajs.com/api/store`}>
                  Store REST APIs
                </Link>{" "}
                for a full list of available REST APIs.
              </li>
            </ul>
          </>
        ),
      },
    ],
    finish: {
      type: "rating",
      step: {
        title: "Congratulations on creating your storefront!",
        description: "Please rate your experience using this recipe.",
        eventName: "rating_path_storefront",
      },
    },
  },
  {
    name: "plugin",
    label: "Create a Plugin",
    description:
      "Learn how to create a plugin that can be re-used across Medusa backends.",
    steps: [
      {
        title: "Setup plugin project",
        path: "/development/backend/install",
        description:
          "A plugin is initially a Medusa backend with customizations. If you don't have a project ready, you can create one using Medusa's CLI tool.",
      },
      {
        title: "Implement Customizations",
        path: "/development/entities/create",
        descriptionJSX: (
          <>
            Your plugin can hold backend and admin customizations. Those
            include:
            <ul>
              <li>
                <Link to="/development/entities/create">Create Entity</Link>
              </li>
              <li>
                <Link to="/development/services/create-service">
                  Create Service
                </Link>
              </li>
              <li>
                <Link to="/development/endpoints/create">
                  Create an Endpoint
                </Link>
              </li>
              <li>
                <Link to="/development/events/create-subscriber">
                  Create Subscriber
                </Link>
              </li>
              <li>
                <Link to="/admin/widgets">Create Admin Widgets</Link>
              </li>
              <li>
                <Link to="/admin/routes">Create Admin Routes</Link>
              </li>
              <li>
                <Link to="/admin/setting-pages">
                  Create Admin Setting Pages
                </Link>
              </li>
              <li>
                <Link to="/development/search/create">
                  Create Search Service
                </Link>
              </li>
              <li>
                <Link to="/development/file-service/create-file-service">
                  Create File Service
                </Link>
              </li>
              <li>
                <Link to="/development/notification-service/create-notification-service">
                  Create Notification Service
                </Link>
              </li>
            </ul>
            If you&apos;ve already made your custom development, you can skip to
            the next step.
          </>
        ),
      },
      {
        title: "Change your package.json",
        path: "/development/plugins/create#changes-to-packagejson",
        descriptionJSX: (
          <>
            Once you&apos;re done making your customizations and you&apos;re
            ready to publish your plugin, make changes to your{" "}
            <code>package.json</code> in preparation for publishing.
          </>
        ),
      },
      {
        title: "Optionally test locally",
        path: "/development/plugins/create#test-your-plugin",
        description:
          "If necessary, you can test your plugin in a separate local Medusa backend. It's recommended, however, to do your plugin testing within the plugin project.",
      },
      {
        title: "Publish plugin",
        path: "/development/plugins/publish",
        description: "Publish your plugin on NPM.",
      },
    ],
    finish: {
      type: "rating",
      step: {
        title: "Congratulations on creating your plugin!",
        description: "Please rate your experience using this recipe.",
        eventName: "rating_path_plugin",
      },
    },
  },
]

// get a shallow copy
export const getLearningPaths = () => [...paths]

export const getLearningPath = (
  pathName: string
): LearningPathType | undefined => paths.find((path) => path.name === pathName)
