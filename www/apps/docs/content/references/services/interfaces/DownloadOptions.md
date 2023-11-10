# DownloadOptions

## Hierarchy

- [`SendOptions`](SendOptions.md)

  ↳ **`DownloadOptions`**

## Properties

### acceptRanges

 `Optional` **acceptRanges**: `boolean`

Enable or disable accepting ranged requests, defaults to true.
Disabling this will not send Accept-Ranges and ignore the contents of the Range request header.

#### Inherited from

[SendOptions](SendOptions.md).[acceptRanges](SendOptions.md#acceptranges)

#### Defined in

node_modules/@types/send/index.d.ts:26

___

### cacheControl

 `Optional` **cacheControl**: `boolean`

Enable or disable setting Cache-Control response header, defaults to true.
Disabling this will ignore the maxAge option.

#### Inherited from

[SendOptions](SendOptions.md).[cacheControl](SendOptions.md#cachecontrol)

#### Defined in

node_modules/@types/send/index.d.ts:32

___

### dotfiles

 `Optional` **dotfiles**: ``"ignore"`` \| ``"allow"`` \| ``"deny"``

Set how "dotfiles" are treated when encountered.
A dotfile is a file or directory that begins with a dot (".").
Note this check is done on the path itself without checking if the path actually exists on the disk.
If root is specified, only the dotfiles above the root are checked (i.e. the root itself can be within a dotfile when when set to "deny").
'allow' No special treatment for dotfiles.
'deny' Send a 403 for any request for a dotfile.
'ignore' Pretend like the dotfile does not exist and 404.
The default value is similar to 'ignore', with the exception that this default will not ignore the files within a directory that begins with a dot, for backward-compatibility.

#### Inherited from

[SendOptions](SendOptions.md).[dotfiles](SendOptions.md#dotfiles)

#### Defined in

node_modules/@types/send/index.d.ts:44

___

### end

 `Optional` **end**: `number`

Byte offset at which the stream ends, defaults to the length of the file minus 1.
The end is inclusive in the stream, meaning end: 3 will include the 4th byte in the stream.

#### Inherited from

[SendOptions](SendOptions.md).[end](SendOptions.md#end)

#### Defined in

node_modules/@types/send/index.d.ts:50

___

### etag

 `Optional` **etag**: `boolean`

Enable or disable etag generation, defaults to true.

#### Inherited from

[SendOptions](SendOptions.md).[etag](SendOptions.md#etag)

#### Defined in

node_modules/@types/send/index.d.ts:55

___

### extensions

 `Optional` **extensions**: `string` \| `boolean` \| `string`[]

If a given file doesn't exist, try appending one of the given extensions, in the given order.
By default, this is disabled (set to false).
An example value that will serve extension-less HTML files: ['html', 'htm'].
This is skipped if the requested file already has an extension.

#### Inherited from

[SendOptions](SendOptions.md).[extensions](SendOptions.md#extensions)

#### Defined in

node_modules/@types/send/index.d.ts:63

___

### headers

 `Optional` **headers**: Record<`string`, `unknown`\>

Object containing HTTP headers to serve with the file. The header `Content-Disposition` will be overridden by the filename argument.

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:683

___

### immutable

 `Optional` **immutable**: `boolean`

Enable or disable the immutable directive in the Cache-Control response header, defaults to false.
If set to true, the maxAge option should also be specified to enable caching.
The immutable directive will prevent supported clients from making conditional requests during the life of the maxAge option to check if the file has changed.

**Default**

```ts
false
```

#### Inherited from

[SendOptions](SendOptions.md).[immutable](SendOptions.md#immutable)

#### Defined in

node_modules/@types/send/index.d.ts:71

___

### index

 `Optional` **index**: `string` \| `boolean` \| `string`[]

By default send supports "index.html" files, to disable this set false or to supply a new index pass a string or an array in preferred order.

#### Inherited from

[SendOptions](SendOptions.md).[index](SendOptions.md#index)

#### Defined in

node_modules/@types/send/index.d.ts:76

___

### lastModified

 `Optional` **lastModified**: `boolean`

Enable or disable Last-Modified header, defaults to true.
Uses the file system's last modified value.

#### Inherited from

[SendOptions](SendOptions.md).[lastModified](SendOptions.md#lastmodified)

#### Defined in

node_modules/@types/send/index.d.ts:82

___

### maxAge

 `Optional` **maxAge**: `string` \| `number`

Provide a max-age in milliseconds for http caching, defaults to 0.
This can also be a string accepted by the ms module.

#### Inherited from

[SendOptions](SendOptions.md).[maxAge](SendOptions.md#maxage)

#### Defined in

node_modules/@types/send/index.d.ts:88

___

### root

 `Optional` **root**: `string`

Serve files relative to path.

#### Inherited from

[SendOptions](SendOptions.md).[root](SendOptions.md#root)

#### Defined in

node_modules/@types/send/index.d.ts:93

___

### start

 `Optional` **start**: `number`

Byte offset at which the stream starts, defaults to 0.
The start is inclusive, meaning start: 2 will include the 3rd byte in the stream.

#### Inherited from

[SendOptions](SendOptions.md).[start](SendOptions.md#start)

#### Defined in

node_modules/@types/send/index.d.ts:99
