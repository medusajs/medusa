---

title: Introduction

---

## Architecture overview

Medusa is composed of 3 components: The headless backend, the admin dashboard, and the storefront.

![Medusa's Architecture](https://i.imgur.com/ZHvM2bu.png)

### Headless Backend

This is the main component that holds all the logic and data of the store. Your admin dashboard and storefront interact with the backend to retrieve, create, and modify data through REST APIs.

Your Medusa server will include all functionalities related to your store’s checkout workflow. That includes cart management, shipping and payment providers, user management, and more. It also allows you to configure your store including your store’s region, tax rules, discounts, gift cards, and more.

### Admin Dashboard

The admin dashboard is accessible by store operators. Store operators can use the admin dashboard to view, create, and modify data such as orders and products. 

Medusa provides a beautiful [admin dashboard](https://demo.medusajs.com) that you can use right off the bat. Our admin dashboard provides a lot of functionalities to manage your store including Order management, product management, user management and more.

 You can also create your own admin dashboard by utilizing the [Admin REST APIs](https://docs.medusajs.com/api/admin/auth).

### Storefront

Your customers use the Storefront to view products and make orders. Medusa provides 2 storefronts, one built with [Next.js](https://docs.medusajs.com/starters/nextjs-medusa-starter) and one with [Gatsby](https://docs.medusajs.com/starters/gatsby-medusa-starter). You are also free to create your own storefront using the [Storefront REST APIs](https://docs.medusajs.com/api/store/auth).
