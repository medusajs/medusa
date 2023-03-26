# @medusajs/admin-ui

## 0.0.1-rc.0

### Patch Changes

- [#3403](https://github.com/medusajs/medusa/pull/3403) [`57d7728dd`](https://github.com/medusajs/medusa/commit/57d7728dd9d00df712e1a872899b8397955dfe46) Thanks [@StephixOne](https://github.com/StephixOne)! - add location support in fulfillment modal

- [#3461](https://github.com/medusajs/medusa/pull/3461) [`478903b55`](https://github.com/medusajs/medusa/commit/478903b55a6f7c276fa2285ee35bf8a2b51a72fb) Thanks [@StephixOne](https://github.com/StephixOne)! - fix(admin-ui): Admin UI fixes / enhancements

  - Inventory and order UI fixes and tweaks
  - focus-border clipping
  - Fix use of `expand` parameter on order page
  - Fix location address editing form state
  - ensure that the allocation indicator is correctly displayed
  - Fix inventory table pagination on location filter change
  - Try and ensure allocation table checkmarks align better
  - Add gap in table actions
  - remove allocate button if no more allcoations can be made
  - update edit-allocation sidebar
  - create/update/delete inventory items according to inventory items on the variant
  - Fix minor bugs related to the edit-allocation modal
  - move tailwind to direct dependency
  - display error messages for batch jobs
  - draft order shipping details
  - Implements redesigned public facing pages of admin UI.
  - Add location names to fulfilment rows and timeline events
  - Encode location id in URL on location table

- [#3512](https://github.com/medusajs/medusa/pull/3512) [`a8423b8ac`](https://github.com/medusajs/medusa/commit/a8423b8acc8723dd3f5475d23bd9cb8be9c630c0) Thanks [@StephixOne](https://github.com/StephixOne)! - fix(medusa, admin-ui): Fix edit order variant stock

- [#3438](https://github.com/medusajs/medusa/pull/3438) [`f027bc26f`](https://github.com/medusajs/medusa/commit/f027bc26fca94931df61c1cc0c7450de08020975) Thanks [@StephixOne](https://github.com/StephixOne)! - fix(admin): Show correct reserved/available values when editing stock on variant

- [#3418](https://github.com/medusajs/medusa/pull/3418) [`8a7421db5`](https://github.com/medusajs/medusa/commit/8a7421db5bd235dd3cf88bf73d2438af8769f7ba) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - feat(admin,admin-ui): Updates the default behaviour of the plugin, and makes building for external deployment easier

- [#3532](https://github.com/medusajs/medusa/pull/3532) [`bfef22b33`](https://github.com/medusajs/medusa/commit/bfef22b33e0aa4aa542d3f22fb32ee261f5a19ea) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(admin-ui): Revamps gift card manage page

- [#3395](https://github.com/medusajs/medusa/pull/3395) [`15f47baf5`](https://github.com/medusajs/medusa/commit/15f47baf56e6722b7821cfaa2fb468e582dfa2c1) Thanks [@pKorsholm](https://github.com/pKorsholm)! - fix(admin-ui, medusa): Minor ui fixes relating to stock locations

- [#3522](https://github.com/medusajs/medusa/pull/3522) [`55c5fba0d`](https://github.com/medusajs/medusa/commit/55c5fba0d3dbd015c3ffd74d645a8057892d0f52) Thanks [@pKorsholm](https://github.com/pKorsholm)! - feat(medusa,admin): location_ids in swap and claim creation

- [#3334](https://github.com/medusajs/medusa/pull/3334) [`40de54b01`](https://github.com/medusajs/medusa/commit/40de54b0101bdfd37f577d18c10ec9f1ab1ce8fe) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - feat(medusa,admin,admin-ui): Add new plugin to serve the admin dashboard from the server. Adds a new plugin injection step `setup`, code placed in the `setup` folder of a plugin will be run before any code from a plugin is injected into the Medusa server.

- [#3416](https://github.com/medusajs/medusa/pull/3416) [`478d1af8d`](https://github.com/medusajs/medusa/commit/478d1af8d0df0af16baf4f130e19b0be34f5f295) Thanks [@riqwan](https://github.com/riqwan)! - feat(medusa, admin-ui, medusa-react): Improvements to product categories

  - Adds name as required in category create form
  - Adds name and handle as required in category edit form
  - Updates message on create/update forms
  - Adds category indicators for is_internal and is_active fields in the tree list
  - Fixes bug where tree is not reset when update fails
  - allow appending all category descendants with a param in list endpoint
  - fix rank order changing on category update
  - invalidate products query on category delete
  - adds category ui for tree/list, edit, create, delete
  - add product category queries and mutations
  - category list API can return all descendant
  - added breadcrumbs for categories on create/edit modal
  - add empty state for product categories
  - increase tree depth + scope categories on store + allow categories relation in products API
  - categories can be ranked based on position
  - seed command can create product categories
  - hide categories in products behind feature flag
  - fixes bug for mpath incorrectly updated for nested categories

- [#3434](https://github.com/medusajs/medusa/pull/3434) [`f43f03bad`](https://github.com/medusajs/medusa/commit/f43f03badbfd1d3598f3c6bc6c81e6fa2e9c2a09) Thanks [@StephixOne](https://github.com/StephixOne)! - fix(admin): Fix fulfilment creation

- [#3531](https://github.com/medusajs/medusa/pull/3531) [`4e9d257d3`](https://github.com/medusajs/medusa/commit/4e9d257d3bf76703ef5be8ca054cc9f0f7339def) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - Remove dependency on @medusajs/medusa from Inventory and Stock-Location Modules

- [#3448](https://github.com/medusajs/medusa/pull/3448) [`d4af87311`](https://github.com/medusajs/medusa/commit/d4af873113e4e3bb75ff1f5646870eb77b7a2b40) Thanks [@StephixOne](https://github.com/StephixOne)! - fix(admin): Show all locations in allocation creation modal

- [#3403](https://github.com/medusajs/medusa/pull/3403) [`57d7728dd`](https://github.com/medusajs/medusa/commit/57d7728dd9d00df712e1a872899b8397955dfe46) Thanks [@StephixOne](https://github.com/StephixOne)! - Add order allocation to admin ui

- [#3451](https://github.com/medusajs/medusa/pull/3451) [`55a1f232a`](https://github.com/medusajs/medusa/commit/55a1f232a3746a22adb1fcd1844b2659077a59f9) Thanks [@pKorsholm](https://github.com/pKorsholm)! - feat(medusa,admin-ui): support location_id in

- [#3401](https://github.com/medusajs/medusa/pull/3401) [`47d344076`](https://github.com/medusajs/medusa/commit/47d3440766efa26aba6638a05edec520a4e62828) Thanks [@riqwan](https://github.com/riqwan)! - feat(admin-ui, medusa-react): allow products to be categorized in product create/edit page

- Updated dependencies [[`fe9eea4c1`](https://github.com/medusajs/medusa/commit/fe9eea4c18b7e04ba91660716c92b11a49840a3c), [`9ba09ba4d`](https://github.com/medusajs/medusa/commit/9ba09ba4d753f132537f0447097fe9f54922c074), [`12d304307`](https://github.com/medusajs/medusa/commit/12d304307af87ea9287a41869eb33ef09f273d85), [`80b95a230`](https://github.com/medusajs/medusa/commit/80b95a230056d9ed15f7302f248094f879516faf), [`54dcc1871`](https://github.com/medusajs/medusa/commit/54dcc1871c8f28bea962dbb9df6e79b038d56449), [`478d1af8d`](https://github.com/medusajs/medusa/commit/478d1af8d0df0af16baf4f130e19b0be34f5f295), [`6748877c6`](https://github.com/medusajs/medusa/commit/6748877c694c1433f666c6987f20af76b201b495), [`ef5ef9f5a`](https://github.com/medusajs/medusa/commit/ef5ef9f5a26febf0b64d9981606c1e59999ca76e), [`2d2727f75`](https://github.com/medusajs/medusa/commit/2d2727f753dd9386160d7e677b927c4915e1fce7), [`47d344076`](https://github.com/medusajs/medusa/commit/47d3440766efa26aba6638a05edec520a4e62828)]:
  - medusa-react@5.0.0-rc.0
