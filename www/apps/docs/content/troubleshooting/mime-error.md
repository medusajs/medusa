---
title: "Mime Error"
---

The following error can occur when running the `build` command either locally or in an deployed Medusa backend:

```
Cannot find type definition file for 'mime'
```

This error typically occurs when using yarn v1 in an older Medusa setup.

To resolve the error, install v1.3.5 of `@types/mime` as a development dependency in your Medusa backend:

```bash npm2yarn
npm install @types/mime@1.3.5 --save-dev
```
