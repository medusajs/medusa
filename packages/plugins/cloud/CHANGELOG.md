# @medusajs/cloud

## 2.23.0

### Minor Changes

- [#17568](https://github.com/medusajs/medusa/pull/17568) [`840b266`](https://github.com/medusajs/medusa/commit/840b266aaff7fa425a59a28fe154e7aef8409f50) Thanks [@shahednasser](https://github.com/shahednasser)! - chore(deps): update pinned dependencies (fdir 6.5.0, http-errors 2.0.1, radix-ui 1.8.1, react-hook-form 7.92.0, react-router-dom 7.18.5, @tanstack/react-query 5.107.1, zod 4.6.7, i18next 27.1.1, react-i18next 18.0.1, i18next-browser-languagedetector 8.3.0), fix new data table filter popovers staying hidden with radix-ui 1.8.1, forward all mutation callback arguments in admin hooks, and translate loyalty plugin validation messages with the dashboard's i18n instance

- [#17632](https://github.com/medusajs/medusa/pull/17632) [`4f1baa0`](https://github.com/medusajs/medusa/commit/4f1baa07fb117a900400a61ebb2e7c6729717e04) Thanks [@shahednasser](https://github.com/shahednasser)! - chore: update to Tailwind CSS 4. The admin and admin extensions now compile with Tailwind CSS 4

### Patch Changes

- Updated dependencies [[`a80733d`](https://github.com/medusajs/medusa/commit/a80733d0aa30dd1b15428b9c52c92eac4723f2b2), [`00516a1`](https://github.com/medusajs/medusa/commit/00516a135a621293c224594378122d2e2e070c3a), [`542caef`](https://github.com/medusajs/medusa/commit/542caefc231959d2f98fefcea4291521b9aef94a), [`00516a1`](https://github.com/medusajs/medusa/commit/00516a135a621293c224594378122d2e2e070c3a), [`f70d4c7`](https://github.com/medusajs/medusa/commit/f70d4c7bbdcccac69ebf0629fb00e11468f068c1), [`45ab5b6`](https://github.com/medusajs/medusa/commit/45ab5b68c954ea7c000952a5e3263c60deadfa99), [`2086f3d`](https://github.com/medusajs/medusa/commit/2086f3d573a1357815007c53f6a842227731898f), [`6d76b3b`](https://github.com/medusajs/medusa/commit/6d76b3b55154896d732d4f8ac6fc948bd36d958c), [`b1911eb`](https://github.com/medusajs/medusa/commit/b1911ebf3aef01dfebe897133dd8c4a320d297a1), [`940553e`](https://github.com/medusajs/medusa/commit/940553ec2da5d6cb157c3380106e121b79b1a082), [`840b266`](https://github.com/medusajs/medusa/commit/840b266aaff7fa425a59a28fe154e7aef8409f50), [`750659a`](https://github.com/medusajs/medusa/commit/750659aff00ee82bcdf232754a2c4010aed0fad2), [`63b9624`](https://github.com/medusajs/medusa/commit/63b9624a124001966a1b47c68e5dc7652d697de9), [`858968d`](https://github.com/medusajs/medusa/commit/858968de74908cccc17a44ecf318b4d605847b2c), [`45ab5b6`](https://github.com/medusajs/medusa/commit/45ab5b68c954ea7c000952a5e3263c60deadfa99), [`cc31b24`](https://github.com/medusajs/medusa/commit/cc31b247bce8640a634aadf7ece469cbda020c8c), [`b012802`](https://github.com/medusajs/medusa/commit/b012802716924f04301d12ef49ca71c83c0e5daf), [`19a7e08`](https://github.com/medusajs/medusa/commit/19a7e083dcb8727cfe3e1c0a1cfdfb4b86595d33), [`4f1baa0`](https://github.com/medusajs/medusa/commit/4f1baa07fb117a900400a61ebb2e7c6729717e04)]:
  - @medusajs/dashboard@2.23.0
  - @medusajs/framework@2.23.0
  - @medusajs/test-utils@2.23.0
  - @medusajs/cli@2.23.0
  - @medusajs/ui@4.3.0
  - @medusajs/icons@2.23.0
  - @medusajs/admin-sdk@2.23.0
  - @medusajs/js-sdk@2.23.0

## 2.22.7

### Patch Changes

- [#17518](https://github.com/medusajs/medusa/pull/17518) [`b89101c`](https://github.com/medusajs/medusa/commit/b89101ca53b1ab106549df31e0c38a50e755aefc) Thanks [@shahednasser](https://github.com/shahednasser)! - feat(cloud,utils,medusa,admin-shared,dashboard): add Medusa Cloud plugin that shows Cloud announcements in the admin, and a `sidebar.settings.before` injection zone

- Updated dependencies [[`3d9104d`](https://github.com/medusajs/medusa/commit/3d9104d131aa56e2490d14e3ed804d93592305fa), [`b810334`](https://github.com/medusajs/medusa/commit/b810334cbf0c0ba3a401d82182ef06f2432e2716), [`beca252`](https://github.com/medusajs/medusa/commit/beca2525ebb9298caa9d7ad2266c12961b3470af), [`48b6d2d`](https://github.com/medusajs/medusa/commit/48b6d2d42089f8f4ba846a30a84f2031eca34b0f), [`b89101c`](https://github.com/medusajs/medusa/commit/b89101ca53b1ab106549df31e0c38a50e755aefc), [`33af8f3`](https://github.com/medusajs/medusa/commit/33af8f3b4b581aabb4e655307b3055b7263908ef), [`4380483`](https://github.com/medusajs/medusa/commit/438048300ad25f741789ba06e03883c90233b6c5), [`1dd67d9`](https://github.com/medusajs/medusa/commit/1dd67d91267f97f7ca3185166dda12eb28291276), [`17fca1a`](https://github.com/medusajs/medusa/commit/17fca1ab50bb4488496aecff52b5ac9f4421917d), [`1711c4c`](https://github.com/medusajs/medusa/commit/1711c4c5ce1b654e03a05202851737d6c4f754d3), [`db78b61`](https://github.com/medusajs/medusa/commit/db78b61eb2e74218436fe96222f01b93d23dc895), [`beca252`](https://github.com/medusajs/medusa/commit/beca2525ebb9298caa9d7ad2266c12961b3470af), [`afd2820`](https://github.com/medusajs/medusa/commit/afd2820e0ff11193144a8de0e8ee7959784d157c), [`b6f9805`](https://github.com/medusajs/medusa/commit/b6f980509a365319d14ddb4fcbde81b7c5db2aff), [`6cb4ea1`](https://github.com/medusajs/medusa/commit/6cb4ea13764237ea1ab85a6b6d864def45e9883b), [`b89101c`](https://github.com/medusajs/medusa/commit/b89101ca53b1ab106549df31e0c38a50e755aefc), [`33af8f3`](https://github.com/medusajs/medusa/commit/33af8f3b4b581aabb4e655307b3055b7263908ef), [`9db3748`](https://github.com/medusajs/medusa/commit/9db37488d4be757b0139aac1e15fb79ed395fc6c)]:
  - @medusajs/framework@2.22.7
  - @medusajs/js-sdk@2.22.7
  - @medusajs/dashboard@2.22.7
  - @medusajs/ui@4.2.14
  - @medusajs/icons@2.22.7
  - @medusajs/test-utils@2.22.7
  - @medusajs/cli@2.22.7
  - @medusajs/admin-sdk@2.22.7
