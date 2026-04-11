/** @type {import('types').Sidebar.SidebarItem[]} */
export const storefrontDevelopmentSidebar = [
  {
    type: "link",
    path: "/storefront-development",
    title: "Overview",
  },
  {
    type: "separator",
  },
  {
    type: "category",
    title: "General",
    children: [
      {
        type: "link",
        path: "/storefront-development/tips",
        title: "Connect to Medusa",
      },
      {
        type: "link",
        path: "/storefront-development/publishable-api-keys",
        title: "Publishable API Key",
      },
      {
        type: "link",
        path: "/storefront-development/localization",
        title: "Localization",
      },
      {
        type: "link",
        path: "/storefront-development/production-optimizations",
        title: "Production Optimizations",
      },
    ],
  },
  {
    type: "category",
    title: "Tutorials",
    description:
      "The following tutorials guide you to build a storefront for different kinds of use cases.",
    children: [
      {
        type: "ref",
        path: "/nextjs-starter/guides/storefront-returns",
        title: "Create Returns from Storefront",
      },
      {
        type: "link",
        path: "/storefront-development/guides/express-checkout",
        title: "Express Checkout Storefront",
      },
      {
        type: "link",
        path: "/storefront-development/guides/react-native-expo",
        title: "Mobile App with React Native and Expo",
      },
    ],
  },
  {
    type: "category",
    title: "Regions",
    description:
      "Regions are different areas you sell products in. Learn how to use regions in your storefront.",
    children: [
      {
        type: "link",
        path: "/storefront-development/regions",
        title: "Overview",
      },
      {
        type: "link",
        path: "/storefront-development/regions/list",
        title: "List Regions",
      },
      {
        type: "link",
        path: "/storefront-development/regions/store-retrieve-region",
        title: "Store and Retrieve Regions",
      },
      {
        type: "link",
        path: "/storefront-development/regions/context",
        title: "Region React Context",
      },
    ],
  },
  {
    type: "category",
    title: "Products",
    description:
      "Learn how to show products and related data in your storefront.",
    children: [
      {
        type: "link",
        path: "/storefront-development/products/list",
        title: "List Products",
      },
      {
        type: "link",
        path: "/storefront-development/products/retrieve",
        title: "Retrieve a Product",
      },
      {
        type: "link",
        path: "/storefront-development/products/variants",
        title: "Select a Variant",
      },
      {
        type: "link",
        path: "/storefront-development/products/price",
        title: "Retrieve Variant Prices",
        autogenerate_path: "storefront-development/products/price/examples",
      },
      {
        type: "link",
        path: "/storefront-development/products/inventory",
        title: "Retrieve Variant Inventory",
      },
    ],
  },
  {
    type: "category",
    title: "Product Categories",
    description: "Learn how to show product categories in your storefront.",
    children: [
      {
        type: "link",
        path: "/storefront-development/products/categories/list",
        title: "List Categories",
      },
      {
        type: "link",
        path: "/storefront-development/products/categories/retrieve",
        title: "Retrieve a Category",
      },
      {
        type: "link",
        path: "/storefront-development/products/categories/products",
        title: "Retrieve a Category's Products",
      },
      {
        type: "link",
        path: "/storefront-development/products/categories/nested-categories",
        title: "Retrieve Nested Categories",
      },
    ],
  },
  {
    type: "category",
    title: "Product Collections",
    description: "Learn how to show product collections in your storefront.",
    children: [
      {
        type: "link",
        path: "/storefront-development/products/collections/list",
        title: "List Collections",
      },
      {
        type: "link",
        path: "/storefront-development/products/collections/retrieve",
        title: "Retrieve a Collection",
      },
      {
        type: "link",
        path: "/storefront-development/products/collections/products",
        title: "Retrieve a Collection's Products",
      },
    ],
  },
  {
    type: "category",
    title: "Carts",
    description:
      "Learn how to manage carts in your storefront. These carts are later used to implement the checkout flow.",
    children: [
      {
        type: "link",
        path: "/storefront-development/cart/create",
        title: "Create Cart",
      },
      {
        type: "link",
        path: "/storefront-development/cart/retrieve",
        title: "Retrieve Cart",
      },
      {
        type: "link",
        path: "/storefront-development/cart/context",
        title: "Cart React Context",
      },
      {
        type: "link",
        path: "/storefront-development/cart/update",
        title: "Update Cart",
      },
      {
        type: "link",
        path: "/storefront-development/cart/manage-items",
        title: "Manage Line Items",
      },
      {
        type: "link",
        path: "/storefront-development/cart/manage-promotions",
        title: "Manage Promotions",
      },
      {
        type: "link",
        path: "/storefront-development/cart/totals",
        title: "Show Totals",
      },
    ],
  },
  {
    type: "category",
    title: "Checkout",
    description:
      "Learn how to implement the different steps of the checkout flow in your storefront. By following the checkout flow, customers can complete their purchase.",
    children: [
      {
        type: "link",
        path: "/storefront-development/checkout",
        title: "Overview",
      },
      {
        type: "link",
        path: "/storefront-development/checkout/email",
        title: "1. Enter Email",
      },
      {
        type: "link",
        path: "/storefront-development/checkout/address",
        title: "2. Set Address",
      },
      {
        type: "link",
        path: "/storefront-development/checkout/shipping",
        title: "3. Choose Shipping Method",
      },
      {
        type: "link",
        path: "/storefront-development/checkout/payment",
        title: "4. Choose Payment Provider",
        children: [
          {
            type: "link",
            path: "/storefront-development/checkout/payment/stripe",
            title: "Example: Stripe",
          },
        ],
      },
      {
        type: "link",
        path: "/storefront-development/checkout/complete-cart",
        title: "5. Complete Cart",
      },
      {
        type: "link",
        path: "/storefront-development/checkout/order-confirmation",
        title: "Show Order Confirmation",
      },
    ],
  },
  {
    type: "category",
    title: "Customers",
    description:
      "Learn how to allow customers to register, login, and manage their profile in your storefront.",
    children: [
      {
        type: "sub-category",
        title: "Authentication",
        description:
          "Learn how to authenticate customers in your storefront. This includes basic email-password authentication and third-party (social) login.",
        children: [
          {
            type: "link",
            path: "/storefront-development/customers/register",
            title: "Register Customer",
          },
          {
            type: "link",
            path: "/storefront-development/customers/login",
            title: "Login Customer",
          },
          {
            type: "link",
            path: "/storefront-development/customers/third-party-login",
            title: "Third-Party (Social) Login",
          },
          {
            type: "link",
            path: "/storefront-development/customers/reset-password",
            title: "Reset Password",
          },
        ],
      },
      {
        type: "sub-category",
        title: "Profile",
        description:
          "Learn how to retrieve a customer, manage their customer profile, and log them out in your storefront.",
        children: [
          {
            type: "link",
            path: "/storefront-development/customers/retrieve",
            title: "Retrieve Customer",
          },
          {
            type: "link",
            path: "/storefront-development/customers/context",
            title: "Customer React Context",
          },
          {
            type: "link",
            path: "/storefront-development/customers/profile",
            title: "Edit Customer Profile",
          },
          {
            type: "link",
            path: "/storefront-development/customers/addresses",
            title: "Manage Customer Addresses",
          },
          {
            type: "link",
            path: "/storefront-development/customers/log-out",
            title: "Log-out Customer",
          },
        ],
      },
    ],
  },
]
