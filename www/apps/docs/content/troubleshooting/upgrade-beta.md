---
title: 'Upgrading Beta Versions'
---

If you're using `beta` versions of Medusa packages, such as the `@medusajs/medusa` or `@medusajs/admin` packages, simply updating to the latest `beta` version might not work and you'll end up with the same version. This could be due to the version in `yarn.lock` or `package-lock.json` not updating properly.

To resolve this issue, try the following:

- Remove the `yarn.lock` or `package-lock.json` file in your project.
- Remove the `node_modules` directory
- Install again.
