# @medusajs/admin-shared

## 2.22.2

### Patch Changes

- [#17567](https://github.com/medusajs/medusa/pull/17567) [`52caddd`](https://github.com/medusajs/medusa/commit/52cadddcf34fdbbc70be34aecd036d6885e8fa5d) Thanks [@shahednasser](https://github.com/shahednasser)! - chore(deps): update development and test tooling (cross-env 10.1.0, esbuild 0.28.2, tsup 9.0.0, expect-type 1.4.0, @faker-js/faker 10.6.0, jsdom 30.1.3, @types/jsonwebtoken 9.0.10, msw 3.0.3, rimraf 6.1.3, Testing Library, turbo 2.11.10, @types/node 22, boxen 9.0.0, chalk 6.0.1, ci-info 4.4.0, commander 15.0.0, configstore 8.0.0, dotenv 18.0.9, execa 10.2.1, get-port 7.2.0, inquirer 14.2.4, @inquirer/checkbox 5.2.7, @inquirer/confirm 6.3.4, @inquirer/input 5.1.8, is-docker 4.0.0, meant 2.0.1, open 11.0.4, openapi3-ts 4.6.2, ora 9.4.1, @readme/openapi-parser 10.0.0, @redocly/cli 2.71.0, stack-trace 1.0.0, swagger-inline 8.1.0, yargs 18.2.0) and remove unused development dependencies; drop hosted-git-info from @medusajs/cli; fix the medusa-oas-cli circular patch recommendation crashing on references nested in inline schemas; `medusa-oas docs --preview` now serves a static Redoc 3 build since Redocly removed `preview-docs`; replace chalk with Node's built-in `util.styleText` in CommonJS packages; replace uuid with Node's built-in `crypto.randomUUID`; replace get-port with a built-in free-port helper in @medusajs/test-utils

## 2.22.1

## 2.22.0

### Patch Changes

- [#17382](https://github.com/medusajs/medusa/pull/17382) [`1db74006ede40300afe64970024688a1a9c2a936`](https://github.com/medusajs/medusa/commit/1db74006ede40300afe64970024688a1a9c2a936) Thanks [@shahednasser](https://github.com/shahednasser)! - chore: ship AGENTS.md in published packages and add agent discovery fields to package.json

## 2.21.2

## 2.21.1

## 2.21.0

## 2.20.1

## 2.20.0

### Patch Changes

- [#16425](https://github.com/medusajs/medusa/pull/16425) [`7e421e0f0c60abf64bcfeccea93071202ec78d55`](https://github.com/medusajs/medusa/commit/7e421e0f0c60abf64bcfeccea93071202ec78d55) Thanks [@sradevski](https://github.com/sradevski)! - Add support for configuring the global search in admin

## 2.19.0

### Patch Changes

- [`8f03b13a6137047ce36f61a9bb033879395f9345`](undefined) - fix(admin-shared): add missing gift_card.list.side injection zone

## 2.18.0

### Patch Changes

- [#14661](https://github.com/medusajs/medusa/pull/14661) [`8f97e3f3710a2bae662415dac7098e1c6e60c3c9`](https://github.com/medusajs/medusa/commit/8f97e3f3710a2bae662415dac7098e1c6e60c3c9) Thanks [@NicolasGorga](https://github.com/NicolasGorga)! - feat(dashboard,admin-vite-plugin,admin-shared,ui,settings,js-sdk,types): view configuration UI enhancements — dynamic filter/sort resolution, custom cell renderer registration, property labels management UI

## 2.17.2

### Patch Changes

- [#15683](https://github.com/medusajs/medusa/pull/15683) [`de58ec503bcd82aae3fe576f9a404c36e2525f4c`](https://github.com/medusajs/medusa/commit/de58ec503bcd82aae3fe576f9a404c36e2525f4c) Thanks [@Floofy6](https://github.com/Floofy6)! - chore: add package bugs metadata

- [#15721](https://github.com/medusajs/medusa/pull/15721) [`7686adc8637b41879c4551ca422829ad2d63d6a9`](https://github.com/medusajs/medusa/commit/7686adc8637b41879c4551ca422829ad2d63d6a9) Thanks [@leobenzol](https://github.com/leobenzol)! - feat: drag&drop LayoutComposer, settings db persistence

- [#15862](https://github.com/medusajs/medusa/pull/15862) [`9e47b94b5fb9777b06f099d270bcb95df99c3214`](https://github.com/medusajs/medusa/commit/9e47b94b5fb9777b06f099d270bcb95df99c3214) Thanks [@leobenzol](https://github.com/leobenzol)! - feat(admin-shared,dashboard): use layout composer in Topbar, Sidebar and settings Sidebar

- [#15861](https://github.com/medusajs/medusa/pull/15861) [`f79afaaecdd5aaa84b31ddcdea14a43692e33eff`](https://github.com/medusajs/medusa/commit/f79afaaecdd5aaa84b31ddcdea14a43692e33eff) Thanks [@NicolasGorga](https://github.com/NicolasGorga)! - feat(admin-shared,dashboard): apply new LayoutComposer approach across the admin dashboard

## 2.17.1

## 2.17.0

### Minor Changes

- [#13817](https://github.com/medusajs/medusa/pull/13817) [`6eff86709de4dddc359f35fa84a2462fed85b753`](https://github.com/medusajs/medusa/commit/6eff86709de4dddc359f35fa84a2462fed85b753) Thanks [@willbouch](https://github.com/willbouch)! - feat(dashboard,admin-shared): product option redesign (client-side)

### Patch Changes

- [#13817](https://github.com/medusajs/medusa/pull/13817) [`6eff86709de4dddc359f35fa84a2462fed85b753`](https://github.com/medusajs/medusa/commit/6eff86709de4dddc359f35fa84a2462fed85b753) Thanks [@willbouch](https://github.com/willbouch)! - feat(admin-shared,dashboard,core-flows,product,js-sdk,types,medusa): rework product option values views and add dedicated endpoints

## 2.16.0

### Patch Changes

- [#15478](https://github.com/medusajs/medusa/pull/15478) [`f2e576f895ae6579dfa4e29b75d8a0a9c9cf9326`](https://github.com/medusajs/medusa/commit/f2e576f895ae6579dfa4e29b75d8a0a9c9cf9326) Thanks [@leobenzol](https://github.com/leobenzol)! - feat(admin-shared,dashboard,draft-order,loyalty): LayoutComposer, injection zones for plugins

- [#14674](https://github.com/medusajs/medusa/pull/14674) [`06b05343b4158e7bb96f8f0fbd7e6836a1818e44`](https://github.com/medusajs/medusa/commit/06b05343b4158e7bb96f8f0fbd7e6836a1818e44) Thanks [@fPolic](https://github.com/fPolic)! - feat(dashboard,admin-shared,core-flows,js-sdk,types,medusa,link-modules): RBAC admin dashboard CRUD

## 2.15.5

## 2.15.4

## 2.15.3

## 2.15.2

## 2.15.1

## 2.15.0

## 2.14.2

## 2.14.1

## 2.14.0

## 2.13.6

## 2.13.5

## 2.13.4

## 2.13.3

## 2.13.2

## 2.13.1

## 2.13.0

### Minor Changes

- [`a31e72c31c5235240cead2d04e39e5927688eec7`](https://github.com/medusajs/medusa/commit/a31e72c31c5235240cead2d04e39e5927688eec7) Thanks [@olivermrbl](https://github.com/olivermrbl)! - chore: Minor bump

## 2.12.6

## 2.12.5

## 2.12.4

## 2.12.3

## 2.12.2

## 2.12.1

## 2.12.0

## 2.11.3

### Patch Changes

- [#13910](https://github.com/medusajs/medusa/pull/13910) [`224ab39a81e8d3cf3d6fa3ff5eee82541f64728d`](https://github.com/medusajs/medusa/commit/224ab39a81e8d3cf3d6fa3ff5eee82541f64728d) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(): Dependencies cleanup and improvements

- [#13940](https://github.com/medusajs/medusa/pull/13940) [`afb40d437b3cc4ceb015df70985b2f005f40eaff`](https://github.com/medusajs/medusa/commit/afb40d437b3cc4ceb015df70985b2f005f40eaff) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(): Cleanup and organize deps

## 2.11.2

## 2.11.1

### Patch Changes

- [#13763](https://github.com/medusajs/medusa/pull/13763) [`226984cf0f229bec00ee33a3a1a981b57889c11a`](https://github.com/medusajs/medusa/commit/226984cf0f229bec00ee33a3a1a981b57889c11a) Thanks [@leobenzol](https://github.com/leobenzol)! - feat(admin-\*,dashboard): add dashboard i18n extensions

## 2.11.0

### Patch Changes

- [#13575](https://github.com/medusajs/medusa/pull/13575) [`5e827ec95d0f721e62c0d4e8c603bda7ddc0929c`](https://github.com/medusajs/medusa/commit/5e827ec95d0f721e62c0d4e8c603bda7ddc0929c) Thanks [@willbouch](https://github.com/willbouch)! - feat(admin-shared,dashboard,js-sdk,types,payment): refund reasons in dashboard

## 2.10.3

## 2.10.2

## 2.10.1

## 2.10.0

### Patch Changes

- [#13208](https://github.com/medusajs/medusa/pull/13208) [`4b3c43fe92d99a98b3d7b9ee6705114de01cbc5d`](https://github.com/medusajs/medusa/commit/4b3c43fe92d99a98b3d7b9ee6705114de01cbc5d) Thanks [@willbouch](https://github.com/willbouch)! - feat(dashboard, js-sdk): shipping option type mngmt dashboard

## 2.9.0

## 2.8.8

## 2.8.7

## 2.8.6

## 2.8.5

## 2.8.4

## 2.8.3

## 2.8.2

## 2.8.1

## 2.8.0

## 2.7.1

## 2.7.0

### Patch Changes

- [#11871](https://github.com/medusajs/medusa/pull/11871) [`5ab15a29889870411b719ebad3fb94786baee45e`](https://github.com/medusajs/medusa/commit/5ab15a29889870411b719ebad3fb94786baee45e) Thanks [@riqwan](https://github.com/riqwan)! - feat(dashboard,js-sdk,admin-shared): add customer addresses + layout change

- [#11871](https://github.com/medusajs/medusa/pull/11871) [`5ab15a29889870411b719ebad3fb94786baee45e`](https://github.com/medusajs/medusa/commit/5ab15a29889870411b719ebad3fb94786baee45e) Thanks [@riqwan](https://github.com/riqwan)! - feat(dashboard,js-sdk,admin-shared): add customer addresses + layout change

## 2.6.1

## 2.6.0

## 2.5.1

## 2.5.0

## 2.4.0

## 2.3.1

## 2.3.0

## 2.2.0

## 2.1.3

## 2.1.2

## 2.1.1

## 2.1.0

## 2.0.7

## 2.0.6

## 2.0.5

### Patch Changes

- [#10098](https://github.com/medusajs/medusa/pull/10098) [`a153bc477c421cd3cfc6f2cb7e30f2f3661f5922`](https://github.com/medusajs/medusa/commit/a153bc477c421cd3cfc6f2cb7e30f2f3661f5922) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(admin-shared,dashboard): Add missing Injection Zones and remove unused zones"

## 2.0.4

## 2.0.3

## 2.0.2

## 2.0.1

## 2.0.0

### Major Changes

- [#7341](https://github.com/medusajs/medusa/pull/7341) [`2e42e053d4c9d5445d227bdc268c66713aad8e2e`](https://github.com/medusajs/medusa/commit/2e42e053d4c9d5445d227bdc268c66713aad8e2e) Thanks [@olivermrbl](https://github.com/olivermrbl)! - chore: Medusa 2.0
