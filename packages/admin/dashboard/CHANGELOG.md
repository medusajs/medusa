# @medusajs/dashboard

## 2.13.3

### Patch Changes

- Updated dependencies []:
  - @medusajs/js-sdk@2.13.3
  - @medusajs/admin-shared@2.13.3
  - @medusajs/icons@2.13.3
  - @medusajs/ui@4.1.3

## 2.13.2

### Patch Changes

- [#14720](https://github.com/medusajs/medusa/pull/14720) [`f37f029799cad7ee0337aeab625df5e272de2363`](https://github.com/medusajs/medusa/commit/f37f029799cad7ee0337aeab625df5e272de2363) Thanks [@arjusmoon860](https://github.com/arjusmoon860)! - feat(dashboard, admin-bundler, utils, types): add configurable maximum file upload size

- [#14146](https://github.com/medusajs/medusa/pull/14146) [`d2ce360875bafc3fc0c367384b9b631e77130726`](https://github.com/medusajs/medusa/commit/d2ce360875bafc3fc0c367384b9b631e77130726) Thanks [@adevinwild](https://github.com/adevinwild)! - Introduce filtering orders by total price on the API and Admin UI

- [#14523](https://github.com/medusajs/medusa/pull/14523) [`c1cc9a71507ec51ba5bdfecf8243d3e355c03fdc`](https://github.com/medusajs/medusa/commit/c1cc9a71507ec51ba5bdfecf8243d3e355c03fdc) Thanks [@bqst](https://github.com/bqst)! - fix(dashboard): handle undefined payment_collections in order table calculations

- [#14631](https://github.com/medusajs/medusa/pull/14631) [`337a7bbea3b7b0d677077f939d56afc5c3b01c22`](https://github.com/medusajs/medusa/commit/337a7bbea3b7b0d677077f939d56afc5c3b01c22) Thanks [@marlinjai](https://github.com/marlinjai)! - fix(dashboard): pass product ID explicitly to edit option form

  The edit product option form was using `option.product_id` which is undefined when options are fetched as part of a product response. Now passes the product ID from the parent component via props.

- [#14461](https://github.com/medusajs/medusa/pull/14461) [`b87899f1121c8577757dc96236869b19f68f51f3`](https://github.com/medusajs/medusa/commit/b87899f1121c8577757dc96236869b19f68f51f3) Thanks [@chuxi](https://github.com/chuxi)! - fix(dashboard): settingsRoutes from multiple plugins only show the first one

  Previously, when multiple plugins registered settings routes, only the first plugin's routes were displayed. This fix uses `flatMap` to properly merge all settings routes from all plugins.

- [#14273](https://github.com/medusajs/medusa/pull/14273) [`bc36968049412fcec515c4141cd911a5bfb51283`](https://github.com/medusajs/medusa/commit/bc36968049412fcec515c4141cd911a5bfb51283) Thanks [@docloulou](https://github.com/docloulou)! - fix(dashboard): Initialize complete price structure for variants in price list edit

- [#14568](https://github.com/medusajs/medusa/pull/14568) [`a74623de7d545205da7340ede6286853c1bcfb2d`](https://github.com/medusajs/medusa/commit/a74623de7d545205da7340ede6286853c1bcfb2d) Thanks [@iharshyadav](https://github.com/iharshyadav)! - fix(dashboard): Use start-[68px] for RTL table sticky cells.

- [#14619](https://github.com/medusajs/medusa/pull/14619) [`08f79d7403d7f2311ee93753f2f870658b951d7b`](https://github.com/medusajs/medusa/commit/08f79d7403d7f2311ee93753f2f870658b951d7b) Thanks [@NicolasGorga](https://github.com/NicolasGorga)! - fix(dashboard): fix toggeable number cell set value

- [#14620](https://github.com/medusajs/medusa/pull/14620) [`4c4d2a533c8fe11ec8bf7e0d4f7a8b4888305137`](https://github.com/medusajs/medusa/commit/4c4d2a533c8fe11ec8bf7e0d4f7a8b4888305137) Thanks [@NicolasGorga](https://github.com/NicolasGorga)! - fix(dashboard): fix view configurations order filters

- [#14677](https://github.com/medusajs/medusa/pull/14677) [`19fdb0cf2ce9f444d80149208b2fa1d4e3e7c17c`](https://github.com/medusajs/medusa/commit/19fdb0cf2ce9f444d80149208b2fa1d4e3e7c17c) Thanks [@webgodo](https://github.com/webgodo)! - fix(admin): use is_tax_inclusive as column id in store add-currencies form

- [#14780](https://github.com/medusajs/medusa/pull/14780) [`a4c420e75cbed3e5f618849d2622045982377c96`](https://github.com/medusajs/medusa/commit/a4c420e75cbed3e5f618849d2622045982377c96) Thanks [@mokivan](https://github.com/mokivan)! - chore(dashboard): Add i18n support for promotion template titles and descriptions

- [#14118](https://github.com/medusajs/medusa/pull/14118) [`da1aa3df16735460bb584be815ea27d2436942ae`](https://github.com/medusajs/medusa/commit/da1aa3df16735460bb584be815ea27d2436942ae) Thanks [@adevinwild](https://github.com/adevinwild)! - Fix DataTable row click to always prepend **BASE** (or "/") to row URLs when opening new tabs or windows.

- Updated dependencies [[`63e50fd6a4430dbb7737d1223818f8d27bb3d53b`](https://github.com/medusajs/medusa/commit/63e50fd6a4430dbb7737d1223818f8d27bb3d53b), [`873571a7c9471a28732ac7fad70ff66c28571a0e`](https://github.com/medusajs/medusa/commit/873571a7c9471a28732ac7fad70ff66c28571a0e), [`6e994dcd6559ece5e79cb5375965f69c640d56b1`](https://github.com/medusajs/medusa/commit/6e994dcd6559ece5e79cb5375965f69c640d56b1)]:
  - @medusajs/ui@4.1.2
  - @medusajs/icons@2.13.2
  - @medusajs/js-sdk@2.13.2
  - @medusajs/admin-shared@2.13.2

## 2.13.1

### Patch Changes

- Updated dependencies []:
  - @medusajs/admin-shared@2.13.1
  - @medusajs/js-sdk@2.13.1
  - @medusajs/icons@2.13.1
  - @medusajs/ui@4.1.1

## 2.13.0

### Minor Changes

- [`a31e72c31c5235240cead2d04e39e5927688eec7`](https://github.com/medusajs/medusa/commit/a31e72c31c5235240cead2d04e39e5927688eec7) Thanks [@olivermrbl](https://github.com/olivermrbl)! - chore: Minor bump

### Patch Changes

- Updated dependencies [[`a31e72c31c5235240cead2d04e39e5927688eec7`](https://github.com/medusajs/medusa/commit/a31e72c31c5235240cead2d04e39e5927688eec7)]:
  - @medusajs/admin-shared@2.13.0
  - @medusajs/js-sdk@2.13.0
  - @medusajs/icons@2.13.0
  - @medusajs/ui@4.1.0

## 2.12.6

### Patch Changes

- [#14541](https://github.com/medusajs/medusa/pull/14541) [`a9b5797e2de093e26286808876262b724e26671a`](https://github.com/medusajs/medusa/commit/a9b5797e2de093e26286808876262b724e26671a) Thanks [@NicolasGorga](https://github.com/NicolasGorga)! - feat(dashboard,translation,js-sdk,medusa,types): Translation settings management UI

- [#14601](https://github.com/medusajs/medusa/pull/14601) [`c6067ab3d79571097134b69329b7e605d7108346`](https://github.com/medusajs/medusa/commit/c6067ab3d79571097134b69329b7e605d7108346) Thanks [@NicolasGorga](https://github.com/NicolasGorga)! - fix(dashboard): translations settings ui styles alignment

- [#14488](https://github.com/medusajs/medusa/pull/14488) [`19f274523cda2cf13fc9194d72b9d8a71aba264c`](https://github.com/medusajs/medusa/commit/19f274523cda2cf13fc9194d72b9d8a71aba264c) Thanks [@peterlgh7](https://github.com/peterlgh7)! - add cloud auto-login

- [#14549](https://github.com/medusajs/medusa/pull/14549) [`c5b919850cf4a133686606bbff66b2bc6d6d3ae0`](https://github.com/medusajs/medusa/commit/c5b919850cf4a133686606bbff66b2bc6d6d3ae0) Thanks [@NicolasGorga](https://github.com/NicolasGorga)! - fix(dashboard): filter feed channel notifications in admin dashboard

- [#14560](https://github.com/medusajs/medusa/pull/14560) [`31dc33103620a808a6ded8ce1d5532c27d9daa1e`](https://github.com/medusajs/medusa/commit/31dc33103620a808a6ded8ce1d5532c27d9daa1e) Thanks [@NicolasGorga](https://github.com/NicolasGorga)! - chore(dashboard): polish translations for refund reasons domain

- [#14586](https://github.com/medusajs/medusa/pull/14586) [`3751b10337c056c3a61a4726046ebf4c31a3530b`](https://github.com/medusajs/medusa/commit/3751b10337c056c3a61a4726046ebf4c31a3530b) Thanks [@fPolic](https://github.com/fPolic)! - chore: bump RR minor version

- Updated dependencies [[`a9b5797e2de093e26286808876262b724e26671a`](https://github.com/medusajs/medusa/commit/a9b5797e2de093e26286808876262b724e26671a)]:
  - @medusajs/js-sdk@2.12.6
  - @medusajs/admin-shared@2.12.6
  - @medusajs/icons@2.12.6
  - @medusajs/ui@4.0.34

## 2.12.5

### Patch Changes

- Updated dependencies []:
  - @medusajs/js-sdk@2.12.5
  - @medusajs/admin-shared@2.12.5
  - @medusajs/icons@2.12.5
  - @medusajs/ui@4.0.33

## 2.12.4

### Patch Changes

- [#14369](https://github.com/medusajs/medusa/pull/14369) [`d06729d0d14d7f657a2cdeb958dd7ac6d3c6f199`](https://github.com/medusajs/medusa/commit/d06729d0d14d7f657a2cdeb958dd7ac6d3c6f199) Thanks [@fPolic](https://github.com/fPolic)! - fix(dashboard): form reset for across allocation

- [#14394](https://github.com/medusajs/medusa/pull/14394) [`caa561badf960c076b4f564dadbbbb9e36d00a18`](https://github.com/medusajs/medusa/commit/caa561badf960c076b4f564dadbbbb9e36d00a18) Thanks [@NicolasGorga](https://github.com/NicolasGorga)! - feat(dashboard): Add first and last name inputs to update order shipping and billing address forms

- [#14355](https://github.com/medusajs/medusa/pull/14355) [`b21a599d118f126e64d2993d46ba60f4a4e94545`](https://github.com/medusajs/medusa/commit/b21a599d118f126e64d2993d46ba60f4a4e94545) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(): Translation settings + user configuration + js/admin

- [#14453](https://github.com/medusajs/medusa/pull/14453) [`d9bc2767c1dd099844c54c3ef49d64e4135c117d`](https://github.com/medusajs/medusa/commit/d9bc2767c1dd099844c54c3ef49d64e4135c117d) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(translation): Update wording in translation list for translation…

- [#14330](https://github.com/medusajs/medusa/pull/14330) [`9f8da1e2e07ae1424e38b8bc61be465558e6980b`](https://github.com/medusajs/medusa/commit/9f8da1e2e07ae1424e38b8bc61be465558e6980b) Thanks [@NicolasGorga](https://github.com/NicolasGorga)! - fix(dashboard): Remove unused translation property

- [#14464](https://github.com/medusajs/medusa/pull/14464) [`d54589751c7f929c173c500344ce5689b8a5dc15`](https://github.com/medusajs/medusa/commit/d54589751c7f929c173c500344ce5689b8a5dc15) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(translation): Improve translation alert in empty languages state

- [#14451](https://github.com/medusajs/medusa/pull/14451) [`0490a1c67fb6abd80b49a926c41c1f22eb759493`](https://github.com/medusajs/medusa/commit/0490a1c67fb6abd80b49a926c41c1f22eb759493) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(translation): Order translastable entities ordered alphabetically

- [#14413](https://github.com/medusajs/medusa/pull/14413) [`4ac7b72d10e1046100d6ad92c686e846e9635e77`](https://github.com/medusajs/medusa/commit/4ac7b72d10e1046100d6ad92c686e846e9635e77) Thanks [@shahednasser](https://github.com/shahednasser)! - fix(dashboard): fix customer details page crashing when their order is refunded

- [#14400](https://github.com/medusajs/medusa/pull/14400) [`242f1d7d7f96ec27f3d2c9aafa8324f2ee9b28fd`](https://github.com/medusajs/medusa/commit/242f1d7d7f96ec27f3d2c9aafa8324f2ee9b28fd) Thanks [@NicolasGorga](https://github.com/NicolasGorga)! - feat(dashboard,draft-order): Remove hardcoded strings and replace with translations in draft orders list page

- Updated dependencies [[`ab7b04dbc9acfbad11bfaf66276a78ce57d34357`](https://github.com/medusajs/medusa/commit/ab7b04dbc9acfbad11bfaf66276a78ce57d34357), [`b21a599d118f126e64d2993d46ba60f4a4e94545`](https://github.com/medusajs/medusa/commit/b21a599d118f126e64d2993d46ba60f4a4e94545), [`d54589751c7f929c173c500344ce5689b8a5dc15`](https://github.com/medusajs/medusa/commit/d54589751c7f929c173c500344ce5689b8a5dc15)]:
  - @medusajs/js-sdk@2.12.4
  - @medusajs/ui@4.0.32
  - @medusajs/admin-shared@2.12.4
  - @medusajs/icons@2.12.4

## 2.12.3

### Patch Changes

- [#14300](https://github.com/medusajs/medusa/pull/14300) [`8964a03fa1b9e6a4c443bf5b21d65d41a8441d29`](https://github.com/medusajs/medusa/commit/8964a03fa1b9e6a4c443bf5b21d65d41a8441d29) Thanks [@NicolasGorga](https://github.com/NicolasGorga)! - chore(): Remove default_locale from StoreLocale

- [#14138](https://github.com/medusajs/medusa/pull/14138) [`70929ecac3e5610d90d47a40a517eac3cf3173a4`](https://github.com/medusajs/medusa/commit/70929ecac3e5610d90d47a40a517eac3cf3173a4) Thanks [@NicolasGorga](https://github.com/NicolasGorga)! - fix(dashboard,medusa,types): improve performance for price list prices retrieval

- [#14045](https://github.com/medusajs/medusa/pull/14045) [`b5edbb994084b6095ee523e018b835f19e73df3a`](https://github.com/medusajs/medusa/commit/b5edbb994084b6095ee523e018b835f19e73df3a) Thanks [@NicolasGorga](https://github.com/NicolasGorga)! - fix(pricing,dashboard): update min_quantity/max_quantity to decimal in price model

- Updated dependencies [[`665b80adb1f0ca2205307c0cc5294ad1d3b3ea58`](https://github.com/medusajs/medusa/commit/665b80adb1f0ca2205307c0cc5294ad1d3b3ea58), [`a43eb11d6565d19e82cf2b06e262ab509214b3d4`](https://github.com/medusajs/medusa/commit/a43eb11d6565d19e82cf2b06e262ab509214b3d4), [`accb778039a52fae8eefbada77044c527b136114`](https://github.com/medusajs/medusa/commit/accb778039a52fae8eefbada77044c527b136114), [`191e647eec8755f9680033077d164febefa976df`](https://github.com/medusajs/medusa/commit/191e647eec8755f9680033077d164febefa976df), [`c8a7122ba918751b215dc0b19cf9b09b2c011ab8`](https://github.com/medusajs/medusa/commit/c8a7122ba918751b215dc0b19cf9b09b2c011ab8)]:
  - @medusajs/js-sdk@2.12.3
  - @medusajs/icons@2.12.3
  - @medusajs/ui@4.0.31
  - @medusajs/admin-shared@2.12.3

## 2.12.2

### Patch Changes

- [#14221](https://github.com/medusajs/medusa/pull/14221) [`6176f93ac5ad403dd5fb733d6d22632747ccfca3`](https://github.com/medusajs/medusa/commit/6176f93ac5ad403dd5fb733d6d22632747ccfca3) Thanks [@fPolic](https://github.com/fPolic)! - fix(dashboard, order): summary pending diff calculation on preview

- [#14077](https://github.com/medusajs/medusa/pull/14077) [`008f5bb47df3322fc678d16e80fa62e991bbc8f1`](https://github.com/medusajs/medusa/commit/008f5bb47df3322fc678d16e80fa62e991bbc8f1) Thanks [@NicolasGorga](https://github.com/NicolasGorga)! - feat(dashboard): Improve fully refunded order details

- [#14232](https://github.com/medusajs/medusa/pull/14232) [`b53d63d6c86f0aee1d5601b680e6cca7fd5c31a7`](https://github.com/medusajs/medusa/commit/b53d63d6c86f0aee1d5601b680e6cca7fd5c31a7) Thanks [@NicolasGorga](https://github.com/NicolasGorga)! - fix(dashboard): pass prefix to useDataTable to fix product list not paginating

- [#14175](https://github.com/medusajs/medusa/pull/14175) [`9e4d2df72fe9d50188e56670a96f79dace45d1ae`](https://github.com/medusajs/medusa/commit/9e4d2df72fe9d50188e56670a96f79dace45d1ae) Thanks [@NicolasGorga](https://github.com/NicolasGorga)! - fix(dashboard): avoid unnecessary product relations to be returned by default

- [#14215](https://github.com/medusajs/medusa/pull/14215) [`3e3e6c37bd325cd78370aa4783666117ea665bb8`](https://github.com/medusajs/medusa/commit/3e3e6c37bd325cd78370aa4783666117ea665bb8) Thanks [@NicolasGorga](https://github.com/NicolasGorga)! - fix(dashboard): show correct color indicators for payment and fulfillment status columns for `view_configuration` feature flag

- Updated dependencies []:
  - @medusajs/js-sdk@2.12.2
  - @medusajs/admin-shared@2.12.2
  - @medusajs/icons@2.12.2
  - @medusajs/ui@4.0.30

## 2.12.1

### Patch Changes

- Updated dependencies []:
  - @medusajs/admin-shared@2.12.1
  - @medusajs/js-sdk@2.12.1
  - @medusajs/icons@2.12.1
  - @medusajs/ui@4.0.29

## 2.12.0

### Patch Changes

- [#14021](https://github.com/medusajs/medusa/pull/14021) [`2b6c39535f1157a1c0432b64dd93132d88a6280b`](https://github.com/medusajs/medusa/commit/2b6c39535f1157a1c0432b64dd93132d88a6280b) Thanks [@NicolasGorga](https://github.com/NicolasGorga)! - feat(dashboard): include product material in product general section

- [#14121](https://github.com/medusajs/medusa/pull/14121) [`1e761345be9fd179b03682b8291158147485135d`](https://github.com/medusajs/medusa/commit/1e761345be9fd179b03682b8291158147485135d) Thanks [@fPolic](https://github.com/fPolic)! - feat(dashboard): show promo tooltip on edit flows

- [#14041](https://github.com/medusajs/medusa/pull/14041) [`657a16c4622d1c075e9e40cb9babbf15f04a3aa7`](https://github.com/medusajs/medusa/commit/657a16c4622d1c075e9e40cb9babbf15f04a3aa7) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(): Remove lodash.set entirely

- [#13843](https://github.com/medusajs/medusa/pull/13843) [`3852efbcfffbfd10b7f7cae7d1a15de2a5f3afee`](https://github.com/medusajs/medusa/commit/3852efbcfffbfd10b7f7cae7d1a15de2a5f3afee) Thanks [@leobenzol](https://github.com/leobenzol)! - feat(admin-\*,dashboard): i18n labels for menu item extensions

- [#13991](https://github.com/medusajs/medusa/pull/13991) [`5a96bb7da463280a058177cc246aa5d9b0ba70f4`](https://github.com/medusajs/medusa/commit/5a96bb7da463280a058177cc246aa5d9b0ba70f4) Thanks [@juanzgc](https://github.com/juanzgc)! - Improve error messaging for file uploads

- [#14049](https://github.com/medusajs/medusa/pull/14049) [`f2f3a8e1e1e656f4aea2b25402df25fced6f768e`](https://github.com/medusajs/medusa/commit/f2f3a8e1e1e656f4aea2b25402df25fced6f768e) Thanks [@fPolic](https://github.com/fPolic)! - fix(dashboard): reference global vite bin from scripts

- [#13994](https://github.com/medusajs/medusa/pull/13994) [`6898ca758c6efc33f9f519e4d7db9b5bd549a87b`](https://github.com/medusajs/medusa/commit/6898ca758c6efc33f9f519e4d7db9b5bd549a87b) Thanks [@NicolasGorga](https://github.com/NicolasGorga)! - fix(dashboard): update orders page filters to match interface expected by old DataTable component

- [#14167](https://github.com/medusajs/medusa/pull/14167) [`8f1b97898b8abf0b860d89480fa8f1c58ed239f3`](https://github.com/medusajs/medusa/commit/8f1b97898b8abf0b860d89480fa8f1c58ed239f3) Thanks [@adevinwild](https://github.com/adevinwild)! - Enable sorting by default based on the `apiColumn` state

- [#13547](https://github.com/medusajs/medusa/pull/13547) [`1762f73bd903d7e447f9067cc63e172ac58a0f39`](https://github.com/medusajs/medusa/commit/1762f73bd903d7e447f9067cc63e172ac58a0f39) Thanks [@leobenzol](https://github.com/leobenzol)! - feat(admin-vite-plugin,dashboard): support for react-router's splat and optional segments

- [#13946](https://github.com/medusajs/medusa/pull/13946) [`213c344804fb1077aaca3e3cefbd1653ae559899`](https://github.com/medusajs/medusa/commit/213c344804fb1077aaca3e3cefbd1653ae559899) Thanks [@bqst](https://github.com/bqst)! - feat(dashboard): add custom admin route ranking feature

- [#13760](https://github.com/medusajs/medusa/pull/13760) [`536a3f802c92960b1eab48c37db25a8c542fd231`](https://github.com/medusajs/medusa/commit/536a3f802c92960b1eab48c37db25a8c542fd231) Thanks [@fPolic](https://github.com/fPolic)! - feat: promotion usage limit

- [#14128](https://github.com/medusajs/medusa/pull/14128) [`5da51064d7936c6d7a459cfa8b34eada65163e03`](https://github.com/medusajs/medusa/commit/5da51064d7936c6d7a459cfa8b34eada65163e03) Thanks [@fPolic](https://github.com/fPolic)! - feat: carry over promotions toggle on exchanges

- [#13935](https://github.com/medusajs/medusa/pull/13935) [`67744f45795636ff0702b4d0626ed8a44fb5cb76`](https://github.com/medusajs/medusa/commit/67744f45795636ff0702b4d0626ed8a44fb5cb76) Thanks [@ZeB4la](https://github.com/ZeB4la)! - feat(dashboard): add pt-PT translation and register locale

- [#13986](https://github.com/medusajs/medusa/pull/13986) [`3ca1e1df3314370580507a864b12128770d37273`](https://github.com/medusajs/medusa/commit/3ca1e1df3314370580507a864b12128770d37273) Thanks [@willbouch](https://github.com/willbouch)! - fix(dashboard): fix import for ptPT locale

- [#13997](https://github.com/medusajs/medusa/pull/13997) [`4bbf0d23674856f2d9fd0a9d137a478bc90b4cdb`](https://github.com/medusajs/medusa/commit/4bbf0d23674856f2d9fd0a9d137a478bc90b4cdb) Thanks [@NicolasGorga](https://github.com/NicolasGorga)! - fix(dashboard): use order version 1 for the initial node of activity timeline

- [#14024](https://github.com/medusajs/medusa/pull/14024) [`6746fecd727823b233a90edb1819d08555124464`](https://github.com/medusajs/medusa/commit/6746fecd727823b233a90edb1819d08555124464) Thanks [@adrien2p](https://github.com/adrien2p)! - Chore/order custom display

- [#14013](https://github.com/medusajs/medusa/pull/14013) [`c93f77d1b20395db171016b2710a6ddf95da9851`](https://github.com/medusajs/medusa/commit/c93f77d1b20395db171016b2710a6ddf95da9851) Thanks [@olivermrbl](https://github.com/olivermrbl)! - chore: Allow injection of our JS-SDK's auth type in dashboard

- Updated dependencies [[`00aa2c13bc37223029e40b38f3e2bedd8ed1e816`](https://github.com/medusajs/medusa/commit/00aa2c13bc37223029e40b38f3e2bedd8ed1e816), [`5da51064d7936c6d7a459cfa8b34eada65163e03`](https://github.com/medusajs/medusa/commit/5da51064d7936c6d7a459cfa8b34eada65163e03)]:
  - @medusajs/js-sdk@2.12.0
  - @medusajs/admin-shared@2.12.0
  - @medusajs/icons@2.12.0
  - @medusajs/ui@4.0.28

## 2.11.3

### Patch Changes

- [#13910](https://github.com/medusajs/medusa/pull/13910) [`224ab39a81e8d3cf3d6fa3ff5eee82541f64728d`](https://github.com/medusajs/medusa/commit/224ab39a81e8d3cf3d6fa3ff5eee82541f64728d) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(): Dependencies cleanup and improvements

- [#13940](https://github.com/medusajs/medusa/pull/13940) [`afb40d437b3cc4ceb015df70985b2f005f40eaff`](https://github.com/medusajs/medusa/commit/afb40d437b3cc4ceb015df70985b2f005f40eaff) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(): Cleanup and organize deps

- [#13958](https://github.com/medusajs/medusa/pull/13958) [`c6556d1256e4d0c1e001069a7ada4a902c6bbe86`](https://github.com/medusajs/medusa/commit/c6556d1256e4d0c1e001069a7ada4a902c6bbe86) Thanks [@NicolasGorga](https://github.com/NicolasGorga)! - Inlude missing Shipping Profile Id and Product Sales Channel 1 columns to product import CSV template

- [#13949](https://github.com/medusajs/medusa/pull/13949) [`0426568569a2d6b2a0bd61c9378787e258221610`](https://github.com/medusajs/medusa/commit/0426568569a2d6b2a0bd61c9378787e258221610) Thanks [@NicolasGorga](https://github.com/NicolasGorga)! - Update problematic dependency array of InfiniteList useEffect to avoid infinite loop.

- Updated dependencies [[`224ab39a81e8d3cf3d6fa3ff5eee82541f64728d`](https://github.com/medusajs/medusa/commit/224ab39a81e8d3cf3d6fa3ff5eee82541f64728d), [`afb40d437b3cc4ceb015df70985b2f005f40eaff`](https://github.com/medusajs/medusa/commit/afb40d437b3cc4ceb015df70985b2f005f40eaff), [`37563987b8fe75c9acfe62957a33e8398977647a`](https://github.com/medusajs/medusa/commit/37563987b8fe75c9acfe62957a33e8398977647a)]:
  - @medusajs/admin-shared@2.11.3
  - @medusajs/icons@2.11.3
  - @medusajs/js-sdk@2.11.3
  - @medusajs/ui@4.0.27

## 2.11.2

### Patch Changes

- [#13860](https://github.com/medusajs/medusa/pull/13860) [`9f154c308ec62093c8e6c233767760be3148d917`](https://github.com/medusajs/medusa/commit/9f154c308ec62093c8e6c233767760be3148d917) Thanks [@NicolasGorga](https://github.com/NicolasGorga)! - fix(dashboard): Limit number of ids passed in tax region override queries to avoid PayloadTooLargeError

- [#13881](https://github.com/medusajs/medusa/pull/13881) [`1594c13962436c78dbb1b304aa3c657cc8ff2d9c`](https://github.com/medusajs/medusa/commit/1594c13962436c78dbb1b304aa3c657cc8ff2d9c) Thanks [@fPolic](https://github.com/fPolic)! - fix(dashboard): preserve old image ids when deleting a product image

- [#13874](https://github.com/medusajs/medusa/pull/13874) [`ac6754f008a5ecc3fa2677e74a681b0e23014043`](https://github.com/medusajs/medusa/commit/ac6754f008a5ecc3fa2677e74a681b0e23014043) Thanks [@bqst](https://github.com/bqst)! - feat(admin): Change admin order list default sort

- [#13861](https://github.com/medusajs/medusa/pull/13861) [`c1c0e1490a25693f26852d74c56071d46e88d363`](https://github.com/medusajs/medusa/commit/c1c0e1490a25693f26852d74c56071d46e88d363) Thanks [@radeknapora](https://github.com/radeknapora)! - fix(dashboard) standardize heading levels for consistent hierarchy

- [#13623](https://github.com/medusajs/medusa/pull/13623) [`47572816778e21432d0201f4b2642a765c86fdbc`](https://github.com/medusajs/medusa/commit/47572816778e21432d0201f4b2642a765c86fdbc) Thanks [@fPolic](https://github.com/fPolic)! - feat: scoped variant images

- [#13905](https://github.com/medusajs/medusa/pull/13905) [`d5fc46b22240d73d94d4040189f98da0126773bd`](https://github.com/medusajs/medusa/commit/d5fc46b22240d73d94d4040189f98da0126773bd) Thanks [@fPolic](https://github.com/fPolic)! - feat(dashboard): variant images list thumbnail + refactor form state management

- [#13872](https://github.com/medusajs/medusa/pull/13872) [`47b2f7f888edd006319d78cbfc3f3c5349ab08f7`](https://github.com/medusajs/medusa/commit/47b2f7f888edd006319d78cbfc3f3c5349ab08f7) Thanks [@bqst](https://github.com/bqst)! - 🐛 Fix admin promotion list sort

- [#13851](https://github.com/medusajs/medusa/pull/13851) [`0244f029aae2fc077d51df277aab5b6564f364a6`](https://github.com/medusajs/medusa/commit/0244f029aae2fc077d51df277aab5b6564f364a6) Thanks [@leobenzol](https://github.com/leobenzol)! - feat(dashboard): type-safe i18n for UI extensions

- [#13787](https://github.com/medusajs/medusa/pull/13787) [`2eca81ec0fc572409c36b0ade11c8ccf499469aa`](https://github.com/medusajs/medusa/commit/2eca81ec0fc572409c36b0ade11c8ccf499469aa) Thanks [@kevinresol](https://github.com/kevinresol)! - add input field for tracking_url and label_url in shipment form

- [#13863](https://github.com/medusajs/medusa/pull/13863) [`ef798160ea689ece75f6ae9022faedf301b1306d`](https://github.com/medusajs/medusa/commit/ef798160ea689ece75f6ae9022faedf301b1306d) Thanks [@siddarthan007](https://github.com/siddarthan007)! - Fixed a bug in product attributes form such that it now accepts decimal values

- Updated dependencies [[`47572816778e21432d0201f4b2642a765c86fdbc`](https://github.com/medusajs/medusa/commit/47572816778e21432d0201f4b2642a765c86fdbc)]:
  - @medusajs/js-sdk@2.11.2
  - @medusajs/admin-shared@2.11.2
  - @medusajs/icons@2.11.2
  - @medusajs/ui@4.0.26

## 2.11.1

### Patch Changes

- [#13763](https://github.com/medusajs/medusa/pull/13763) [`226984cf0f229bec00ee33a3a1a981b57889c11a`](https://github.com/medusajs/medusa/commit/226984cf0f229bec00ee33a3a1a981b57889c11a) Thanks [@leobenzol](https://github.com/leobenzol)! - feat(admin-\*,dashboard): add dashboard i18n extensions

- [#13766](https://github.com/medusajs/medusa/pull/13766) [`fe4e7481a9ee6e360623d15ecfaf51f3df00f9d7`](https://github.com/medusajs/medusa/commit/fe4e7481a9ee6e360623d15ecfaf51f3df00f9d7) Thanks [@willbouch](https://github.com/willbouch)! - feat(order,dashboard): version order credit lines

- Updated dependencies [[`226984cf0f229bec00ee33a3a1a981b57889c11a`](https://github.com/medusajs/medusa/commit/226984cf0f229bec00ee33a3a1a981b57889c11a), [`22d23b148e610bd0dd1980620c2ebc85af65be55`](https://github.com/medusajs/medusa/commit/22d23b148e610bd0dd1980620c2ebc85af65be55)]:
  - @medusajs/admin-shared@2.11.1
  - @medusajs/js-sdk@2.11.1
  - @medusajs/icons@2.11.1
  - @medusajs/ui@4.0.25

## 2.11.0

### Patch Changes

- [#13404](https://github.com/medusajs/medusa/pull/13404) [`294c37564ca035dc9b658bdce1f6afb4ced3d916`](https://github.com/medusajs/medusa/commit/294c37564ca035dc9b658bdce1f6afb4ced3d916) Thanks [@fPolic](https://github.com/fPolic)! - fix(dashboard): add campaign without currency to promotion

- [#13596](https://github.com/medusajs/medusa/pull/13596) [`9538df2eaff8a30604291eda8f46b4ea87eb1ca9`](https://github.com/medusajs/medusa/commit/9538df2eaff8a30604291eda8f46b4ea87eb1ca9) Thanks [@bqst](https://github.com/bqst)! - fix(dashboard): copy phone on order customer info

- [#13451](https://github.com/medusajs/medusa/pull/13451) [`7dc3b0c5ffdf8eb7070ee5cfd8155c6c4de5c0b1`](https://github.com/medusajs/medusa/commit/7dc3b0c5ffdf8eb7070ee5cfd8155c6c4de5c0b1) Thanks [@fPolic](https://github.com/fPolic)! - feat: support limiting promotion usage by attribute

- [#13521](https://github.com/medusajs/medusa/pull/13521) [`a1c56d29d0c63521c00e3a54beffd7041023f430`](https://github.com/medusajs/medusa/commit/a1c56d29d0c63521c00e3a54beffd7041023f430) Thanks [@patelaryan0914](https://github.com/patelaryan0914)! - fix(dashboard):replace native select Element in CountrySelect & ProvinceSelect with Select(Medusa UI).

- [#13631](https://github.com/medusajs/medusa/pull/13631) [`d30806533c181be39b97b0321a44390cd31acd3c`](https://github.com/medusajs/medusa/commit/d30806533c181be39b97b0321a44390cd31acd3c) Thanks [@willbouch](https://github.com/willbouch)! - fix(dashboard): create refund form broken when no payment id defined

- [#13756](https://github.com/medusajs/medusa/pull/13756) [`8642d41aaca843d008b44b0fd9f1fecd0be4a7cf`](https://github.com/medusajs/medusa/commit/8642d41aaca843d008b44b0fd9f1fecd0be4a7cf) Thanks [@willbouch](https://github.com/willbouch)! - fix(dashboard): add error message in toaster on product delete

- [#13578](https://github.com/medusajs/medusa/pull/13578) [`6e806942c7961eeb1d80abca0f9b4bf2e663f6b3`](https://github.com/medusajs/medusa/commit/6e806942c7961eeb1d80abca0f9b4bf2e663f6b3) Thanks [@fPolic](https://github.com/fPolic)! - fix(dashboard, order): set return status on cancel

- [#13592](https://github.com/medusajs/medusa/pull/13592) [`c3ae529b40368eddb3265de9cf4a6f54e15d16d7`](https://github.com/medusajs/medusa/commit/c3ae529b40368eddb3265de9cf4a6f54e15d16d7) Thanks [@fPolic](https://github.com/fPolic)! - fix(dashboard): payment providers select

- [#13575](https://github.com/medusajs/medusa/pull/13575) [`5e827ec95d0f721e62c0d4e8c603bda7ddc0929c`](https://github.com/medusajs/medusa/commit/5e827ec95d0f721e62c0d4e8c603bda7ddc0929c) Thanks [@willbouch](https://github.com/willbouch)! - feat(admin-shared,dashboard,js-sdk,types,payment): refund reasons in dashboard

- [#13699](https://github.com/medusajs/medusa/pull/13699) [`e9b7a8c1f3c6f3d6d4447d8f57f15d20dedf0d28`](https://github.com/medusajs/medusa/commit/e9b7a8c1f3c6f3d6d4447d8f57f15d20dedf0d28) Thanks [@willbouch](https://github.com/willbouch)! - fix(dashboard): nan in tax total

- [#13740](https://github.com/medusajs/medusa/pull/13740) [`723dc082f00d20eda7cb7d0fa01085509b4f5c47`](https://github.com/medusajs/medusa/commit/723dc082f00d20eda7cb7d0fa01085509b4f5c47) Thanks [@fPolic](https://github.com/fPolic)! - fix(dashboard): budget labels and remove promo code

- [#13566](https://github.com/medusajs/medusa/pull/13566) [`459fbcdf998a506d80abb758bc7648126c6c96f8`](https://github.com/medusajs/medusa/commit/459fbcdf998a506d80abb758bc7648126c6c96f8) Thanks [@docloulou](https://github.com/docloulou)! - feat(medusa,dashboard): Add support for configurable additional columns in entity views

- [#11252](https://github.com/medusajs/medusa/pull/11252) [`a75cf7fb36cf1858c6c9bda1126b092e923beff6`](https://github.com/medusajs/medusa/commit/a75cf7fb36cf1858c6c9bda1126b092e923beff6) Thanks [@MEClouds](https://github.com/MEClouds)! - feat(dashboard): support RTL in dashboard

- [#13565](https://github.com/medusajs/medusa/pull/13565) [`55f89b2151cbdd506f91be5e08451c954caaf1fc`](https://github.com/medusajs/medusa/commit/55f89b2151cbdd506f91be5e08451c954caaf1fc) Thanks [@docloulou](https://github.com/docloulou)! - fix(dashboard): add offset and limit to query parameters in useTableConfiguration

- [#13589](https://github.com/medusajs/medusa/pull/13589) [`7af9e3224cab141bf8c8283032cb508122a0f740`](https://github.com/medusajs/medusa/commit/7af9e3224cab141bf8c8283032cb508122a0f740) Thanks [@fPolic](https://github.com/fPolic)! - fix(dashboard): improve inventory level location management

- [#13723](https://github.com/medusajs/medusa/pull/13723) [`c6896ffa6a1bc5c0ee8c4eea55feebea3497e47d`](https://github.com/medusajs/medusa/commit/c6896ffa6a1bc5c0ee8c4eea55feebea3497e47d) Thanks [@fPolic](https://github.com/fPolic)! - fix(dashboard): campaign UI improvements

- [#13587](https://github.com/medusajs/medusa/pull/13587) [`edf29b3bd22de1a0f6a7e4eb8715641cd17b7956`](https://github.com/medusajs/medusa/commit/edf29b3bd22de1a0f6a7e4eb8715641cd17b7956) Thanks [@willbouch](https://github.com/willbouch)! - feat(dashboard): select refund reason in refund form

- [#13711](https://github.com/medusajs/medusa/pull/13711) [`82f3b0413a0a56d09d5aefdabc1ae8f3adb7c82b`](https://github.com/medusajs/medusa/commit/82f3b0413a0a56d09d5aefdabc1ae8f3adb7c82b) Thanks [@willbouch](https://github.com/willbouch)! - fix(dashboard): export with filters not working

- [#13571](https://github.com/medusajs/medusa/pull/13571) [`10787c865f04f231cd3d5b9709c417b1fd2e2130`](https://github.com/medusajs/medusa/commit/10787c865f04f231cd3d5b9709c417b1fd2e2130) Thanks [@fPolic](https://github.com/fPolic)! - feat(dashboard): refactor location list UI to use data table

- Updated dependencies [[`7dc3b0c5ffdf8eb7070ee5cfd8155c6c4de5c0b1`](https://github.com/medusajs/medusa/commit/7dc3b0c5ffdf8eb7070ee5cfd8155c6c4de5c0b1), [`6a91f79f443ff72cba8ee7612a1e1c681af125ec`](https://github.com/medusajs/medusa/commit/6a91f79f443ff72cba8ee7612a1e1c681af125ec), [`76bf364440959b00926719db1c8a0e4a0e418879`](https://github.com/medusajs/medusa/commit/76bf364440959b00926719db1c8a0e4a0e418879), [`5e827ec95d0f721e62c0d4e8c603bda7ddc0929c`](https://github.com/medusajs/medusa/commit/5e827ec95d0f721e62c0d4e8c603bda7ddc0929c)]:
  - @medusajs/js-sdk@2.11.0
  - @medusajs/admin-shared@2.11.0
  - @medusajs/icons@2.11.0
  - @medusajs/ui@4.0.24

## 2.10.3

### Patch Changes

- [#11613](https://github.com/medusajs/medusa/pull/11613) [`5e5f628d87a78962978fe105f4c5ef41b1b4f57c`](https://github.com/medusajs/medusa/commit/5e5f628d87a78962978fe105f4c5ef41b1b4f57c) Thanks [@docloulou](https://github.com/docloulou)! - feat(dashboard): update display of tracking/label URLs on order details

- [#13214](https://github.com/medusajs/medusa/pull/13214) [`dcca42ec5105dfc0ca9075bbbfbe14a786ca4955`](https://github.com/medusajs/medusa/commit/dcca42ec5105dfc0ca9075bbbfbe14a786ca4955) Thanks [@tehaulp](https://github.com/tehaulp)! - fix(dashboard): added missing currencies

- Updated dependencies [[`25634b038248ab6501af719faec79b59b496bada`](https://github.com/medusajs/medusa/commit/25634b038248ab6501af719faec79b59b496bada), [`1b30b656b3f9592adaf6288021896ea79ca95df0`](https://github.com/medusajs/medusa/commit/1b30b656b3f9592adaf6288021896ea79ca95df0)]:
  - @medusajs/js-sdk@2.10.3
  - @medusajs/admin-shared@2.10.3
  - @medusajs/icons@2.10.3
  - @medusajs/ui@4.0.23

## 2.10.2

### Patch Changes

- [#13373](https://github.com/medusajs/medusa/pull/13373) [`753e8081c49ba88ff4b0afa91f48bff2e0109b9c`](https://github.com/medusajs/medusa/commit/753e8081c49ba88ff4b0afa91f48bff2e0109b9c) Thanks [@pepijn-vanvlaanderen](https://github.com/pepijn-vanvlaanderen)! - Fix promotion expired status check when limit is null

- [#11944](https://github.com/medusajs/medusa/pull/11944) [`ccff121691a454e2e2906c3964dc7b12ec6d221e`](https://github.com/medusajs/medusa/commit/ccff121691a454e2e2906c3964dc7b12ec6d221e) Thanks [@SteelRazor47](https://github.com/SteelRazor47)! - fix(dashboard): disable broken autofocus in SO cond. price form

- [#13075](https://github.com/medusajs/medusa/pull/13075) [`963a613d1d1c7e15cec21e47ab6932ccd4b0b008`](https://github.com/medusajs/medusa/commit/963a613d1d1c7e15cec21e47ab6932ccd4b0b008) Thanks [@lemonteeea](https://github.com/lemonteeea)! - fix(dashboard): fix pagination when adding products to price list

- [#13423](https://github.com/medusajs/medusa/pull/13423) [`ecf368e2bd9cfff4ecf9f98e78a7827b026e53a5`](https://github.com/medusajs/medusa/commit/ecf368e2bd9cfff4ecf9f98e78a7827b026e53a5) Thanks [@fPolic](https://github.com/fPolic)! - fix(dashboard): edit rules clear and reset

- [#13407](https://github.com/medusajs/medusa/pull/13407) [`9b3831d2587bd03346dad3900528268f4e71eeec`](https://github.com/medusajs/medusa/commit/9b3831d2587bd03346dad3900528268f4e71eeec) Thanks [@willbouch](https://github.com/willbouch)! - fix(dashboard): support more decimals for tx rates

- [#13081](https://github.com/medusajs/medusa/pull/13081) [`75e85414cc0c37879191379ec3f8cb87d55ca349`](https://github.com/medusajs/medusa/commit/75e85414cc0c37879191379ec3f8cb87d55ca349) Thanks [@rbxorkt12](https://github.com/rbxorkt12)! - feat(dashboard): improve Korean transl and add missing keys

- [#13371](https://github.com/medusajs/medusa/pull/13371) [`b7fef5b7ef3bec53d9ea4d836f5f97da541816cc`](https://github.com/medusajs/medusa/commit/b7fef5b7ef3bec53d9ea4d836f5f97da541816cc) Thanks [@fPolic](https://github.com/fPolic)! - fix(dashboard): promotion decimal value definition

- [#13324](https://github.com/medusajs/medusa/pull/13324) [`f53f027ce68b0518968482dccafeadd68cc55433`](https://github.com/medusajs/medusa/commit/f53f027ce68b0518968482dccafeadd68cc55433) Thanks [@fPolic](https://github.com/fPolic)! - fix(dashboard): rules form operator change

- [#13414](https://github.com/medusajs/medusa/pull/13414) [`e67974ffe55b12cc9c80410f69741a57a9b68a3f`](https://github.com/medusajs/medusa/commit/e67974ffe55b12cc9c80410f69741a57a9b68a3f) Thanks [@fPolic](https://github.com/fPolic)! - fix(dashboard): customer `has_acccount` flag

- [#13313](https://github.com/medusajs/medusa/pull/13313) [`2f6edf367abb9d3e71f398c3b98a749b73517ea6`](https://github.com/medusajs/medusa/commit/2f6edf367abb9d3e71f398c3b98a749b73517ea6) Thanks [@willbouch](https://github.com/willbouch)! - feat(dashboard,cart,types,utils): refine order details summary

- [#13426](https://github.com/medusajs/medusa/pull/13426) [`88170a62398917dfa63c5de541066bb51262c3ff`](https://github.com/medusajs/medusa/commit/88170a62398917dfa63c5de541066bb51262c3ff) Thanks [@galdoway](https://github.com/galdoway)! - fix(dashboard): add missing translations to spanish file

- [#13445](https://github.com/medusajs/medusa/pull/13445) [`cda659ab170688af7476dd351233aecf74bf3231`](https://github.com/medusajs/medusa/commit/cda659ab170688af7476dd351233aecf74bf3231) Thanks [@radeknapora](https://github.com/radeknapora)! - fix(dashboard): update and add missing Polish translations

- [#13482](https://github.com/medusajs/medusa/pull/13482) [`b8b9b3ac74e3a60b4775112aa30ac6249f44f64c`](https://github.com/medusajs/medusa/commit/b8b9b3ac74e3a60b4775112aa30ac6249f44f64c) Thanks [@appinteractive](https://github.com/appinteractive)! - fix(dashboard): german translation issues

- [#13178](https://github.com/medusajs/medusa/pull/13178) [`1b681a79da02aec3f872baa2213a4b2423d73e97`](https://github.com/medusajs/medusa/commit/1b681a79da02aec3f872baa2213a4b2423d73e97) Thanks [@Amirkhon](https://github.com/Amirkhon)! - feat(dashboard,currency): added Tajikistani somoni currency

- Updated dependencies []:
  - @medusajs/js-sdk@2.10.2
  - @medusajs/admin-shared@2.10.2
  - @medusajs/icons@2.10.2
  - @medusajs/ui@4.0.22

## 2.10.1

### Patch Changes

- Updated dependencies []:
  - @medusajs/admin-shared@2.10.1
  - @medusajs/js-sdk@2.10.1
  - @medusajs/icons@2.10.1
  - @medusajs/ui@4.0.21

## 2.10.0

### Patch Changes

- [#13267](https://github.com/medusajs/medusa/pull/13267) [`319a941d998b7a245507710568269261ee9c4950`](https://github.com/medusajs/medusa/commit/319a941d998b7a245507710568269261ee9c4950) Thanks [@fPolic](https://github.com/fPolic)! - fix(dashboard): zero in float currency inputs

- [#13219](https://github.com/medusajs/medusa/pull/13219) [`e7b45f5fde288431a916f5cd55b70b40ca74f740`](https://github.com/medusajs/medusa/commit/e7b45f5fde288431a916f5cd55b70b40ca74f740) Thanks [@larsdecker](https://github.com/larsdecker)! - Improved the German Admin Translations

- [#13263](https://github.com/medusajs/medusa/pull/13263) [`486621383a79e83c831933c1a0ffdae58a695cb0`](https://github.com/medusajs/medusa/commit/486621383a79e83c831933c1a0ffdae58a695cb0) Thanks [@willbouch](https://github.com/willbouch)! - feat(dashboard,core-flows,js-sdk,link-modules,promotion): free shipping promotion in dashboard

- [#12572](https://github.com/medusajs/medusa/pull/12572) [`2f594291ad8d227b499b80a5bfe66f5963d42d6a`](https://github.com/medusajs/medusa/commit/2f594291ad8d227b499b80a5bfe66f5963d42d6a) Thanks [@fPolic](https://github.com/fPolic)! - fix(core-flows, dashboard, types): improve allocation flows in Admin

- [#13266](https://github.com/medusajs/medusa/pull/13266) [`36c20ed1888d11d959a5107880df41cb120c7b73`](https://github.com/medusajs/medusa/commit/36c20ed1888d11d959a5107880df41cb120c7b73) Thanks [@gladius882](https://github.com/gladius882)! - add missing polish translations

- [#13269](https://github.com/medusajs/medusa/pull/13269) [`2d62e289131363f96668a7aaffee54b8c8114e53`](https://github.com/medusajs/medusa/commit/2d62e289131363f96668a7aaffee54b8c8114e53) Thanks [@fPolic](https://github.com/fPolic)! - fix(dashboard): show fulfilment option on SO edit

- [#13226](https://github.com/medusajs/medusa/pull/13226) [`67d3660abf3ceeac3f04006fe5e92d2fa7c0ccad`](https://github.com/medusajs/medusa/commit/67d3660abf3ceeac3f04006fe5e92d2fa7c0ccad) Thanks [@willbouch](https://github.com/willbouch)! - feat(dashboard, core-flows): associate shipping option to type

- [#13260](https://github.com/medusajs/medusa/pull/13260) [`9b38b750def5c5cb7a83850c95435bffaae48b2a`](https://github.com/medusajs/medusa/commit/9b38b750def5c5cb7a83850c95435bffaae48b2a) Thanks [@fPolic](https://github.com/fPolic)! - feat(dashboard): shipping option tax rate overrides UI

- [#13297](https://github.com/medusajs/medusa/pull/13297) [`87a61baf8fec17929002cc78bb8b4becc7dfd20d`](https://github.com/medusajs/medusa/commit/87a61baf8fec17929002cc78bb8b4becc7dfd20d) Thanks [@fPolic](https://github.com/fPolic)! - fix(dashboard): handle large resource count in tax rule override edit form

- [#13323](https://github.com/medusajs/medusa/pull/13323) [`65dfcf9be4a4cc5ffac1794879fc1bc51956d296`](https://github.com/medusajs/medusa/commit/65dfcf9be4a4cc5ffac1794879fc1bc51956d296) Thanks [@willbouch](https://github.com/willbouch)! - chore(dashboard): move shipping option type page

- [#13111](https://github.com/medusajs/medusa/pull/13111) [`c6b836bb03e0824ada0bce214d3ae0c99396a87d`](https://github.com/medusajs/medusa/commit/c6b836bb03e0824ada0bce214d3ae0c99396a87d) Thanks [@fPolic](https://github.com/fPolic)! - fix(dashboard): create product selected inventory item display

- [#13272](https://github.com/medusajs/medusa/pull/13272) [`7f5b9fc5fa47e8e73c7afe54aa1bde4dd035086e`](https://github.com/medusajs/medusa/commit/7f5b9fc5fa47e8e73c7afe54aa1bde4dd035086e) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(medusa,dashboard): Retrieve `metadata` for product_tags by default and add metadta UI to product tag domain in admin dashboard

- [#13208](https://github.com/medusajs/medusa/pull/13208) [`4b3c43fe92d99a98b3d7b9ee6705114de01cbc5d`](https://github.com/medusajs/medusa/commit/4b3c43fe92d99a98b3d7b9ee6705114de01cbc5d) Thanks [@willbouch](https://github.com/willbouch)! - feat(dashboard, js-sdk): shipping option type mngmt dashboard

- [#13242](https://github.com/medusajs/medusa/pull/13242) [`492e0189573ffad4977a3559d71f39bf94d8b45d`](https://github.com/medusajs/medusa/commit/492e0189573ffad4977a3559d71f39bf94d8b45d) Thanks [@fPolic](https://github.com/fPolic)! - feat(dashboard,core-flows,js-sdk,types,medusa): listing order's shipping option

- [#13053](https://github.com/medusajs/medusa/pull/13053) [`20b8187e2ac2886cc3e9e66a6b68ad12106219a3`](https://github.com/medusajs/medusa/commit/20b8187e2ac2886cc3e9e66a6b68ad12106219a3) Thanks [@fPolic](https://github.com/fPolic)! - fix(dashboard): include end of the range date in filter results

- [#12624](https://github.com/medusajs/medusa/pull/12624) [`6d8e4acdc794878755fdc411ac9cb5c05fbac06b`](https://github.com/medusajs/medusa/commit/6d8e4acdc794878755fdc411ac9cb5c05fbac06b) Thanks [@fPolic](https://github.com/fPolic)! - chore(dashboard): migrate inventory location levels table

- Updated dependencies [[`486621383a79e83c831933c1a0ffdae58a695cb0`](https://github.com/medusajs/medusa/commit/486621383a79e83c831933c1a0ffdae58a695cb0), [`4b3c43fe92d99a98b3d7b9ee6705114de01cbc5d`](https://github.com/medusajs/medusa/commit/4b3c43fe92d99a98b3d7b9ee6705114de01cbc5d), [`492e0189573ffad4977a3559d71f39bf94d8b45d`](https://github.com/medusajs/medusa/commit/492e0189573ffad4977a3559d71f39bf94d8b45d), [`5b7a0412463ebab1dbc86c29024c1fd326ac47fc`](https://github.com/medusajs/medusa/commit/5b7a0412463ebab1dbc86c29024c1fd326ac47fc)]:
  - @medusajs/js-sdk@2.10.0
  - @medusajs/admin-shared@2.10.0
  - @medusajs/ui@4.0.20
  - @medusajs/icons@2.10.0

## 2.9.0

### Patch Changes

- [#13150](https://github.com/medusajs/medusa/pull/13150) [`b7083b9f0f21d0b6d9f3f3afd65b7ae0f8d378dc`](https://github.com/medusajs/medusa/commit/b7083b9f0f21d0b6d9f3f3afd65b7ae0f8d378dc) Thanks [@willbouch](https://github.com/willbouch)! - fix(dashboard): variants disappearing when removing an option on product creation

- [#11982](https://github.com/medusajs/medusa/pull/11982) [`4da237f615b8cf1dac7935f2faeb97f2c145c62f`](https://github.com/medusajs/medusa/commit/4da237f615b8cf1dac7935f2faeb97f2c145c62f) Thanks [@SteelRazor47](https://github.com/SteelRazor47)! - fix(dashboard): correct overflow in a few settings edit forms

- [#13094](https://github.com/medusajs/medusa/pull/13094) [`0452eba20b44be5a25eb371541172f39f29194b4`](https://github.com/medusajs/medusa/commit/0452eba20b44be5a25eb371541172f39f29194b4) Thanks [@fPolic](https://github.com/fPolic)! - chore(dashboard): add missing US state

- Updated dependencies []:
  - @medusajs/js-sdk@2.9.0
  - @medusajs/admin-shared@2.9.0
  - @medusajs/icons@2.9.0
  - @medusajs/ui@4.0.19

## 2.8.8

### Patch Changes

- [#12989](https://github.com/medusajs/medusa/pull/12989) [`3fa1db9dea27d99d7b5796281f118210f35a2880`](https://github.com/medusajs/medusa/commit/3fa1db9dea27d99d7b5796281f118210f35a2880) Thanks [@fPolic](https://github.com/fPolic)! - fix(dashboard): allocation UI for orders with more than 20 reservation items

- [#13019](https://github.com/medusajs/medusa/pull/13019) [`439c7118450c5f9ee0b541de9014093a42b7d0ea`](https://github.com/medusajs/medusa/commit/439c7118450c5f9ee0b541de9014093a42b7d0ea) Thanks [@fPolic](https://github.com/fPolic)! - fix(dashboard, product): update product attributes

- [#12939](https://github.com/medusajs/medusa/pull/12939) [`491b08e0448e3e7d69c09b9516c39f50e2f691a0`](https://github.com/medusajs/medusa/commit/491b08e0448e3e7d69c09b9516c39f50e2f691a0) Thanks [@fPolic](https://github.com/fPolic)! - fix(dashboard): clearing multiitem combobox

- Updated dependencies [[`0db5bf6f8cfb47c67435f92733879e990b500d83`](https://github.com/medusajs/medusa/commit/0db5bf6f8cfb47c67435f92733879e990b500d83)]:
  - @medusajs/js-sdk@2.8.8
  - @medusajs/admin-shared@2.8.8
  - @medusajs/icons@2.8.8
  - @medusajs/ui@4.0.18

## 2.8.7

### Patch Changes

- [#12897](https://github.com/medusajs/medusa/pull/12897) [`1438b394aea8b570fa6703543faaea506ef816b0`](https://github.com/medusajs/medusa/commit/1438b394aea8b570fa6703543faaea506ef816b0) Thanks [@fPolic](https://github.com/fPolic)! - fix(dashboard): show TIP flag only for fixed promotions

- [#12885](https://github.com/medusajs/medusa/pull/12885) [`42be9a88d61a11db7aebde2d6f4d96d43f54ea79`](https://github.com/medusajs/medusa/commit/42be9a88d61a11db7aebde2d6f4d96d43f54ea79) Thanks [@olivermrbl](https://github.com/olivermrbl)! - fix: Update TIP on promotions

- Updated dependencies []:
  - @medusajs/js-sdk@2.8.7
  - @medusajs/admin-shared@2.8.7
  - @medusajs/icons@2.8.7
  - @medusajs/ui@4.0.17

## 2.8.6

### Patch Changes

- Updated dependencies [[`4b224d5effda952d7d87b96dd30407178edf4115`](https://github.com/medusajs/medusa/commit/4b224d5effda952d7d87b96dd30407178edf4115)]:
  - @medusajs/ui@4.0.16
  - @medusajs/admin-shared@2.8.6
  - @medusajs/js-sdk@2.8.6
  - @medusajs/icons@2.8.6

## 2.8.5

### Patch Changes

- [#12643](https://github.com/medusajs/medusa/pull/12643) [`f2cb528a5650fe112ca8eeb4bdffc5f0b217338a`](https://github.com/medusajs/medusa/commit/f2cb528a5650fe112ca8eeb4bdffc5f0b217338a) Thanks [@thetutlage](https://github.com/thetutlage)! - feat: wire up direct uploads with local file provider

- [#12697](https://github.com/medusajs/medusa/pull/12697) [`ce202968c6f5f1a54238defcd3dbcba6025c32db`](https://github.com/medusajs/medusa/commit/ce202968c6f5f1a54238defcd3dbcba6025c32db) Thanks [@thetutlage](https://github.com/thetutlage)! - fix: update product import template

- [#11885](https://github.com/medusajs/medusa/pull/11885) [`44d1d186890cd44b20e41b60d1e217bc3d4b2a51`](https://github.com/medusajs/medusa/commit/44d1d186890cd44b20e41b60d1e217bc3d4b2a51) Thanks [@riqwan](https://github.com/riqwan)! - feat(dashboard,types): add credit lines + loyalty changes

- [#12412](https://github.com/medusajs/medusa/pull/12412) [`2621f00bb035a6b909f9498a2bc98fdba8570ba9`](https://github.com/medusajs/medusa/commit/2621f00bb035a6b909f9498a2bc98fdba8570ba9) Thanks [@fPolic](https://github.com/fPolic)! - feat(promotion, dashboard, core-flows, cart, types, utils, medusa): tax inclusive promotions

- Updated dependencies [[`f2cb528a5650fe112ca8eeb4bdffc5f0b217338a`](https://github.com/medusajs/medusa/commit/f2cb528a5650fe112ca8eeb4bdffc5f0b217338a)]:
  - @medusajs/js-sdk@2.8.5
  - @medusajs/admin-shared@2.8.5
  - @medusajs/icons@2.8.5
  - @medusajs/ui@4.0.15

## 2.8.4

### Patch Changes

- [#12522](https://github.com/medusajs/medusa/pull/12522) [`341a8bb7eeac18460b0e466bda1f4b148e566495`](https://github.com/medusajs/medusa/commit/341a8bb7eeac18460b0e466bda1f4b148e566495) Thanks [@fPolic](https://github.com/fPolic)! - fix(dashboard): combobox initial item cache

- Updated dependencies []:
  - @medusajs/js-sdk@2.8.4
  - @medusajs/admin-shared@2.8.4
  - @medusajs/icons@2.8.4
  - @medusajs/ui@4.0.14

## 2.8.3

### Patch Changes

- [#12476](https://github.com/medusajs/medusa/pull/12476) [`b8ab053252f7c8f854b4b549b74c2cf0521bd8d5`](https://github.com/medusajs/medusa/commit/b8ab053252f7c8f854b4b549b74c2cf0521bd8d5) Thanks [@fPolic](https://github.com/fPolic)! - fix(dashboard): refund payment formatting

- Updated dependencies [[`9f376ff1f122c0f70559cf4f57813b9f2b608f3e`](https://github.com/medusajs/medusa/commit/9f376ff1f122c0f70559cf4f57813b9f2b608f3e), [`fca5ad77b41856867ec68b1e46d04f1bb71cbc76`](https://github.com/medusajs/medusa/commit/fca5ad77b41856867ec68b1e46d04f1bb71cbc76)]:
  - @medusajs/js-sdk@2.8.3
  - @medusajs/admin-shared@2.8.3
  - @medusajs/icons@2.8.3
  - @medusajs/ui@4.0.13

## 2.8.2

### Patch Changes

- Updated dependencies []:
  - @medusajs/js-sdk@2.8.2
  - @medusajs/admin-shared@2.8.2
  - @medusajs/icons@2.8.2
  - @medusajs/ui@4.0.12

## 2.8.1

### Patch Changes

- Updated dependencies []:
  - @medusajs/admin-shared@2.8.1
  - @medusajs/js-sdk@2.8.1
  - @medusajs/icons@2.8.1
  - @medusajs/ui@4.0.11

## 2.8.0

### Patch Changes

- [#12297](https://github.com/medusajs/medusa/pull/12297) [`9cedeb182dc19d6127b602fc06e4b8850490e2a9`](https://github.com/medusajs/medusa/commit/9cedeb182dc19d6127b602fc06e4b8850490e2a9) Thanks [@fPolic](https://github.com/fPolic)! - feat(dashboard, js-sdk, medusa, tax, types): custom tax providers

- [#12371](https://github.com/medusajs/medusa/pull/12371) [`6aa1ebdee24fd3e2762317f31db4e4adcaba7566`](https://github.com/medusajs/medusa/commit/6aa1ebdee24fd3e2762317f31db4e4adcaba7566) Thanks [@fPolic](https://github.com/fPolic)! - fix(dashboard): inventory kit combobox state

- [#12383](https://github.com/medusajs/medusa/pull/12383) [`3fb4d5beb05510fc3727199f0387fae5c8642520`](https://github.com/medusajs/medusa/commit/3fb4d5beb05510fc3727199f0387fae5c8642520) Thanks [@fPolic](https://github.com/fPolic)! - fix(dashboard): call route modal onClose only on route change

- [#12450](https://github.com/medusajs/medusa/pull/12450) [`32e0194772cd44efa1930f2ee99f147fa2976f1f`](https://github.com/medusajs/medusa/commit/32e0194772cd44efa1930f2ee99f147fa2976f1f) Thanks [@fPolic](https://github.com/fPolic)! - fix(dashboard, medusa): validate provider exists when creating a top level tax region

- [#12346](https://github.com/medusajs/medusa/pull/12346) [`cdb135e491b44c7573e7c568565366517576b90a`](https://github.com/medusajs/medusa/commit/cdb135e491b44c7573e7c568565366517576b90a) Thanks [@pepijn-vanvlaanderen](https://github.com/pepijn-vanvlaanderen)! - Added missing dependencies

- [#12447](https://github.com/medusajs/medusa/pull/12447) [`39e5eadefcf123c364240c665e8b455d1a8c38c0`](https://github.com/medusajs/medusa/commit/39e5eadefcf123c364240c665e8b455d1a8c38c0) Thanks [@fPolic](https://github.com/fPolic)! - fix(dashboard, core-flows): allocation button condition and reservation recreation on fulfilment cancel

- [#11877](https://github.com/medusajs/medusa/pull/11877) [`353906614625ce8cc15c7d60537db697a69e160d`](https://github.com/medusajs/medusa/commit/353906614625ce8cc15c7d60537db697a69e160d) Thanks [@AmbroziuBaban](https://github.com/AmbroziuBaban)! - fix(dashboard): Admin Global Search broken for variants

- Updated dependencies [[`9cedeb182dc19d6127b602fc06e4b8850490e2a9`](https://github.com/medusajs/medusa/commit/9cedeb182dc19d6127b602fc06e4b8850490e2a9), [`4f6362b1cb1b84f01cc4cd277981aae7ae5797c9`](https://github.com/medusajs/medusa/commit/4f6362b1cb1b84f01cc4cd277981aae7ae5797c9)]:
  - @medusajs/js-sdk@2.8.0
  - @medusajs/ui@4.0.10
  - @medusajs/admin-shared@2.8.0
  - @medusajs/icons@2.8.0

## 2.7.1

### Patch Changes

- [#12198](https://github.com/medusajs/medusa/pull/12198) [`f6b20a943e14ad6689cc1e118ae08ebc49fde603`](https://github.com/medusajs/medusa/commit/f6b20a943e14ad6689cc1e118ae08ebc49fde603) Thanks [@fPolic](https://github.com/fPolic)! - fix(dashboard): properly register settings custom routes

- Updated dependencies [[`01542f69737b48346d924670296c551e4c4b47ec`](https://github.com/medusajs/medusa/commit/01542f69737b48346d924670296c551e4c4b47ec)]:
  - @medusajs/js-sdk@2.7.1
  - @medusajs/admin-shared@2.7.1
  - @medusajs/icons@2.7.1
  - @medusajs/ui@4.0.9

## 2.7.0

### Patch Changes

- [#12073](https://github.com/medusajs/medusa/pull/12073) [`f01e0868bd669b0203bd0f3db3bb908062b1f2d1`](https://github.com/medusajs/medusa/commit/f01e0868bd669b0203bd0f3db3bb908062b1f2d1) Thanks [@fPolic](https://github.com/fPolic)! - fix(dashboard): product create discountable flag

- [#11720](https://github.com/medusajs/medusa/pull/11720) [`ec56a8bc857a74788df6523af25914da95c4c1d8`](https://github.com/medusajs/medusa/commit/ec56a8bc857a74788df6523af25914da95c4c1d8) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(medusa,utils,test-utils,types,framework,dashboard,admin-vite-plugin,admib-bundler): Fix broken plugin dependencies in development server

- [#11871](https://github.com/medusajs/medusa/pull/11871) [`5ab15a29889870411b719ebad3fb94786baee45e`](https://github.com/medusajs/medusa/commit/5ab15a29889870411b719ebad3fb94786baee45e) Thanks [@riqwan](https://github.com/riqwan)! - feat(dashboard,js-sdk,admin-shared): add customer addresses + layout change

- [#11734](https://github.com/medusajs/medusa/pull/11734) [`cc4c5c86e227a6693d53ea6b5b9e62d0a7c57fa2`](https://github.com/medusajs/medusa/commit/cc4c5c86e227a6693d53ea6b5b9e62d0a7c57fa2) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - chore(ui-preset,icons,dashboard): Sync with Figma, and update ArrowRight import

- [#12004](https://github.com/medusajs/medusa/pull/12004) [`3145c5f20de69e42c7cefb981b12ba9814dddae3`](https://github.com/medusajs/medusa/commit/3145c5f20de69e42c7cefb981b12ba9814dddae3) Thanks [@fPolic](https://github.com/fPolic)! - fix(dashboard): product create trim inputs

- [#12028](https://github.com/medusajs/medusa/pull/12028) [`3dba58785fb2d8e79f1ea89daa9e4ab8810821c8`](https://github.com/medusajs/medusa/commit/3dba58785fb2d8e79f1ea89daa9e4ab8810821c8) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(dashboard,medusa,types): allow searching for promotion rule options

- [#12149](https://github.com/medusajs/medusa/pull/12149) [`95a8c7b57ed751eaf858b6235431781ed0229f28`](https://github.com/medusajs/medusa/commit/95a8c7b57ed751eaf858b6235431781ed0229f28) Thanks [@fPolic](https://github.com/fPolic)! - fix(dashboard): product type metadata form

- [#12007](https://github.com/medusajs/medusa/pull/12007) [`29f6c2a8ddd802398e9ac2d090581832af7603a7`](https://github.com/medusajs/medusa/commit/29f6c2a8ddd802398e9ac2d090581832af7603a7) Thanks [@fPolic](https://github.com/fPolic)! - fix(dashboard): display pending difference in the create return form

- [#12030](https://github.com/medusajs/medusa/pull/12030) [`6d8390a529e784aaae886006af0b5d364c2d2aba`](https://github.com/medusajs/medusa/commit/6d8390a529e784aaae886006af0b5d364c2d2aba) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(dashboard): Allow empty subpaths for extension routes

- [#11955](https://github.com/medusajs/medusa/pull/11955) [`d53af655f02b7b8429359fd360e8740db773643d`](https://github.com/medusajs/medusa/commit/d53af655f02b7b8429359fd360e8740db773643d) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(dashboard): Reduce the size of the Notifcations trigger

- [#11825](https://github.com/medusajs/medusa/pull/11825) [`3063d6e6019d442d7bdc7a0d662fa00c232eb627`](https://github.com/medusajs/medusa/commit/3063d6e6019d442d7bdc7a0d662fa00c232eb627) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(dashboard): Include thumbnail in default product query

- [#11958](https://github.com/medusajs/medusa/pull/11958) [`a8513019db08d1345e79a15aea7f11389b4918d4`](https://github.com/medusajs/medusa/commit/a8513019db08d1345e79a15aea7f11389b4918d4) Thanks [@fPolic](https://github.com/fPolic)! - fix(core-flows,dashboard): handle PaymentCollection managemenet on OrderEdit when there is authorized amount

- [#12021](https://github.com/medusajs/medusa/pull/12021) [`350b6b9a71fc72ffd8a0a1beed685548c1a7cefa`](https://github.com/medusajs/medusa/commit/350b6b9a71fc72ffd8a0a1beed685548c1a7cefa) Thanks [@fPolic](https://github.com/fPolic)! - fix(dashboard): RMA allow shipping unset

- [#11871](https://github.com/medusajs/medusa/pull/11871) [`5ab15a29889870411b719ebad3fb94786baee45e`](https://github.com/medusajs/medusa/commit/5ab15a29889870411b719ebad3fb94786baee45e) Thanks [@riqwan](https://github.com/riqwan)! - feat(dashboard,js-sdk,admin-shared): add customer addresses + layout change

- Updated dependencies [[`c6f2f444ed0118b17ea970942d0256fe3bd4043a`](https://github.com/medusajs/medusa/commit/c6f2f444ed0118b17ea970942d0256fe3bd4043a), [`5ab15a29889870411b719ebad3fb94786baee45e`](https://github.com/medusajs/medusa/commit/5ab15a29889870411b719ebad3fb94786baee45e), [`cc4c5c86e227a6693d53ea6b5b9e62d0a7c57fa2`](https://github.com/medusajs/medusa/commit/cc4c5c86e227a6693d53ea6b5b9e62d0a7c57fa2), [`c3440e5e3812e3d1c6b82e9d4e41287398451611`](https://github.com/medusajs/medusa/commit/c3440e5e3812e3d1c6b82e9d4e41287398451611), [`0cc306bf562d8f1f1f1c09d9658463e2c8def465`](https://github.com/medusajs/medusa/commit/0cc306bf562d8f1f1f1c09d9658463e2c8def465), [`053326950d1e67bff1e39514527de3c6db33225b`](https://github.com/medusajs/medusa/commit/053326950d1e67bff1e39514527de3c6db33225b), [`c40fb01d9200283c5d69f3295e65fccc56a9a76f`](https://github.com/medusajs/medusa/commit/c40fb01d9200283c5d69f3295e65fccc56a9a76f), [`5ab15a29889870411b719ebad3fb94786baee45e`](https://github.com/medusajs/medusa/commit/5ab15a29889870411b719ebad3fb94786baee45e)]:
  - @medusajs/js-sdk@2.7.0
  - @medusajs/admin-shared@2.7.0
  - @medusajs/icons@2.7.0
  - @medusajs/ui@4.0.8

## 2.6.1

### Patch Changes

- [#11731](https://github.com/medusajs/medusa/pull/11731) [`4c28efaadc01fd0782721924c3c2eff0f6f9ba7a`](https://github.com/medusajs/medusa/commit/4c28efaadc01fd0782721924c3c2eff0f6f9ba7a) Thanks [@fPolic](https://github.com/fPolic)! - fix(dashboard): correctly format date cell time

- [#11738](https://github.com/medusajs/medusa/pull/11738) [`3b470f41427e487c68f89b8ee8155de716ffe861`](https://github.com/medusajs/medusa/commit/3b470f41427e487c68f89b8ee8155de716ffe861) Thanks [@olivermrbl](https://github.com/olivermrbl)! - chore: Remove ranges on Medusa packages

- Updated dependencies [[`3b470f41427e487c68f89b8ee8155de716ffe861`](https://github.com/medusajs/medusa/commit/3b470f41427e487c68f89b8ee8155de716ffe861)]:
  - @medusajs/icons@2.6.1
  - @medusajs/ui@4.0.7
  - @medusajs/js-sdk@2.6.1
  - @medusajs/admin-shared@2.6.1

## 2.6.0

### Patch Changes

- [#11487](https://github.com/medusajs/medusa/pull/11487) [`c28ae573e50b51bd3ef18de7c0e37b37963c423e`](https://github.com/medusajs/medusa/commit/c28ae573e50b51bd3ef18de7c0e37b37963c423e) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(dashboard): Use derrived state in DataTable

- [#11690](https://github.com/medusajs/medusa/pull/11690) [`954136f13a4ff00c0fa66d8159f43b2bce90355a`](https://github.com/medusajs/medusa/commit/954136f13a4ff00c0fa66d8159f43b2bce90355a) Thanks [@riqwan](https://github.com/riqwan)! - fix(dashboard): bust variant inventory cache on inventory update

- [#11664](https://github.com/medusajs/medusa/pull/11664) [`e23f204b7ca0f195e36fef2ba0bae7a686b8da4f`](https://github.com/medusajs/medusa/commit/e23f204b7ca0f195e36fef2ba0bae7a686b8da4f) Thanks [@fPolic](https://github.com/fPolic)! - fix(core-flows, dashboard, medusa): prevent creatiion of a fulfilment without items

- Updated dependencies []:
  - @medusajs/admin-shared@2.6.0
  - @medusajs/js-sdk@2.6.0
  - @medusajs/icons@2.6.0

## 2.5.1

### Patch Changes

- [#11466](https://github.com/medusajs/medusa/pull/11466) [`3b69f5a105de675fda014c8b76cd511a841716c4`](https://github.com/medusajs/medusa/commit/3b69f5a105de675fda014c8b76cd511a841716c4) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(dashboard): Properly delete metadata keys, and fix number parsing

- [#11488](https://github.com/medusajs/medusa/pull/11488) [`06cc658246687309291121f09205801e18537463`](https://github.com/medusajs/medusa/commit/06cc658246687309291121f09205801e18537463) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(dashboard): Allow using the Enter key in product create Textarea

- [#11305](https://github.com/medusajs/medusa/pull/11305) [`a88f6576bd06522f86fb2f8bd4b49f94bd4017c1`](https://github.com/medusajs/medusa/commit/a88f6576bd06522f86fb2f8bd4b49f94bd4017c1) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - feat(dashboard,admin-vite-plugin): Add support for parallel routes

- [#11462](https://github.com/medusajs/medusa/pull/11462) [`b53ea77658aa4f17b41bf52c9f51c5b7a425556b`](https://github.com/medusajs/medusa/commit/b53ea77658aa4f17b41bf52c9f51c5b7a425556b) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - feat(ui,dashboard): Move InlineTip to UI package

- [#11532](https://github.com/medusajs/medusa/pull/11532) [`0307304dc679bc1533e5826e0bb726f7895a0615`](https://github.com/medusajs/medusa/commit/0307304dc679bc1533e5826e0bb726f7895a0615) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(dashboard): Prevent overfetching data

- [#11366](https://github.com/medusajs/medusa/pull/11366) [`03b8bda1ba31fa835ea6e8bba07160d4495039ef`](https://github.com/medusajs/medusa/commit/03b8bda1ba31fa835ea6e8bba07160d4495039ef) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(dashboard): Fix size of buttons and use Link to navigate

- [#11414](https://github.com/medusajs/medusa/pull/11414) [`47edd01deec79b394552cea349f1e41b7b88723b`](https://github.com/medusajs/medusa/commit/47edd01deec79b394552cea349f1e41b7b88723b) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(admin-vite-plugin,admin-bundler,ui,icons,dashboard,framework,types): Update Vite dependencies

- Updated dependencies [[`32ad13813bc267a04ea95d34a479efa5309b3051`](https://github.com/medusajs/medusa/commit/32ad13813bc267a04ea95d34a479efa5309b3051), [`38a57b1ddcaabeba78dba626b7ec7985df107d07`](https://github.com/medusajs/medusa/commit/38a57b1ddcaabeba78dba626b7ec7985df107d07), [`b53ea77658aa4f17b41bf52c9f51c5b7a425556b`](https://github.com/medusajs/medusa/commit/b53ea77658aa4f17b41bf52c9f51c5b7a425556b), [`3b4997840e624ef8da1a75744b4bfb5c5a371f7c`](https://github.com/medusajs/medusa/commit/3b4997840e624ef8da1a75744b4bfb5c5a371f7c), [`f00e6bf660ab96b9d41bc3d424c8d78c54eaa8e7`](https://github.com/medusajs/medusa/commit/f00e6bf660ab96b9d41bc3d424c8d78c54eaa8e7), [`47edd01deec79b394552cea349f1e41b7b88723b`](https://github.com/medusajs/medusa/commit/47edd01deec79b394552cea349f1e41b7b88723b)]:
  - @medusajs/js-sdk@2.5.1
  - @medusajs/ui@4.0.6
  - @medusajs/icons@2.5.1
  - @medusajs/admin-shared@2.5.1

## 2.5.0

### Patch Changes

- [#11300](https://github.com/medusajs/medusa/pull/11300) [`6db96c80d05730a9188937599baba2602f4e2a92`](https://github.com/medusajs/medusa/commit/6db96c80d05730a9188937599baba2602f4e2a92) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(ui,types): Add Metadata form for collection

- [#11361](https://github.com/medusajs/medusa/pull/11361) [`3dbef519d95cf694d06843cb694c0d2abdac2146`](https://github.com/medusajs/medusa/commit/3dbef519d95cf694d06843cb694c0d2abdac2146) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(admin-vite-plugin,icons,ui,dashboard): Upgrade vitest in all packages and align Vite version

- [#11338](https://github.com/medusajs/medusa/pull/11338) [`211997b137b64ad1c21bc4fc138195ce51d98ce4`](https://github.com/medusajs/medusa/commit/211997b137b64ad1c21bc4fc138195ce51d98ce4) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(dashboard): Remove wrongful import of utils function

- [#11106](https://github.com/medusajs/medusa/pull/11106) [`fcd3e2226ee389e89cc5b03defda9852cf99f624`](https://github.com/medusajs/medusa/commit/fcd3e2226ee389e89cc5b03defda9852cf99f624) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - feat(ui,dashboard): Migrate SC tables to DataTable

- [#11357](https://github.com/medusajs/medusa/pull/11357) [`d00825485f14c1d13123046fdc8a18e9843b16ce`](https://github.com/medusajs/medusa/commit/d00825485f14c1d13123046fdc8a18e9843b16ce) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - feat(ui,dashboard): Move Divider component to UI package

- [#11335](https://github.com/medusajs/medusa/pull/11335) [`7d208afb07a2ebf5f6a66b15139e31b03fda1e12`](https://github.com/medusajs/medusa/commit/7d208afb07a2ebf5f6a66b15139e31b03fda1e12) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(dashboard): Ensure conditional prices are assigned to region

- [#11195](https://github.com/medusajs/medusa/pull/11195) [`9822bd930b55f1dfe9429cc3dfc1c2d0d4edc754`](https://github.com/medusajs/medusa/commit/9822bd930b55f1dfe9429cc3dfc1c2d0d4edc754) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - chore(ui,dashboard): Use radix-ui package

- [#11285](https://github.com/medusajs/medusa/pull/11285) [`f07af7b93c86673e730dc4e5eba8df2572013f9f`](https://github.com/medusajs/medusa/commit/f07af7b93c86673e730dc4e5eba8df2572013f9f) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(dashboard,core-flows,types,medusa): Allow editing Order metadata

- [#11196](https://github.com/medusajs/medusa/pull/11196) [`51d2960a5717c41e79312dd2269fb87e3a4a5b4c`](https://github.com/medusajs/medusa/commit/51d2960a5717c41e79312dd2269fb87e3a4a5b4c) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(dashboard): Allow admins to update default Sales Channel and Stock Location

- Updated dependencies [[`3dbef519d95cf694d06843cb694c0d2abdac2146`](https://github.com/medusajs/medusa/commit/3dbef519d95cf694d06843cb694c0d2abdac2146), [`fcd3e2226ee389e89cc5b03defda9852cf99f624`](https://github.com/medusajs/medusa/commit/fcd3e2226ee389e89cc5b03defda9852cf99f624), [`d00825485f14c1d13123046fdc8a18e9843b16ce`](https://github.com/medusajs/medusa/commit/d00825485f14c1d13123046fdc8a18e9843b16ce), [`65d8d6dc0eae23c7c969664d0c2d127511cc0bd9`](https://github.com/medusajs/medusa/commit/65d8d6dc0eae23c7c969664d0c2d127511cc0bd9), [`3cf430729698c5f62fb6e6d0ebf06ea930981653`](https://github.com/medusajs/medusa/commit/3cf430729698c5f62fb6e6d0ebf06ea930981653), [`3f6425badae771a62c98508f9e6ceab20cee9354`](https://github.com/medusajs/medusa/commit/3f6425badae771a62c98508f9e6ceab20cee9354), [`9822bd930b55f1dfe9429cc3dfc1c2d0d4edc754`](https://github.com/medusajs/medusa/commit/9822bd930b55f1dfe9429cc3dfc1c2d0d4edc754)]:
  - @medusajs/icons@2.5.0
  - @medusajs/ui@4.0.5
  - @medusajs/js-sdk@2.5.0
  - @medusajs/admin-shared@2.5.0

## 2.4.0

### Minor Changes

- [#10757](https://github.com/medusajs/medusa/pull/10757) [`5ff45f27a107da48c943a9c502e15555f66d8722`](https://github.com/medusajs/medusa/commit/5ff45f27a107da48c943a9c502e15555f66d8722) Thanks [@leosin](https://github.com/leosin)! - Added Simplified Chinese (zhCN) translations to admin dashboard

### Patch Changes

- [#10964](https://github.com/medusajs/medusa/pull/10964) [`d4e042e9ad838cfc3b3c83c342afaf76adb281d2`](https://github.com/medusajs/medusa/commit/d4e042e9ad838cfc3b3c83c342afaf76adb281d2) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(dashboard,js-sdk,types): Remove redundant body for markAsDelivered

- [#11107](https://github.com/medusajs/medusa/pull/11107) [`4eecda5466c4b82eadc7447d4de80f0d2663d668`](https://github.com/medusajs/medusa/commit/4eecda5466c4b82eadc7447d4de80f0d2663d668) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(dashboard): Format i18n schema with Prettier

- [#11058](https://github.com/medusajs/medusa/pull/11058) [`6346836c2d2e9830f60a3e583191555e3f10dd6d`](https://github.com/medusajs/medusa/commit/6346836c2d2e9830f60a3e583191555e3f10dd6d) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - feat(dashboard): Refactor Users table to use the new DataTable block

- [#11074](https://github.com/medusajs/medusa/pull/11074) [`c400719fcc8ae04ba95a15ef9e6f583969e6c0b0`](https://github.com/medusajs/medusa/commit/c400719fcc8ae04ba95a15ef9e6f583969e6c0b0) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(dashboard): Persist variant_rank

- [#11073](https://github.com/medusajs/medusa/pull/11073) [`83c91f118621dd39691bad0d672015a3a80d1cce`](https://github.com/medusajs/medusa/commit/83c91f118621dd39691bad0d672015a3a80d1cce) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(dashboard): Use date util to properly format date in order details view

- [#10981](https://github.com/medusajs/medusa/pull/10981) [`0bef3202f3393ed35bddb7278d51f95ec314fcba`](https://github.com/medusajs/medusa/commit/0bef3202f3393ed35bddb7278d51f95ec314fcba) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(dashboard): Add global errorElement

- [#10024](https://github.com/medusajs/medusa/pull/10024) [`147c0e5a353b57d3a17db3b572334db58c830b3c`](https://github.com/medusajs/medusa/commit/147c0e5a353b57d3a17db3b572334db58c830b3c) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - feat(ui,dashboard): Add new DataTable block

- Updated dependencies [[`7feb004600fdbf8bf32b13695fd7f41229d43b52`](https://github.com/medusajs/medusa/commit/7feb004600fdbf8bf32b13695fd7f41229d43b52), [`d4e042e9ad838cfc3b3c83c342afaf76adb281d2`](https://github.com/medusajs/medusa/commit/d4e042e9ad838cfc3b3c83c342afaf76adb281d2), [`147c0e5a353b57d3a17db3b572334db58c830b3c`](https://github.com/medusajs/medusa/commit/147c0e5a353b57d3a17db3b572334db58c830b3c)]:
  - @medusajs/ui@4.0.4
  - @medusajs/js-sdk@2.4.0
  - @medusajs/admin-shared@2.4.0
  - @medusajs/icons@2.4.0

## 2.3.1

### Patch Changes

- Updated dependencies []:
  - @medusajs/admin-shared@2.3.1
  - @medusajs/js-sdk@2.3.1
  - @medusajs/icons@2.3.1

## 2.3.0

### Patch Changes

- [#10888](https://github.com/medusajs/medusa/pull/10888) [`1758bfb8d042fa9fc82f23c36ccd61e4a439448e`](https://github.com/medusajs/medusa/commit/1758bfb8d042fa9fc82f23c36ccd61e4a439448e) Thanks [@riqwan](https://github.com/riqwan)! - fix(dashboard, core-flows): improvements to order page on canceled orders

- [#10950](https://github.com/medusajs/medusa/pull/10950) [`5eab9e739919594ae7e7e416942ec93d84b699fd`](https://github.com/medusajs/medusa/commit/5eab9e739919594ae7e7e416942ec93d84b699fd) Thanks [@riqwan](https://github.com/riqwan)! - feat(promotion,dashboard,types,utils,medusa): Add statuses to promotions

- [#10630](https://github.com/medusajs/medusa/pull/10630) [`bc22b81cdf9591912744f448c74d45bcb0f11e0c`](https://github.com/medusajs/medusa/commit/bc22b81cdf9591912744f448c74d45bcb0f11e0c) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - feat(inventory,dashboard,core-flows,js-sdk,types,medusa): Improve inventory management UX

- [#10961](https://github.com/medusajs/medusa/pull/10961) [`2a25b4d95f2b7a4d53138718c94124f47f041b36`](https://github.com/medusajs/medusa/commit/2a25b4d95f2b7a4d53138718c94124f47f041b36) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - chore(icons,dashboard): Pull latest icons and update branch icon in category tree

- Updated dependencies [[`bc22b81cdf9591912744f448c74d45bcb0f11e0c`](https://github.com/medusajs/medusa/commit/bc22b81cdf9591912744f448c74d45bcb0f11e0c), [`2a25b4d95f2b7a4d53138718c94124f47f041b36`](https://github.com/medusajs/medusa/commit/2a25b4d95f2b7a4d53138718c94124f47f041b36)]:
  - @medusajs/js-sdk@2.3.0
  - @medusajs/icons@2.3.0
  - @medusajs/admin-shared@2.3.0

## 2.2.0

### Patch Changes

- [#10667](https://github.com/medusajs/medusa/pull/10667) [`47594192b79fbc798cfaf21821b60673745d1374`](https://github.com/medusajs/medusa/commit/47594192b79fbc798cfaf21821b60673745d1374) Thanks [@riqwan](https://github.com/riqwan)! - feat(dashboard,core-flows,types,utils,medusa,order): Order cancelations will refund payments

- Updated dependencies [[`13ddf27c68fc2831b3661940bc5f27bab23ce8c0`](https://github.com/medusajs/medusa/commit/13ddf27c68fc2831b3661940bc5f27bab23ce8c0), [`f7aaf2c8bb243c8478a943285628ba8eb331feb6`](https://github.com/medusajs/medusa/commit/f7aaf2c8bb243c8478a943285628ba8eb331feb6), [`3253e19b3603adacd913b8cbb3e88c9beb0c931a`](https://github.com/medusajs/medusa/commit/3253e19b3603adacd913b8cbb3e88c9beb0c931a)]:
  - @medusajs/js-sdk@2.2.0
  - @medusajs/icons@2.2.0
  - @medusajs/ui@4.0.3
  - @medusajs/admin-shared@2.2.0

## 2.1.3

### Patch Changes

- Updated dependencies []:
  - @medusajs/admin-shared@2.1.3
  - @medusajs/js-sdk@2.1.3
  - @medusajs/icons@2.1.3

## 2.1.2

### Patch Changes

- [#10579](https://github.com/medusajs/medusa/pull/10579) [`6367bccde88158d524dfa01e5a8123ffa3461c10`](https://github.com/medusajs/medusa/commit/6367bccde88158d524dfa01e5a8123ffa3461c10) Thanks [@riqwan](https://github.com/riqwan)! - feat(medusa, pricing): Cart workflows handle pricing context accurately

- [#10547](https://github.com/medusajs/medusa/pull/10547) [`dc5e73af4d2fe4eed8239660d74af6cd2a0994cd`](https://github.com/medusajs/medusa/commit/dc5e73af4d2fe4eed8239660d74af6cd2a0994cd) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(dashboard): Prevent fulfillment provider modal from rerendering before form submission is complete

- Updated dependencies []:
  - @medusajs/admin-shared@2.1.2
  - @medusajs/js-sdk@2.1.2
  - @medusajs/icons@2.1.2

## 2.1.1

### Patch Changes

- [#10386](https://github.com/medusajs/medusa/pull/10386) [`a1a1e0e789424546443ce195b95f652d081d7b3b`](https://github.com/medusajs/medusa/commit/a1a1e0e789424546443ce195b95f652d081d7b3b) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - feat(dashboard,types): Add UI to manage conditional SO prices

- [#10449](https://github.com/medusajs/medusa/pull/10449) [`16663ec8132e99bac7fbfe2adda542a5294d2384`](https://github.com/medusajs/medusa/commit/16663ec8132e99bac7fbfe2adda542a5294d2384) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(dashboard,types): Add missing Metadata form for Region domain and fix types

- [#10473](https://github.com/medusajs/medusa/pull/10473) [`7e04091b492c1680fdf5321f512e43b90ba09e12`](https://github.com/medusajs/medusa/commit/7e04091b492c1680fdf5321f512e43b90ba09e12) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(dashboard): Prevent sending off empty string as handle for product category

- [#10193](https://github.com/medusajs/medusa/pull/10193) [`559fc6587aa02cd4f8fbc9e97ff1f1ba094a4b1a`](https://github.com/medusajs/medusa/commit/559fc6587aa02cd4f8fbc9e97ff1f1ba094a4b1a) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(): Deleted default sales channel should be prevented

- [#10481](https://github.com/medusajs/medusa/pull/10481) [`c9a66b19afcfcc626f9e2e4531771dc36f66a65e`](https://github.com/medusajs/medusa/commit/c9a66b19afcfcc626f9e2e4531771dc36f66a65e) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(dashboard,ui): Bring ConditionBlock in line with design

- [#10523](https://github.com/medusajs/medusa/pull/10523) [`de811879299b2acdb069a195979ac116b890b406`](https://github.com/medusajs/medusa/commit/de811879299b2acdb069a195979ac116b890b406) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(dashboard): Add FE validation for conditional prices

- [#10454](https://github.com/medusajs/medusa/pull/10454) [`2b455b15a65030492b188a8d510ab72748e6c0ee`](https://github.com/medusajs/medusa/commit/2b455b15a65030492b188a8d510ab72748e6c0ee) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(dashboard): Cleanup unsafe accesses to possibly undefined values in order timeline

- [#10457](https://github.com/medusajs/medusa/pull/10457) [`864f53011b892e1ed0abee2e241b662eccef7e6d`](https://github.com/medusajs/medusa/commit/864f53011b892e1ed0abee2e241b662eccef7e6d) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(dashboard,types): Fix TS errors

- Updated dependencies [[`c9a66b19afcfcc626f9e2e4531771dc36f66a65e`](https://github.com/medusajs/medusa/commit/c9a66b19afcfcc626f9e2e4531771dc36f66a65e)]:
  - @medusajs/ui@4.0.2
  - @medusajs/admin-shared@2.1.1
  - @medusajs/js-sdk@2.1.1
  - @medusajs/icons@2.1.1

## 2.1.0

### Patch Changes

- [#10416](https://github.com/medusajs/medusa/pull/10416) [`18583ed56725b1faa8b19f7e46e8bc0a59dec33c`](https://github.com/medusajs/medusa/commit/18583ed56725b1faa8b19f7e46e8bc0a59dec33c) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(dashboard): Fix broken number input in adjust inventory form

- [#10412](https://github.com/medusajs/medusa/pull/10412) [`e8f4f7ea2ba33a747a61a13537e073c82a56d29e`](https://github.com/medusajs/medusa/commit/e8f4f7ea2ba33a747a61a13537e073c82a56d29e) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(dashboard): Add default value to inventory item combobox

- [#10422](https://github.com/medusajs/medusa/pull/10422) [`a5c8cc992ce9f1dbed6b30048f99fa5bae4af05a`](https://github.com/medusajs/medusa/commit/a5c8cc992ce9f1dbed6b30048f99fa5bae4af05a) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(dashboard): Prevent language ptBR from breaking dashboard

- [#10431](https://github.com/medusajs/medusa/pull/10431) [`3d5ca155e303548853ba5ca9e6b3d37ce477823f`](https://github.com/medusajs/medusa/commit/3d5ca155e303548853ba5ca9e6b3d37ce477823f) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(dashboard): Prevent order details page from crashing on no region

- [#10430](https://github.com/medusajs/medusa/pull/10430) [`c6f955f0b51a795b4f6a1aeaa1de36205d2d32e5`](https://github.com/medusajs/medusa/commit/c6f955f0b51a795b4f6a1aeaa1de36205d2d32e5) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(dashboard): Add Shipping Profile metadata route

- Updated dependencies [[`94f6265dfc074969f2f141a19f2fc33a6ab96af1`](https://github.com/medusajs/medusa/commit/94f6265dfc074969f2f141a19f2fc33a6ab96af1)]:
  - @medusajs/icons@2.1.0
  - @medusajs/admin-shared@2.1.0
  - @medusajs/js-sdk@2.1.0

## 2.0.7

### Patch Changes

- [#10188](https://github.com/medusajs/medusa/pull/10188) [`ade1545207a4f45c138a785688c625fae797b694`](https://github.com/medusajs/medusa/commit/ade1545207a4f45c138a785688c625fae797b694) Thanks [@DanSilva41](https://github.com/DanSilva41)! - feat(dashboard): Add ptBR i18n

- [#10312](https://github.com/medusajs/medusa/pull/10312) [`2edc2fe19b6afae41e3b6945b7abfbd8e3fa6e5c`](https://github.com/medusajs/medusa/commit/2edc2fe19b6afae41e3b6945b7abfbd8e3fa6e5c) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(dashboard): Prevent product metadata form from throwing an error

- [#10261](https://github.com/medusajs/medusa/pull/10261) [`da536aba244e46a81b2237f782be71c8d2d54802`](https://github.com/medusajs/medusa/commit/da536aba244e46a81b2237f782be71c8d2d54802) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(dashboard): Truncate long product organization tags

- [#10234](https://github.com/medusajs/medusa/pull/10234) [`3ab056e572c2391bc66e58fb515d033f5024da1e`](https://github.com/medusajs/medusa/commit/3ab056e572c2391bc66e58fb515d033f5024da1e) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - feat(dashboard): Allow setting a tooltip for disabled action items

- [#10285](https://github.com/medusajs/medusa/pull/10285) [`344a6c9ea05a1d59a3a7de5282ae7ecda141d6ae`](https://github.com/medusajs/medusa/commit/344a6c9ea05a1d59a3a7de5282ae7ecda141d6ae) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(dashboard): Add Metadata form to Variant page

- Updated dependencies []:
  - @medusajs/admin-shared@2.0.7
  - @medusajs/js-sdk@2.0.7
  - @medusajs/icons@2.0.7

## 2.0.6

### Patch Changes

- [#10254](https://github.com/medusajs/medusa/pull/10254) [`c28d0db1647a5c8edaf0ba0faba6426e8a740399`](https://github.com/medusajs/medusa/commit/c28d0db1647a5c8edaf0ba0faba6426e8a740399) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(product,dashboard): Avoid duplicating images

- Updated dependencies []:
  - @medusajs/admin-shared@2.0.6
  - @medusajs/js-sdk@2.0.6
  - @medusajs/icons@2.0.6

## 2.0.5

### Patch Changes

- [#10117](https://github.com/medusajs/medusa/pull/10117) [`8ed3d87c23c5b9e23d225f5463e3ab11abd5b6a0`](https://github.com/medusajs/medusa/commit/8ed3d87c23c5b9e23d225f5463e3ab11abd5b6a0) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(dashboard): Add missing inventory_item.list.\* widgets

- [#10079](https://github.com/medusajs/medusa/pull/10079) [`493d242c1259cdc68ecdce5f0f9d7885cbd67094`](https://github.com/medusajs/medusa/commit/493d242c1259cdc68ecdce5f0f9d7885cbd67094) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(dashboard): Ensure Breadcrumbs don't display stale data

- [#10187](https://github.com/medusajs/medusa/pull/10187) [`1659c9be5d3ace1bed9f3a6e7206fe54e60645c0`](https://github.com/medusajs/medusa/commit/1659c9be5d3ace1bed9f3a6e7206fe54e60645c0) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - feat(dashboard): Allow re-ordering product images

- [#10098](https://github.com/medusajs/medusa/pull/10098) [`a153bc477c421cd3cfc6f2cb7e30f2f3661f5922`](https://github.com/medusajs/medusa/commit/a153bc477c421cd3cfc6f2cb7e30f2f3661f5922) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(admin-shared,dashboard): Add missing Injection Zones and remove unused zones"

- [#10082](https://github.com/medusajs/medusa/pull/10082) [`dea86d8c8774d5badadefbc92352d5145245a22f`](https://github.com/medusajs/medusa/commit/dea86d8c8774d5badadefbc92352d5145245a22f) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(dashboard): Fix active nav link styling for built-in routes

- [#10213](https://github.com/medusajs/medusa/pull/10213) [`60b13c191ed8164951e4743f19e1cdc1efd3b5fc`](https://github.com/medusajs/medusa/commit/60b13c191ed8164951e4743f19e1cdc1efd3b5fc) Thanks [@ederwii](https://github.com/ederwii)! - feat(dashboard): Add Spanish i18n

- Updated dependencies [[`6680f69588332e25e6be2115248dd72fe18334b7`](https://github.com/medusajs/medusa/commit/6680f69588332e25e6be2115248dd72fe18334b7), [`a153bc477c421cd3cfc6f2cb7e30f2f3661f5922`](https://github.com/medusajs/medusa/commit/a153bc477c421cd3cfc6f2cb7e30f2f3661f5922), [`d6ff8d7aa16fe83a6cb15e9cc46360316625189e`](https://github.com/medusajs/medusa/commit/d6ff8d7aa16fe83a6cb15e9cc46360316625189e)]:
  - @medusajs/js-sdk@2.0.5
  - @medusajs/admin-shared@2.0.5
  - @medusajs/icons@2.0.5

## 2.0.4

### Patch Changes

- [#10029](https://github.com/medusajs/medusa/pull/10029) [`904f0926f16737abe0a51a4fce8e5b0b8a377321`](https://github.com/medusajs/medusa/commit/904f0926f16737abe0a51a4fce8e5b0b8a377321) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(dashboard): Fix query key for product details and load product variant data correctly

- [#9770](https://github.com/medusajs/medusa/pull/9770) [`5c22c57cb8f549c9b16829ab313eb954339b1f6a`](https://github.com/medusajs/medusa/commit/5c22c57cb8f549c9b16829ab313eb954339b1f6a) Thanks [@nexthis](https://github.com/nexthis)! - feat(dashboard): Add Polish translation of admin dashboard

- Updated dependencies []:
  - @medusajs/admin-shared@2.0.4
  - @medusajs/js-sdk@2.0.4
  - @medusajs/icons@2.0.4

## 2.0.3

### Patch Changes

- Updated dependencies []:
  - @medusajs/admin-shared@2.0.3
  - @medusajs/js-sdk@2.0.3
  - @medusajs/icons@2.0.3

## 2.0.2

### Patch Changes

- [#9947](https://github.com/medusajs/medusa/pull/9947) [`b3cbc160eb94025402b5a0ef21653c207bbe8ccd`](https://github.com/medusajs/medusa/commit/b3cbc160eb94025402b5a0ef21653c207bbe8ccd) Thanks [@sradevski](https://github.com/sradevski)! - fix: Default to a relative path for backend URL in admin

- Updated dependencies [[`30edc8fa40ff5ed6ecc8c55f555f9d975df497f5`](https://github.com/medusajs/medusa/commit/30edc8fa40ff5ed6ecc8c55f555f9d975df497f5)]:
  - @medusajs/js-sdk@2.0.2
  - @medusajs/admin-shared@2.0.2
  - @medusajs/icons@2.0.2

## 2.0.1

### Patch Changes

- [#9757](https://github.com/medusajs/medusa/pull/9757) [`e0870731213d353d2d718ba0b600ce8c08add14a`](https://github.com/medusajs/medusa/commit/e0870731213d353d2d718ba0b600ce8c08add14a) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(dashboard): Workflow executions

- [#9725](https://github.com/medusajs/medusa/pull/9725) [`7b6793f846a36289fe8cdfd501401b1d993d9eff`](https://github.com/medusajs/medusa/commit/7b6793f846a36289fe8cdfd501401b1d993d9eff) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(dashboard): Prevent nested UI Routes from re-using parent component

- [#9775](https://github.com/medusajs/medusa/pull/9775) [`59e6747800133e091d20c2c167f600981abc5c0d`](https://github.com/medusajs/medusa/commit/59e6747800133e091d20c2c167f600981abc5c0d) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(dashboard,ui): DateFilter should remain open

- Updated dependencies [[`59e6747800133e091d20c2c167f600981abc5c0d`](https://github.com/medusajs/medusa/commit/59e6747800133e091d20c2c167f600981abc5c0d)]:
  - @medusajs/ui@4.0.1
  - @medusajs/admin-shared@2.0.1
  - @medusajs/js-sdk@2.0.1
  - @medusajs/icons@2.0.1

## 2.0.0

### Major Changes

- [#7341](https://github.com/medusajs/medusa/pull/7341) [`2e42e053d4c9d5445d227bdc268c66713aad8e2e`](https://github.com/medusajs/medusa/commit/2e42e053d4c9d5445d227bdc268c66713aad8e2e) Thanks [@olivermrbl](https://github.com/olivermrbl)! - chore: Medusa 2.0

### Patch Changes

- Updated dependencies [[`2e42e053d4c9d5445d227bdc268c66713aad8e2e`](https://github.com/medusajs/medusa/commit/2e42e053d4c9d5445d227bdc268c66713aad8e2e)]:
  - @medusajs/icons@2.0.0
  - @medusajs/ui@4.0.0
  - @medusajs/js-sdk@2.0.0
  - @medusajs/admin-shared@2.0.0
