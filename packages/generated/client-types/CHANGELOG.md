# @medusajs/client-types

## 0.2.12

### Patch Changes

- [`52520d9080`](https://github.com/medusajs/medusa/commit/52520d90800e473e89254c4a424d5dffc6edfc30) Thanks [@olivermrbl](https://github.com/olivermrbl)! - chore: Add missing changeset

## 0.2.11

### Patch Changes

- [#6812](https://github.com/medusajs/medusa/pull/6812) [`e005987adf`](https://github.com/medusajs/medusa/commit/e005987adf2a2dd8c2748e7abc360cc93e7c05ad) Thanks [@shahednasser](https://github.com/shahednasser)! - fix(medusa-oas-cli): fix tool not working in Medusa backends

- [#6680](https://github.com/medusajs/medusa/pull/6680) [`26531c5a38`](https://github.com/medusajs/medusa/commit/26531c5a38bf09ab3e77a1444cefd65a073ae713) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - feat(ui-preset): Pull latest styles from Figma.
  fix(ui): Fix invalid state styling of Select, so it correctly shows when aria-invalid is true.
  fix(medusa): Align query params between `/admin/products/:id/variants` and `/admin/variants`.
  chore(client-types): Update `medusa` client types to reflect changes to the API.

## 0.2.10

### Patch Changes

- [#6633](https://github.com/medusajs/medusa/pull/6633) [`e124762873`](https://github.com/medusajs/medusa/commit/e124762873cd43af8eefa9fee4698450fdf8c30f) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(medusa): Allows to filter price list products by multiple ids.

- [#6550](https://github.com/medusajs/medusa/pull/6550) [`fb25471e92`](https://github.com/medusajs/medusa/commit/fb25471e927c0cc91525f5e0134b935cd36596b5) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(medusa): Adds updated_at query param to list-reservations. Fixes OAS for list-inventory-items.

- [#6606](https://github.com/medusajs/medusa/pull/6606) [`c2d56ca12b`](https://github.com/medusajs/medusa/commit/c2d56ca12b89af078b885a0acced20e29bf6f8f5) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(medusa): Fixes pagination on list Tax Rate endpoint, and also adds missing query params like order, search and filters.

- [#6658](https://github.com/medusajs/medusa/pull/6658) [`78e5ec459a`](https://github.com/medusajs/medusa/commit/78e5ec459a637946482a3ee9f8b437656686988f) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(medusa): Add missing query params to draft order list endpoint

- [#6380](https://github.com/medusajs/medusa/pull/6380) [`d37ff8024d`](https://github.com/medusajs/medusa/commit/d37ff8024d8affbe84db3c0b6d79cd41016bfac4) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(medusa,ui): Fixes list query params for the following endpoints: "/admin/customers", "/admin/customer-groups", "/admin/gift-cards", and "/admin/collections".

- [#6483](https://github.com/medusajs/medusa/pull/6483) [`e076590ff2`](https://github.com/medusajs/medusa/commit/e076590ff2a9587d66ffdac672bdd254cb9918f1) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(medusa): Add query params to Pub. API key endpoint

- [#6428](https://github.com/medusajs/medusa/pull/6428) [`44d43e8155`](https://github.com/medusajs/medusa/commit/44d43e8155d1b1ca0af5e900787411c7d0b027c0) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - feat(medusa,medusa-js,medusa-react,icons): Fixes GET /admin/products/:id/variants endpoint in the core, and medusa-js and medusa-react. Pulls latest icons from Figma into `@medusajs/icons`.

## 0.2.9

### Patch Changes

- [#6258](https://github.com/medusajs/medusa/pull/6258) [`90cff0777`](https://github.com/medusajs/medusa/commit/90cff0777fd351771f3713bf84f4c327c64d276c) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(medusa): Adds support for ordering GET /admin/orders

## 0.2.8

### Patch Changes

- [#6201](https://github.com/medusajs/medusa/pull/6201) [`489b7effb`](https://github.com/medusajs/medusa/commit/489b7effb013b2ffb38693ace14fb8cce2dd7ab4) Thanks [@olivermrbl](https://github.com/olivermrbl)! - fix(medusa): Support q search in currencies

- [#6208](https://github.com/medusajs/medusa/pull/6208) [`134af7766`](https://github.com/medusajs/medusa/commit/134af77667c278622e3731ba41602d297852fedb) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(medusa): Enable pagination, search and ordering of shipping option list endpoint

## 0.2.7

### Patch Changes

- [#5599](https://github.com/medusajs/medusa/pull/5599) [`b3093c3e3`](https://github.com/medusajs/medusa/commit/b3093c3e3d64e4c024a04d76fb0f727c1c38108b) Thanks [@bqst](https://github.com/bqst)! - feat(medusa): Add `metadata` to Product Category

## 0.2.6

### Patch Changes

- [#5582](https://github.com/medusajs/medusa/pull/5582) [`91615f9c4`](https://github.com/medusajs/medusa/commit/91615f9c459a2d8cb842561c5edb335680d30298) Thanks [@shahednasser](https://github.com/shahednasser)! - fix(@medusajs/client-types): Fix types and TSDocs
  fix(medusa-react): Fix response type of Publishable API Key's list sales channels.
  fix(@medusajs/medusa-js): Fix incorrect parameter and response types.
  fix(@medusajs/medusa): Fix incorrect types and add TSDocs
  fix(@medusajs/types): Fix incorrect types and add TSDocs

## 0.2.5

### Patch Changes

- [#4953](https://github.com/medusajs/medusa/pull/4953) [`9781089ca`](https://github.com/medusajs/medusa/commit/9781089ca301221011c58423add3bf81b74b068b) Thanks [@shahednasser](https://github.com/shahednasser)! - fix(medusa): fix types for upload endpoints

## 0.2.4

### Patch Changes

- [#4230](https://github.com/medusajs/medusa/pull/4230) [`2f283996f`](https://github.com/medusajs/medusa/commit/2f283996f80313b074b96c690bcd953c67665c1b) Thanks [@erikengervall](https://github.com/erikengervall)! - feat(medusa): Add `metadata` to `StorePostCartsCartLineItemsItemReq`

## 0.2.3

### Patch Changes

- [#4066](https://github.com/medusajs/medusa/pull/4066) [`4fb443c0e`](https://github.com/medusajs/medusa/commit/4fb443c0ea38bde3148bce059c0ee3b91dfff3d4) Thanks [@pKorsholm](https://github.com/pKorsholm)! - feat(medusa,client-types): add location_id filtering to list-location levels

- [#3979](https://github.com/medusajs/medusa/pull/3979) [`3a38c84f8`](https://github.com/medusajs/medusa/commit/3a38c84f88b05f74ee0a172af3e3f78b2ec8c2d2) Thanks [@pKorsholm](https://github.com/pKorsholm)! - feat(client-types, inventory, medusa, types): add additional filtering capabilities to list-reservations

- [#4081](https://github.com/medusajs/medusa/pull/4081) [`4f3c8f5d7`](https://github.com/medusajs/medusa/commit/4f3c8f5d70b5ae4a11e9d4a2fea4a8410b2daf47) Thanks [@pKorsholm](https://github.com/pKorsholm)! - feat(medusa,client-types,medusa-js,admin-ui,medusa-react): add reservation table and creation

## 0.2.2

### Patch Changes

- [#3924](https://github.com/medusajs/medusa/pull/3924) [`cfcd2d54f`](https://github.com/medusajs/medusa/commit/cfcd2d54fd281fd98de881fc6dfbcc6b1b47c855) Thanks [@pevey](https://github.com/pevey)! - Add separator after tmpdir base

## 0.2.1

### Patch Changes

- [#3971](https://github.com/medusajs/medusa/pull/3971) [`7fd22ecb4`](https://github.com/medusajs/medusa/commit/7fd22ecb4d5190e92c6750a9fbf2d8534bb9f4ab) Thanks [@pKorsholm](https://github.com/pKorsholm)! - Feat(client-types, inventory, medusa, types): add `title`, `thumbnail` and `description to inventory item and `description` to reservation item.

## 0.2.0

### Minor Changes

- [#3477](https://github.com/medusajs/medusa/pull/3477) [`826d4bedf`](https://github.com/medusajs/medusa/commit/826d4bedfe1b6459163711d5173eb8eadfdea26e) Thanks [@patrick-medusajs](https://github.com/patrick-medusajs)! - feat(codegen,types): SetRelation on expanded types

### Patch Changes

- [#3483](https://github.com/medusajs/medusa/pull/3483) [`13f40d721`](https://github.com/medusajs/medusa/commit/13f40d721702fbcdf6c131354ec9a81322d4a662) Thanks [@patrick-medusajs](https://github.com/patrick-medusajs)! - feat(oas): declare x-expanded-relations - Admin

- [#3482](https://github.com/medusajs/medusa/pull/3482) [`522e306e2`](https://github.com/medusajs/medusa/commit/522e306e2e9abf4afce63f30714389eba32bef7f) Thanks [@patrick-medusajs](https://github.com/patrick-medusajs)! - feat(oas): declare x-expanded-relations - Store

- [#3492](https://github.com/medusajs/medusa/pull/3492) [`e6e529152`](https://github.com/medusajs/medusa/commit/e6e529152792e63a71664fb88567276a820e9908) Thanks [@patrick-medusajs](https://github.com/patrick-medusajs)! - feat(codegen): commit generated client types to codebase

- [#3452](https://github.com/medusajs/medusa/pull/3452) [`55febef7f`](https://github.com/medusajs/medusa/commit/55febef7f1e74a07e76039d1ffbcb721c08adeb2) Thanks [@patrick-medusajs](https://github.com/patrick-medusajs)! - feat(types): package scaffolding for generated types

- [#3478](https://github.com/medusajs/medusa/pull/3478) [`6748877c6`](https://github.com/medusajs/medusa/commit/6748877c694c1433f666c6987f20af76b201b495) Thanks [@patrick-medusajs](https://github.com/patrick-medusajs)! - fix(oas,js,react): use AdminExtendedStoresRes instead of AdminStoresRes

## 0.2.0-rc.0

### Minor Changes

- [#3477](https://github.com/medusajs/medusa/pull/3477) [`826d4bedf`](https://github.com/medusajs/medusa/commit/826d4bedfe1b6459163711d5173eb8eadfdea26e) Thanks [@patrick-medusajs](https://github.com/patrick-medusajs)! - feat(codegen,types): SetRelation on expanded types

### Patch Changes

- [#3483](https://github.com/medusajs/medusa/pull/3483) [`13f40d721`](https://github.com/medusajs/medusa/commit/13f40d721702fbcdf6c131354ec9a81322d4a662) Thanks [@patrick-medusajs](https://github.com/patrick-medusajs)! - feat(oas): declare x-expanded-relations - Admin

- [#3482](https://github.com/medusajs/medusa/pull/3482) [`522e306e2`](https://github.com/medusajs/medusa/commit/522e306e2e9abf4afce63f30714389eba32bef7f) Thanks [@patrick-medusajs](https://github.com/patrick-medusajs)! - feat(oas): declare x-expanded-relations - Store

- [#3492](https://github.com/medusajs/medusa/pull/3492) [`e6e529152`](https://github.com/medusajs/medusa/commit/e6e529152792e63a71664fb88567276a820e9908) Thanks [@patrick-medusajs](https://github.com/patrick-medusajs)! - feat(codegen): commit generated client types to codebase

- [#3452](https://github.com/medusajs/medusa/pull/3452) [`55febef7f`](https://github.com/medusajs/medusa/commit/55febef7f1e74a07e76039d1ffbcb721c08adeb2) Thanks [@patrick-medusajs](https://github.com/patrick-medusajs)! - feat(types): package scaffolding for generated types

- [#3478](https://github.com/medusajs/medusa/pull/3478) [`6748877c6`](https://github.com/medusajs/medusa/commit/6748877c694c1433f666c6987f20af76b201b495) Thanks [@patrick-medusajs](https://github.com/patrick-medusajs)! - fix(oas,js,react): use AdminExtendedStoresRes instead of AdminStoresRes
