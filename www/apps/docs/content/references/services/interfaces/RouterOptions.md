# RouterOptions

## Properties

### caseSensitive

 `Optional` **caseSensitive**: `boolean`

Enable case sensitivity.

#### Defined in

node_modules/@types/express/index.d.ts:77

___

### mergeParams

 `Optional` **mergeParams**: `boolean`

Preserve the req.params values from the parent router.
If the parent and the child have conflicting param names, the child’s value take precedence.

**Default**

```ts
false
```

**Since**

4.5.0

#### Defined in

node_modules/@types/express/index.d.ts:86

___

### strict

 `Optional` **strict**: `boolean`

Enable strict routing.

#### Defined in

node_modules/@types/express/index.d.ts:91
