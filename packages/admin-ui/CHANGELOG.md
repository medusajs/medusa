# @medusajs/admin-ui

## 1.8.0

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

- [#3666](https://github.com/medusajs/medusa/pull/3666) [`ca3b32d53`](https://github.com/medusajs/medusa/commit/ca3b32d53c6854716bcbfb641ed381fa0f019a58) Thanks [@StephixOne](https://github.com/StephixOne)! - fix(admin-ui): Make copy and UI on manage locations modal better when no locations

- [#3676](https://github.com/medusajs/medusa/pull/3676) [`788ddc0f4`](https://github.com/medusajs/medusa/commit/788ddc0f43696df607f07133af15a04b29d5447d) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(admin-ui, medusa-react, medusa): Minor fixes to GC domain in admin UI. Also fixes GC update payload type in medusa-react and medusa.

- [#3512](https://github.com/medusajs/medusa/pull/3512) [`a8423b8ac`](https://github.com/medusajs/medusa/commit/a8423b8acc8723dd3f5475d23bd9cb8be9c630c0) Thanks [@StephixOne](https://github.com/StephixOne)! - fix(medusa, admin-ui): Fix edit order variant stock

- [#3644](https://github.com/medusajs/medusa/pull/3644) [`4342ac884`](https://github.com/medusajs/medusa/commit/4342ac884bc3fe473576ef10d291f3547e0ffc62) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - feat(admin-ui): Adds metadata forms to all applicable domains in the UI.
  fix(medusa): Fixes an issue where metadata was not being set for order addresses using `setMetadata`.

- [#3670](https://github.com/medusajs/medusa/pull/3670) [`a5ad6c054`](https://github.com/medusajs/medusa/commit/a5ad6c05428e1bb090bbc5a51345a00821781c06) Thanks [@pKorsholm](https://github.com/pKorsholm)! - Fix(admin-ui,medusa): Ensure stock locations are created with a name

- [#3657](https://github.com/medusajs/medusa/pull/3657) [`7e1d8ef59`](https://github.com/medusajs/medusa/commit/7e1d8ef599fe4588d439b449373debf1221e625d) Thanks [@StephixOne](https://github.com/StephixOne)! - feat(admin-ui): Add new feature badge for categories and inventory

- [#3685](https://github.com/medusajs/medusa/pull/3685) [`8ddb3952c`](https://github.com/medusajs/medusa/commit/8ddb3952c045e6c05c8d0f6922f0d4ba30cf3bd4) Thanks [@olivermrbl](https://github.com/olivermrbl)! - chore: Fix RC package versions

- [#3607](https://github.com/medusajs/medusa/pull/3607) [`d1a6aa5a9`](https://github.com/medusajs/medusa/commit/d1a6aa5a90c147a34448e5398a1f205649598c09) Thanks [@pKorsholm](https://github.com/pKorsholm)! - fix(admin-ui): fix bug with create fulfillment and a couple of other minor tweaks

- [#3706](https://github.com/medusajs/medusa/pull/3706) [`dae8da109`](https://github.com/medusajs/medusa/commit/dae8da1099bbe5fd3c59adc7fd2c28b41c0f71bc) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(admin): Duplicate product without prices

- [#3660](https://github.com/medusajs/medusa/pull/3660) [`eed784d7d`](https://github.com/medusajs/medusa/commit/eed784d7d0b58aeddc9f6f5ea56fe80c608b22f5) Thanks [@pKorsholm](https://github.com/pKorsholm)! - fix(admin-ui, medusa): resolve bugs for orders with variants without inventory items

- [#3438](https://github.com/medusajs/medusa/pull/3438) [`f027bc26f`](https://github.com/medusajs/medusa/commit/f027bc26fca94931df61c1cc0c7450de08020975) Thanks [@StephixOne](https://github.com/StephixOne)! - fix(admin): Show correct reserved/available values when editing stock on variant

- [#3418](https://github.com/medusajs/medusa/pull/3418) [`8a7421db5`](https://github.com/medusajs/medusa/commit/8a7421db5bd235dd3cf88bf73d2438af8769f7ba) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - feat(admin,admin-ui): Updates the default behaviour of the plugin, and makes building for external deployment easier

- [#3532](https://github.com/medusajs/medusa/pull/3532) [`bfef22b33`](https://github.com/medusajs/medusa/commit/bfef22b33e0aa4aa542d3f22fb32ee261f5a19ea) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(admin-ui): Revamps gift card manage page

- [#3608](https://github.com/medusajs/medusa/pull/3608) [`345005573`](https://github.com/medusajs/medusa/commit/345005573a337d63394b63d33d6740a4171d1479) Thanks [@StephixOne](https://github.com/StephixOne)! - fix(admin-ui): Update order edit variants table to fit longer content

- [#3585](https://github.com/medusajs/medusa/pull/3585) [`0d0090338`](https://github.com/medusajs/medusa/commit/0d00903385df980e355c54cee9bcd4e8ede21635) Thanks [@pKorsholm](https://github.com/pKorsholm)! - fix(admin-ui): minor fixes for inventory items

- [#3592](https://github.com/medusajs/medusa/pull/3592) [`455c56c4b`](https://github.com/medusajs/medusa/commit/455c56c4b3846c583f39ba56352d645128b0c967) Thanks [@StephixOne](https://github.com/StephixOne)! - fix(admin-ui): Hide inventory quantity field in variant stock form if SL module enabled

- [#3395](https://github.com/medusajs/medusa/pull/3395) [`15f47baf5`](https://github.com/medusajs/medusa/commit/15f47baf56e6722b7821cfaa2fb468e582dfa2c1) Thanks [@pKorsholm](https://github.com/pKorsholm)! - fix(admin-ui, medusa): Minor ui fixes relating to stock locations

- [#3645](https://github.com/medusajs/medusa/pull/3645) [`e6b5859af`](https://github.com/medusajs/medusa/commit/e6b5859af213185408e1087073c1cba10f7b33c2) Thanks [@StephixOne](https://github.com/StephixOne)! - feat(admin-ui): Make number input increment/decrement buttons not tabbable-to

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

- [#3655](https://github.com/medusajs/medusa/pull/3655) [`45fd0fb63`](https://github.com/medusajs/medusa/commit/45fd0fb639f05db6115be6823d42b85672c0891d) Thanks [@olivermrbl](https://github.com/olivermrbl)! - fix(admin-ui): Always show categories in product page

- [#3531](https://github.com/medusajs/medusa/pull/3531) [`4e9d257d3`](https://github.com/medusajs/medusa/commit/4e9d257d3bf76703ef5be8ca054cc9f0f7339def) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - Remove dependency on @medusajs/medusa from Inventory and Stock-Location Modules

- [#3577](https://github.com/medusajs/medusa/pull/3577) [`95c9fbfdd`](https://github.com/medusajs/medusa/commit/95c9fbfdd5f290df0f22115f27b82f0812f8bd67) Thanks [@StephixOne](https://github.com/StephixOne)! - fix(admin-ui): Fix effect check in inventory table and overflow UI

- [#3448](https://github.com/medusajs/medusa/pull/3448) [`d4af87311`](https://github.com/medusajs/medusa/commit/d4af873113e4e3bb75ff1f5646870eb77b7a2b40) Thanks [@StephixOne](https://github.com/StephixOne)! - fix(admin): Show all locations in allocation creation modal

- [#3541](https://github.com/medusajs/medusa/pull/3541) [`feaf8d2e1`](https://github.com/medusajs/medusa/commit/feaf8d2e19715585d154464d003759c3a1f4f322) Thanks [@pKorsholm](https://github.com/pKorsholm)! - fix(medusa, admin-ui): refine create-fulfillment flow

- [#3403](https://github.com/medusajs/medusa/pull/3403) [`57d7728dd`](https://github.com/medusajs/medusa/commit/57d7728dd9d00df712e1a872899b8397955dfe46) Thanks [@StephixOne](https://github.com/StephixOne)! - Add order allocation to admin ui

- [#3451](https://github.com/medusajs/medusa/pull/3451) [`55a1f232a`](https://github.com/medusajs/medusa/commit/55a1f232a3746a22adb1fcd1844b2659077a59f9) Thanks [@pKorsholm](https://github.com/pKorsholm)! - feat(medusa,admin-ui): support location_id in

- [#3401](https://github.com/medusajs/medusa/pull/3401) [`47d344076`](https://github.com/medusajs/medusa/commit/47d3440766efa26aba6638a05edec520a4e62828) Thanks [@riqwan](https://github.com/riqwan)! - feat(admin-ui, medusa-react): allow products to be categorized in product create/edit page

- [#3625](https://github.com/medusajs/medusa/pull/3625) [`7428ffa30`](https://github.com/medusajs/medusa/commit/7428ffa300a1e5781ef18b86edf97b711df0b585) Thanks [@StephixOne](https://github.com/StephixOne)! - Fix team table filter dropdown transparency

- Updated dependencies [[`d06ab9299`](https://github.com/medusajs/medusa/commit/d06ab929946c9e3842dcf4299b2c7e4c85fcc116), [`788ddc0f4`](https://github.com/medusajs/medusa/commit/788ddc0f43696df607f07133af15a04b29d5447d), [`fe9eea4c1`](https://github.com/medusajs/medusa/commit/fe9eea4c18b7e04ba91660716c92b11a49840a3c), [`7f87c4f2c`](https://github.com/medusajs/medusa/commit/7f87c4f2c8abb876213a595005e67d770be9cbe4), [`8ddb3952c`](https://github.com/medusajs/medusa/commit/8ddb3952c045e6c05c8d0f6922f0d4ba30cf3bd4), [`9ba09ba4d`](https://github.com/medusajs/medusa/commit/9ba09ba4d753f132537f0447097fe9f54922c074), [`12d304307`](https://github.com/medusajs/medusa/commit/12d304307af87ea9287a41869eb33ef09f273d85), [`80b95a230`](https://github.com/medusajs/medusa/commit/80b95a230056d9ed15f7302f248094f879516faf), [`54dcc1871`](https://github.com/medusajs/medusa/commit/54dcc1871c8f28bea962dbb9df6e79b038d56449), [`478d1af8d`](https://github.com/medusajs/medusa/commit/478d1af8d0df0af16baf4f130e19b0be34f5f295), [`6748877c6`](https://github.com/medusajs/medusa/commit/6748877c694c1433f666c6987f20af76b201b495), [`ef5ef9f5a`](https://github.com/medusajs/medusa/commit/ef5ef9f5a26febf0b64d9981606c1e59999ca76e), [`2d2727f75`](https://github.com/medusajs/medusa/commit/2d2727f753dd9386160d7e677b927c4915e1fce7), [`47d344076`](https://github.com/medusajs/medusa/commit/47d3440766efa26aba6638a05edec520a4e62828)]:
  - medusa-react@5.0.0

## 0.0.1-rc.8

### Patch Changes

- Updated dependencies []:
  - medusa-react@5.0.0-rc.8

## 0.0.1-rc.7

### Patch Changes

- [#3706](https://github.com/medusajs/medusa/pull/3706) [`dae8da109`](https://github.com/medusajs/medusa/commit/dae8da1099bbe5fd3c59adc7fd2c28b41c0f71bc) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(admin): Duplicate product without prices

- Updated dependencies []:
  - medusa-react@5.0.0-rc.7

## 0.0.1-rc.6

### Patch Changes

- [#3666](https://github.com/medusajs/medusa/pull/3666) [`ca3b32d53`](https://github.com/medusajs/medusa/commit/ca3b32d53c6854716bcbfb641ed381fa0f019a58) Thanks [@StephixOne](https://github.com/StephixOne)! - fix(admin-ui): Make copy and UI on manage locations modal better when no locations

- [#3676](https://github.com/medusajs/medusa/pull/3676) [`788ddc0f4`](https://github.com/medusajs/medusa/commit/788ddc0f43696df607f07133af15a04b29d5447d) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(admin-ui, medusa-react, medusa): Minor fixes to GC domain in admin UI. Also fixes GC update payload type in medusa-react and medusa.

- [#3670](https://github.com/medusajs/medusa/pull/3670) [`a5ad6c054`](https://github.com/medusajs/medusa/commit/a5ad6c05428e1bb090bbc5a51345a00821781c06) Thanks [@pKorsholm](https://github.com/pKorsholm)! - Fix(admin-ui,medusa): Ensure stock locations are created with a name

- [#3660](https://github.com/medusajs/medusa/pull/3660) [`eed784d7d`](https://github.com/medusajs/medusa/commit/eed784d7d0b58aeddc9f6f5ea56fe80c608b22f5) Thanks [@pKorsholm](https://github.com/pKorsholm)! - fix(admin-ui, medusa): resolve bugs for orders with variants without inventory items

- Updated dependencies [[`d06ab9299`](https://github.com/medusajs/medusa/commit/d06ab929946c9e3842dcf4299b2c7e4c85fcc116), [`788ddc0f4`](https://github.com/medusajs/medusa/commit/788ddc0f43696df607f07133af15a04b29d5447d), [`7f87c4f2c`](https://github.com/medusajs/medusa/commit/7f87c4f2c8abb876213a595005e67d770be9cbe4)]:
  - medusa-react@5.0.0-rc.6

## 0.0.1-rc.5

### Patch Changes

- [#3644](https://github.com/medusajs/medusa/pull/3644) [`4342ac884`](https://github.com/medusajs/medusa/commit/4342ac884bc3fe473576ef10d291f3547e0ffc62) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - feat(admin-ui): Adds metadata forms to all applicable domains in the UI.
  fix(medusa): Fixes an issue where metadata was not being set for order addresses using `setMetadata`.

- [#3657](https://github.com/medusajs/medusa/pull/3657) [`7e1d8ef59`](https://github.com/medusajs/medusa/commit/7e1d8ef599fe4588d439b449373debf1221e625d) Thanks [@StephixOne](https://github.com/StephixOne)! - feat(admin-ui): Add new feature badge for categories and inventory

- [#3645](https://github.com/medusajs/medusa/pull/3645) [`e6b5859af`](https://github.com/medusajs/medusa/commit/e6b5859af213185408e1087073c1cba10f7b33c2) Thanks [@StephixOne](https://github.com/StephixOne)! - feat(admin-ui): Make number input increment/decrement buttons not tabbable-to

- [#3655](https://github.com/medusajs/medusa/pull/3655) [`45fd0fb63`](https://github.com/medusajs/medusa/commit/45fd0fb639f05db6115be6823d42b85672c0891d) Thanks [@olivermrbl](https://github.com/olivermrbl)! - fix(admin-ui): Always show categories in product page

- Updated dependencies []:
  - medusa-react@5.0.0-rc.5

## 0.0.1-rc.4

### Patch Changes

- [#3585](https://github.com/medusajs/medusa/pull/3585) [`0d0090338`](https://github.com/medusajs/medusa/commit/0d00903385df980e355c54cee9bcd4e8ede21635) Thanks [@pKorsholm](https://github.com/pKorsholm)! - fix(admin-ui): minor fixes for inventory items

- [#3625](https://github.com/medusajs/medusa/pull/3625) [`7428ffa30`](https://github.com/medusajs/medusa/commit/7428ffa300a1e5781ef18b86edf97b711df0b585) Thanks [@StephixOne](https://github.com/StephixOne)! - Fix team table filter dropdown transparency

- Updated dependencies []:
  - medusa-react@5.0.0-rc.4

## 0.0.1-rc.3

### Patch Changes

- Updated dependencies []:
  - medusa-react@5.0.0-rc.3

## 0.0.1-rc.2

### Patch Changes

- chore: Fix RC package versions

- Updated dependencies []:
  - medusa-react@5.0.0-rc.2

## 0.0.1-rc.1

### Patch Changes

- [#3607](https://github.com/medusajs/medusa/pull/3607) [`d1a6aa5a9`](https://github.com/medusajs/medusa/commit/d1a6aa5a90c147a34448e5398a1f205649598c09) Thanks [@pKorsholm](https://github.com/pKorsholm)! - fix(admin-ui): fix bug with create fulfillment and a couple of other minor tweaks

- [#3608](https://github.com/medusajs/medusa/pull/3608) [`345005573`](https://github.com/medusajs/medusa/commit/345005573a337d63394b63d33d6740a4171d1479) Thanks [@StephixOne](https://github.com/StephixOne)! - fix(admin-ui): Update order edit variants table to fit longer content

- [#3592](https://github.com/medusajs/medusa/pull/3592) [`455c56c4b`](https://github.com/medusajs/medusa/commit/455c56c4b3846c583f39ba56352d645128b0c967) Thanks [@StephixOne](https://github.com/StephixOne)! - fix(admin-ui): Hide inventory quantity field in variant stock form if SL module enabled

- [#3577](https://github.com/medusajs/medusa/pull/3577) [`95c9fbfdd`](https://github.com/medusajs/medusa/commit/95c9fbfdd5f290df0f22115f27b82f0812f8bd67) Thanks [@StephixOne](https://github.com/StephixOne)! - fix(admin-ui): Fix effect check in inventory table and overflow UI

- [#3541](https://github.com/medusajs/medusa/pull/3541) [`feaf8d2e1`](https://github.com/medusajs/medusa/commit/feaf8d2e19715585d154464d003759c3a1f4f322) Thanks [@pKorsholm](https://github.com/pKorsholm)! - fix(medusa, admin-ui): refine create-fulfillment flow

- Updated dependencies []:
  - medusa-react@5.0.0-rc.1

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
