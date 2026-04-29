/** @type {import('types').Sidebar.SidebarItem[]} */
export const howToTutorialsSidebar = [
  {
    type: "link",
    path: "/how-to-tutorials",
    title: "Overview",
  },
  {
    type: "link",
    path: "/examples",
    title: "Example Snippets",
  },
  {
    type: "separator",
  },
  {
    type: "category",
    title: "How-To Guides",
    description:
      "How-to guides are a collection of guides that help you understand how to achieve certain customizations or implementing specific features in Medusa.",
    children: [
      {
        type: "sub-category",
        title: "Server",
        autogenerate_tags: "howTo+server",
        autogenerate_as_ref: true,
        sort_sidebar: "alphabetize",
        description:
          "These how-to guides help you customize the Medusa server to implement custom features and business logic.",
      },
      {
        type: "sub-category",
        title: "Admin",
        autogenerate_tags: "howTo+admin",
        autogenerate_as_ref: true,
        sort_sidebar: "alphabetize",
        description:
          "These how-to guides help you customize the Medusa Admin dashboard with practical examples.",
        children: [
          {
            type: "sidebar",
            sidebar_id: "admin-components-layouts",
            title: "Components & Layouts",
            children: [
              {
                type: "link",
                path: "/admin-components",
                title: "Overview",
              },
              {
                type: "separator",
              },
              {
                type: "category",
                title: "Layouts",
                autogenerate_path: "/admin-components/layouts",
              },
              {
                type: "category",
                title: "Components",
                autogenerate_path: "/admin-components/components",
              },
            ],
          },
          {
            type: "link",
            title: "Custom Admin Authentication",
            path: "/how-to-tutorials/how-to/admin/auth",
          },
        ],
      },
    ],
  },
  {
    type: "category",
    title: "Tutorials",
    sort_sidebar: "alphabetize",
    description: `Tutorials are step-by-step guides that take you through implementing a specific use case in Medusa. You can follow these guides whether you're a beginner or an experienced Medusa developer.

While tutorials show you a specific use case, they also help you understand how to implement similar use cases in your own projects. Also, you can implement the use case in a tutorial differently to fit your business requirements.`,
    children: [
      {
        type: "link",
        title: "Add Gift Message",
        path: "/how-to-tutorials/tutorials/gift-message",
        description:
          "Learn how to add a gift option and message to items in the cart.",
      },
      {
        type: "link",
        title: "Add Product Category Images",
        path: "/how-to-tutorials/tutorials/category-images",
        description: "Learn how to add images to product categories in Medusa.",
      },
      {
        type: "link",
        title: "Agentic Commerce",
        path: "/how-to-tutorials/tutorials/agentic-commerce",
        description:
          "Learn how to build Agentic Commerce with Medusa to support purchase with AI agents like ChatGPT.",
      },
      {
        type: "ref",
        title: "Analytics with Segment",
        path: "/integrations/guides/segment",
        description:
          "Learn how to integrate Segment with Medusa to track user interactions and events.",
      },
      {
        type: "link",
        title: "Abandoned Cart",
        path: "/how-to-tutorials/tutorials/abandoned-cart",
        description:
          "Learn how to send abandoned cart notifications to customers.",
      },
      {
        type: "ref",
        title: "Bundled Products",
        path: "/recipes/bundled-products/examples/standard",
        description:
          "Learn how to implement bundled products in your Medusa store.",
      },
      {
        type: "link",
        title: "Custom Item Pricing",
        path: "/examples/guides/custom-item-price",
        description:
          "Learn how to use prices from external systems for products.",
      },
      {
        type: "link",
        title: "Customer Tiers",
        path: "/how-to-tutorials/tutorials/customer-tiers",
        description:
          "Learn how to implement customer tiers in your Medusa store.",
      },
      {
        type: "link",
        title: "First-Purchase Discounts",
        path: "/how-to-tutorials/tutorials/first-purchase-discounts",
        description:
          "Learn how to implement first-purchase discounts in your Medusa store.",
      },
      {
        type: "link",
        title: "Generate Invoices",
        path: "/how-to-tutorials/tutorials/invoice-generator",
        description:
          "Learn how to generate invoices for orders in your Medusa store.",
      },
      {
        type: "ref",
        title: "Integrate Payload CMS",
        path: "/integrations/guides/payload",
        description:
          "Learn how to integrate Payload CMS with Medusa to manage your product content.",
      },
      {
        type: "link",
        title: "Loyalty Points System",
        path: "/how-to-tutorials/tutorials/loyalty-points",
        description:
          "Learn how to implement a loyalty points system in your Medusa store.",
      },
      {
        type: "ref",
        title: "Localization with Contentful",
        path: "/integrations/guides/contentful",
        description:
          "Learn how to implement localization in Medusa by integrating Contentful.",
      },
      {
        type: "ref",
        title: "Magento Migration",
        path: "/integrations/guides/magento",
        description: "Learn how to migrate data from Magento to Medusa.",
      },
      {
        type: "link",
        title: "Meta Product Feed",
        path: "/how-to-tutorials/tutorials/product-feed",
        description:
          "Learn how to implement a product feed for Meta (Facebook and Instagram) and Google using Medusa.",
      },
      {
        type: "ref",
        title: "Newsletter with Mailchimp",
        path: "/integrations/guides/mailchimp",
        description:
          "Learn how to integrate Mailchimp with Medusa to manage and automate newsletters.",
      },
      {
        type: "ref",
        title: "Personalized Products",
        path: "/recipes/personalized-products/example",
        description:
          "Learn how to implement personalized products in your Medusa store.",
      },
      {
        type: "link",
        title: "Phone Authentication",
        path: "/how-to-tutorials/tutorials/phone-auth",
        description:
          "Learn how to allow users to authenticate using their phone numbers.",
      },
      {
        type: "link",
        title: "Pre-Order Products",
        path: "/how-to-tutorials/tutorials/preorder",
        description:
          "Learn how to implement pre-order functionality for products in your Medusa store.",
      },
      {
        type: "link",
        title: "Product Builder",
        path: "/how-to-tutorials/tutorials/product-builder",
        description:
          "Learn how to implement a product builder that allows customers to customize products before adding them to the cart.",
      },
      {
        type: "link",
        title: "Product Rentals",
        path: "/how-to-tutorials/tutorials/product-rentals",
        description:
          "Learn how to implement product rentals in your Medusa store.",
      },
      {
        type: "link",
        title: "Product Reviews",
        path: "/how-to-tutorials/tutorials/product-reviews",
        description:
          "Learn how to implement product reviews in your Medusa store.",
      },
      {
        type: "link",
        title: "Quote Management",
        path: "/examples/guides/quote-management",
        description:
          "Learn how to implement quote management, useful for B2B use cases.",
      },
      {
        type: "link",
        title: "Re-Order",
        path: "/how-to-tutorials/tutorials/re-order",
        description:
          "Learn how to allow customers to re-order previous orders.",
      },
      {
        type: "link",
        title: "Saved Payment Methods",
        path: "/how-to-tutorials/tutorials/saved-payment-methods",
        description:
          "Learn how to implement saved payment methods in your Medusa store.",
      },
      {
        type: "link",
        title: "Wishlist Plugin",
        path: "/plugins/guides/wishlist",
        description:
          "Learn how to build a plugin for wishlist functionalities.",
      },
      {
        type: "sub-category",
        title: "Extend Modules",
        autogenerate_tags: "tutorial+extendModule",
        autogenerate_as_ref: true,
        sort_sidebar: "alphabetize",
      },
    ],
  },
  {
    type: "category",
    title: "Deployment",
    children: [
      {
        type: "link",
        path: "/deployment",
        title: "Overview",
      },
      {
        type: "link",
        title: "Cloud",
        path: "https://docs.medusajs.com/cloud",
      },
      {
        type: "link",
        title: "Self-Hosting",
        path: "https://docs.medusajs.com/learn/deployment/general",
      },
      {
        type: "sub-category",
        title: "Next.js Starter",
        autogenerate_path: "/deployment/storefront",
      },
    ],
  },
]
