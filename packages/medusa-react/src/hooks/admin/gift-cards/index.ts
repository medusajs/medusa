/**
 * @packageDocumentation
 *
 * Queries and Mutations listed here are used to send requests to the [Admin Gift Card API Routes](https://docs.medusajs.com/api/admin#gift-cards).
 *
 * All hooks listed require {@link Hooks.Admin.Auth.useAdminLogin | user authentication}.
 *
 * Admins can create gift cards and send them directly to customers, specifying options like their balance, region, and more.
 * These gift cards are different than the saleable gift cards in a store, which are created and managed through {@link Hooks.Admin.Products.useAdminCreateProduct | useAdminCreateProduct}.
 *
 * Related Guide: [How to manage gift cards](https://docs.medusajs.com/modules/gift-cards/admin/manage-gift-cards#manage-custom-gift-cards).
 *
 * @customNamespace Hooks.Admin.Gift Cards
 */

export * from "./queries"
export * from "./mutations"
