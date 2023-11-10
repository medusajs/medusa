# Application

The `EventEmitter` class is defined and exposed by the `node:events` module:

```js
import { EventEmitter } from 'node:events';
```

All `EventEmitter`s emit the event `'newListener'` when new listeners are
added and `'removeListener'` when existing listeners are removed.

It supports the following option:

**Since**

v0.1.26

## Type parameters

| Name | Type |
| :------ | :------ |
| `LocalsObj` | Record<`string`, `any`\> |

## Hierarchy

- [`EventEmitter`](../classes/EventEmitter.md)

- [`IRouter`](IRouter.md)

- [`Application`](Application-1.md)

  ↳ **`Application`**

## Callable

### Application

**Application**(`req`, `res`): `any`

Express instance itself is a request handler, which could be invoked without
third argument.

#### Parameters

| Name |
| :------ |
| `req` | [`IncomingMessage`](../classes/IncomingMessage.md) \| [`Request`](Request-1.md)<[`ParamsDictionary`](ParamsDictionary.md), `any`, `any`, [`ParsedQs`](ParsedQs.md), Record<`string`, `any`\>\> |
| `res` | [`Response`](Response.md)<`any`, Record<`string`, `any`\>, `number`\> \| [`ServerResponse`](../classes/ServerResponse.md)<[`IncomingMessage`](../classes/IncomingMessage.md)\> |

#### Returns

`any`

-`any`: (optional) 

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:1081

### Application

**Application**(`req`, `res`, `next`): `void`

#### Parameters

| Name |
| :------ |
| `req` | [`Request`](Request-1.md)<[`ParamsDictionary`](ParamsDictionary.md), `any`, `any`, [`ParsedQs`](ParsedQs.md), Record<`string`, `any`\>\> |
| `res` | [`Response`](Response.md)<`any`, Record<`string`, `any`\>, `number`\> |
| `next` | [`NextFunction`](NextFunction.md) |

#### Returns

`void`

-`void`: (optional) 

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:71

## Properties

### \_router

 **\_router**: `any`

Used to get all registered routes in Express Application

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:1257

___

### all

 **all**: [`IRouterMatcher`](IRouterMatcher.md)<[`Application`](Application.md)<`LocalsObj`\>, ``"all"``\>

Special-cased "all" method, applying the given route `path`,
middleware, and callback to _every_ HTTP method.

#### Inherited from

[IRouter](IRouter.md).[all](IRouter.md#all)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:277

___

### checkout

 **checkout**: [`IRouterMatcher`](IRouterMatcher.md)<[`Application`](Application.md)<`LocalsObj`\>, `any`\>

#### Inherited from

[IRouter](IRouter.md).[checkout](IRouter.md#checkout)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:286

___

### connect

 **connect**: [`IRouterMatcher`](IRouterMatcher.md)<[`Application`](Application.md)<`LocalsObj`\>, `any`\>

#### Inherited from

[IRouter](IRouter.md).[connect](IRouter.md#connect)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:287

___

### copy

 **copy**: [`IRouterMatcher`](IRouterMatcher.md)<[`Application`](Application.md)<`LocalsObj`\>, `any`\>

#### Inherited from

[IRouter](IRouter.md).[copy](IRouter.md#copy)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:288

___

### delete

 **delete**: [`IRouterMatcher`](IRouterMatcher.md)<[`Application`](Application.md)<`LocalsObj`\>, ``"delete"``\>

#### Inherited from

[IRouter](IRouter.md).[delete](IRouter.md#delete)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:281

___

### get

 **get**: (`name`: `string`) => `any` & [`IRouterMatcher`](IRouterMatcher.md)<[`Application`](Application.md)<`LocalsObj`\>, `any`\>

#### Overrides

[IRouter](IRouter.md).[get](IRouter.md#get)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:1143

___

### head

 **head**: [`IRouterMatcher`](IRouterMatcher.md)<[`Application`](Application.md)<`LocalsObj`\>, ``"head"``\>

#### Inherited from

[IRouter](IRouter.md).[head](IRouter.md#head)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:284

___

### link

 **link**: [`IRouterMatcher`](IRouterMatcher.md)<[`Application`](Application.md)<`LocalsObj`\>, `any`\>

#### Inherited from

[IRouter](IRouter.md).[link](IRouter.md#link)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:305

___

### locals

 **locals**: `LocalsObj` & [`Locals`](Locals.md)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:1242

___

### lock

 **lock**: [`IRouterMatcher`](IRouterMatcher.md)<[`Application`](Application.md)<`LocalsObj`\>, `any`\>

#### Inherited from

[IRouter](IRouter.md).[lock](IRouter.md#lock)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:289

___

### m-search

 **m-search**: [`IRouterMatcher`](IRouterMatcher.md)<[`Application`](Application.md)<`LocalsObj`\>, `any`\>

#### Inherited from

[IRouter](IRouter.md).[m-search](IRouter.md#m-search)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:294

___

### map

 **map**: `any`

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:1240

___

### merge

 **merge**: [`IRouterMatcher`](IRouterMatcher.md)<[`Application`](Application.md)<`LocalsObj`\>, `any`\>

#### Inherited from

[IRouter](IRouter.md).[merge](IRouter.md#merge)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:290

___

### mkactivity

 **mkactivity**: [`IRouterMatcher`](IRouterMatcher.md)<[`Application`](Application.md)<`LocalsObj`\>, `any`\>

#### Inherited from

[IRouter](IRouter.md).[mkactivity](IRouter.md#mkactivity)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:291

___

### mkcol

 **mkcol**: [`IRouterMatcher`](IRouterMatcher.md)<[`Application`](Application.md)<`LocalsObj`\>, `any`\>

#### Inherited from

[IRouter](IRouter.md).[mkcol](IRouter.md#mkcol)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:292

___

### mountpath

 **mountpath**: `string` \| `string`[]

The app.mountpath property contains one or more path patterns on which a sub-app was mounted.

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:1275

___

### move

 **move**: [`IRouterMatcher`](IRouterMatcher.md)<[`Application`](Application.md)<`LocalsObj`\>, `any`\>

#### Inherited from

[IRouter](IRouter.md).[move](IRouter.md#move)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:293

___

### notify

 **notify**: [`IRouterMatcher`](IRouterMatcher.md)<[`Application`](Application.md)<`LocalsObj`\>, `any`\>

#### Inherited from

[IRouter](IRouter.md).[notify](IRouter.md#notify)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:295

___

### on

 **on**: (`event`: `string`, `callback`: (`parent`: [`Application`](Application.md)<Record<`string`, `any`\>\>) => `void`) => [`Application`](Application.md)<`LocalsObj`\>

#### Type declaration

(`event`, `callback`): [`Application`](Application.md)<`LocalsObj`\>

The mount event is fired on a sub-app, when it is mounted on a parent app.
The parent app is passed to the callback function.

NOTE:
Sub-apps will:
 - Not inherit the value of settings that have a default value. You must set the value in the sub-app.
 - Inherit the value of settings with no default value.

##### Parameters

| Name |
| :------ |
| `event` | `string` |
| `callback` | (`parent`: [`Application`](Application.md)<Record<`string`, `any`\>\>) => `void` |

##### Returns

[`Application`](Application.md)<`LocalsObj`\>

-`Application`: 

#### Overrides

[EventEmitter](../classes/EventEmitter.md).[on](../classes/EventEmitter.md#on)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:1270

___

### options

 **options**: [`IRouterMatcher`](IRouterMatcher.md)<[`Application`](Application.md)<`LocalsObj`\>, ``"options"``\>

#### Inherited from

[IRouter](IRouter.md).[options](IRouter.md#options)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:283

___

### patch

 **patch**: [`IRouterMatcher`](IRouterMatcher.md)<[`Application`](Application.md)<`LocalsObj`\>, ``"patch"``\>

#### Inherited from

[IRouter](IRouter.md).[patch](IRouter.md#patch)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:282

___

### post

 **post**: [`IRouterMatcher`](IRouterMatcher.md)<[`Application`](Application.md)<`LocalsObj`\>, ``"post"``\>

#### Inherited from

[IRouter](IRouter.md).[post](IRouter.md#post)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:279

___

### propfind

 **propfind**: [`IRouterMatcher`](IRouterMatcher.md)<[`Application`](Application.md)<`LocalsObj`\>, `any`\>

#### Inherited from

[IRouter](IRouter.md).[propfind](IRouter.md#propfind)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:296

___

### proppatch

 **proppatch**: [`IRouterMatcher`](IRouterMatcher.md)<[`Application`](Application.md)<`LocalsObj`\>, `any`\>

#### Inherited from

[IRouter](IRouter.md).[proppatch](IRouter.md#proppatch)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:297

___

### purge

 **purge**: [`IRouterMatcher`](IRouterMatcher.md)<[`Application`](Application.md)<`LocalsObj`\>, `any`\>

#### Inherited from

[IRouter](IRouter.md).[purge](IRouter.md#purge)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:298

___

### put

 **put**: [`IRouterMatcher`](IRouterMatcher.md)<[`Application`](Application.md)<`LocalsObj`\>, ``"put"``\>

#### Inherited from

[IRouter](IRouter.md).[put](IRouter.md#put)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:280

___

### report

 **report**: [`IRouterMatcher`](IRouterMatcher.md)<[`Application`](Application.md)<`LocalsObj`\>, `any`\>

#### Inherited from

[IRouter](IRouter.md).[report](IRouter.md#report)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:299

___

### resource

 **resource**: `any`

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:1238

___

### router

 **router**: `string`

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:1234

___

### routes

 **routes**: `any`

The app.routes object houses all of the routes defined mapped by the
associated HTTP verb. This object may be used for introspection
capabilities, for example Express uses this internally not only for
routing but to provide default OPTIONS behaviour unless app.options()
is used. Your application or framework may also remove routes by
simply by removing them from this object.

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:1252

___

### search

 **search**: [`IRouterMatcher`](IRouterMatcher.md)<[`Application`](Application.md)<`LocalsObj`\>, `any`\>

#### Inherited from

[IRouter](IRouter.md).[search](IRouter.md#search)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:300

___

### settings

 **settings**: `any`

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:1236

___

### stack

 **stack**: `any`[]

Stack of configured routes

#### Inherited from

[IRouter](IRouter.md).[stack](IRouter.md#stack)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:315

___

### subscribe

 **subscribe**: [`IRouterMatcher`](IRouterMatcher.md)<[`Application`](Application.md)<`LocalsObj`\>, `any`\>

#### Inherited from

[IRouter](IRouter.md).[subscribe](IRouter.md#subscribe)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:301

___

### trace

 **trace**: [`IRouterMatcher`](IRouterMatcher.md)<[`Application`](Application.md)<`LocalsObj`\>, `any`\>

#### Inherited from

[IRouter](IRouter.md).[trace](IRouter.md#trace)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:302

___

### unlink

 **unlink**: [`IRouterMatcher`](IRouterMatcher.md)<[`Application`](Application.md)<`LocalsObj`\>, `any`\>

#### Inherited from

[IRouter](IRouter.md).[unlink](IRouter.md#unlink)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:306

___

### unlock

 **unlock**: [`IRouterMatcher`](IRouterMatcher.md)<[`Application`](Application.md)<`LocalsObj`\>, `any`\>

#### Inherited from

[IRouter](IRouter.md).[unlock](IRouter.md#unlock)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:303

___

### unsubscribe

 **unsubscribe**: [`IRouterMatcher`](IRouterMatcher.md)<[`Application`](Application.md)<`LocalsObj`\>, `any`\>

#### Inherited from

[IRouter](IRouter.md).[unsubscribe](IRouter.md#unsubscribe)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:304

___

### use

 **use**: [`ApplicationRequestHandler`](../index.md#applicationrequesthandler)<[`Application`](Application.md)<`LocalsObj`\>\>

#### Overrides

[IRouter](IRouter.md).[use](IRouter.md#use)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:1259

## Methods

### [captureRejectionSymbol]

`Optional` **[captureRejectionSymbol]**(`error`, `event`, `...args`): `void`

#### Parameters

| Name |
| :------ |
| `error` | `Error` |
| `event` | `string` |
| `...args` | `any`[] |

#### Returns

`void`

-`void`: (optional) 

#### Inherited from

[EventEmitter](../classes/EventEmitter.md).[[captureRejectionSymbol]](../classes/EventEmitter.md#[capturerejectionsymbol])

#### Defined in

docs-util/node_modules/@types/node/events.d.ts:112

___

### addListener

**addListener**(`eventName`, `listener`): [`Application`](Application.md)<`LocalsObj`\>

Alias for `emitter.on(eventName, listener)`.

#### Parameters

| Name |
| :------ |
| `eventName` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`Application`](Application.md)<`LocalsObj`\>

-`Application`: 

**Since**

v0.1.26

#### Inherited from

[EventEmitter](../classes/EventEmitter.md).[addListener](../classes/EventEmitter.md#addlistener)

#### Defined in

docs-util/node_modules/@types/node/events.d.ts:510

___

### defaultConfiguration

**defaultConfiguration**(): `void`

Initialize application configuration.

#### Returns

`void`

-`void`: (optional) 

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:1095

___

### disable

**disable**(`setting`): [`Application`](Application.md)<`LocalsObj`\>

Disable `setting`.

#### Parameters

| Name |
| :------ |
| `setting` | `string` |

#### Returns

[`Application`](Application.md)<`LocalsObj`\>

-`Application`: 

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:1194

___

### disabled

**disabled**(`setting`): `boolean`

Check if `setting` is disabled.

   app.disabled('foo')
   // => true

   app.enable('foo')
   app.disabled('foo')
   // => false

#### Parameters

| Name |
| :------ |
| `setting` | `string` |

#### Returns

`boolean`

-`boolean`: (optional) 

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:1188

___

### emit

**emit**(`eventName`, `...args`): `boolean`

Synchronously calls each of the listeners registered for the event named`eventName`, in the order they were registered, passing the supplied arguments
to each.

Returns `true` if the event had listeners, `false` otherwise.

```js
import { EventEmitter } from 'node:events';
const myEmitter = new EventEmitter();

// First listener
myEmitter.on('event', function firstListener() {
  console.log('Helloooo! first listener');
});
// Second listener
myEmitter.on('event', function secondListener(arg1, arg2) {
  console.log(`event with parameters ${arg1}, ${arg2} in second listener`);
});
// Third listener
myEmitter.on('event', function thirdListener(...args) {
  const parameters = args.join(', ');
  console.log(`event with parameters ${parameters} in third listener`);
});

console.log(myEmitter.listeners('event'));

myEmitter.emit('event', 1, 2, 3, 4, 5);

// Prints:
// [
//   [Function: firstListener],
//   [Function: secondListener],
//   [Function: thirdListener]
// ]
// Helloooo! first listener
// event with parameters 1, 2 in second listener
// event with parameters 1, 2, 3, 4, 5 in third listener
```

#### Parameters

| Name |
| :------ |
| `eventName` | `string` \| `symbol` |
| `...args` | `any`[] |

#### Returns

`boolean`

-`boolean`: (optional) 

**Since**

v0.1.26

#### Inherited from

[EventEmitter](../classes/EventEmitter.md).[emit](../classes/EventEmitter.md#emit)

#### Defined in

docs-util/node_modules/@types/node/events.d.ts:772

___

### enable

**enable**(`setting`): [`Application`](Application.md)<`LocalsObj`\>

Enable `setting`.

#### Parameters

| Name |
| :------ |
| `setting` | `string` |

#### Returns

[`Application`](Application.md)<`LocalsObj`\>

-`Application`: 

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:1191

___

### enabled

**enabled**(`setting`): `boolean`

Check if `setting` is enabled (truthy).

   app.enabled('foo')
   // => false

   app.enable('foo')
   app.enabled('foo')
   // => true

#### Parameters

| Name |
| :------ |
| `setting` | `string` |

#### Returns

`boolean`

-`boolean`: (optional) 

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:1176

___

### engine

**engine**(`ext`, `fn`): [`Application`](Application.md)<`LocalsObj`\>

Register the given template engine callback `fn`
as `ext`.

By default will `require()` the engine based on the
file extension. For example if you try to render
a "foo.jade" file Express will invoke the following internally:

    app.engine('jade', require('jade').__express);

For engines that do not provide `.__express` out of the box,
or if you wish to "map" a different extension to the template engine
you may use this method. For example mapping the EJS template engine to
".html" files:

    app.engine('html', require('ejs').renderFile);

In this case EJS provides a `.renderFile()` method with
the same signature that Express expects: `(path, options, callback)`,
though note that it aliases this method as `ejs.__express` internally
so if you're using ".ejs" extensions you dont need to do anything.

Some template engines do not follow this convention, the
[Consolidate.js](https://github.com/visionmedia/consolidate.js)
library was created to map all of node's popular template
engines to follow this convention, thus allowing them to
work seamlessly within Express.

#### Parameters

| Name |
| :------ |
| `ext` | `string` |
| `fn` | (`path`: `string`, `options`: `object`, `callback`: (`e`: `any`, `rendered?`: `string`) => `void`) => `void` |

#### Returns

[`Application`](Application.md)<`LocalsObj`\>

-`Application`: 

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:1125

___

### eventNames

**eventNames**(): (`string` \| `symbol`)[]

Returns an array listing the events for which the emitter has registered
listeners. The values in the array are strings or `Symbol`s.

```js
import { EventEmitter } from 'node:events';

const myEE = new EventEmitter();
myEE.on('foo', () => {});
myEE.on('bar', () => {});

const sym = Symbol('symbol');
myEE.on(sym, () => {});

console.log(myEE.eventNames());
// Prints: [ 'foo', 'bar', Symbol(symbol) ]
```

#### Returns

(`string` \| `symbol`)[]

-`(string \| symbol)[]`: 
	-`string \| symbol`: (optional) 

**Since**

v6.0.0

#### Inherited from

[EventEmitter](../classes/EventEmitter.md).[eventNames](../classes/EventEmitter.md#eventnames)

#### Defined in

docs-util/node_modules/@types/node/events.d.ts:835

___

### getMaxListeners

**getMaxListeners**(): `number`

Returns the current max listener value for the `EventEmitter` which is either
set by `emitter.setMaxListeners(n)` or defaults to defaultMaxListeners.

#### Returns

`number`

-`number`: (optional) 

**Since**

v1.0.0

#### Inherited from

[EventEmitter](../classes/EventEmitter.md).[getMaxListeners](../classes/EventEmitter.md#getmaxlisteners)

#### Defined in

docs-util/node_modules/@types/node/events.d.ts:687

___

### init

**init**(): `void`

Initialize the server.

  - setup default configuration
  - setup default middleware
  - setup route reflection methods

#### Returns

`void`

-`void`: (optional) 

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:1090

___

### listen

**listen**(`port`, `hostname`, `backlog`, `callback?`): [`Server`](../classes/Server.md)<typeof [`IncomingMessage`](../classes/IncomingMessage.md), typeof [`ServerResponse`](../classes/ServerResponse.md)\>

Listen for connections.

A node `http.Server` is returned, with this
application (which is a `Function`) as its
callback. If you wish to create both an HTTP
and HTTPS server you may do so with the "http"
and "https" modules as shown here:

   var http = require('http')
     , https = require('https')
     , express = require('express')
     , app = express();

   http.createServer(app).listen(80);
   https.createServer({ ... }, app).listen(443);

#### Parameters

| Name |
| :------ |
| `port` | `number` |
| `hostname` | `string` |
| `backlog` | `number` |
| `callback?` | () => `void` |

#### Returns

[`Server`](../classes/Server.md)<typeof [`IncomingMessage`](../classes/IncomingMessage.md), typeof [`ServerResponse`](../classes/ServerResponse.md)\>

-`Server`: 
	-`typeof [`IncomingMessage`](../classes/IncomingMessage.md)`: (optional) 
	-`typeof [`ServerResponse`](../classes/ServerResponse.md)`: (optional) 

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:1227

**listen**(`port`, `hostname`, `callback?`): [`Server`](../classes/Server.md)<typeof [`IncomingMessage`](../classes/IncomingMessage.md), typeof [`ServerResponse`](../classes/ServerResponse.md)\>

#### Parameters

| Name |
| :------ |
| `port` | `number` |
| `hostname` | `string` |
| `callback?` | () => `void` |

#### Returns

[`Server`](../classes/Server.md)<typeof [`IncomingMessage`](../classes/IncomingMessage.md), typeof [`ServerResponse`](../classes/ServerResponse.md)\>

-`Server`: 
	-`typeof [`IncomingMessage`](../classes/IncomingMessage.md)`: (optional) 
	-`typeof [`ServerResponse`](../classes/ServerResponse.md)`: (optional) 

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:1228

**listen**(`port`, `callback?`): [`Server`](../classes/Server.md)<typeof [`IncomingMessage`](../classes/IncomingMessage.md), typeof [`ServerResponse`](../classes/ServerResponse.md)\>

#### Parameters

| Name |
| :------ |
| `port` | `number` |
| `callback?` | () => `void` |

#### Returns

[`Server`](../classes/Server.md)<typeof [`IncomingMessage`](../classes/IncomingMessage.md), typeof [`ServerResponse`](../classes/ServerResponse.md)\>

-`Server`: 
	-`typeof [`IncomingMessage`](../classes/IncomingMessage.md)`: (optional) 
	-`typeof [`ServerResponse`](../classes/ServerResponse.md)`: (optional) 

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:1229

**listen**(`callback?`): [`Server`](../classes/Server.md)<typeof [`IncomingMessage`](../classes/IncomingMessage.md), typeof [`ServerResponse`](../classes/ServerResponse.md)\>

#### Parameters

| Name |
| :------ |
| `callback?` | () => `void` |

#### Returns

[`Server`](../classes/Server.md)<typeof [`IncomingMessage`](../classes/IncomingMessage.md), typeof [`ServerResponse`](../classes/ServerResponse.md)\>

-`Server`: 
	-`typeof [`IncomingMessage`](../classes/IncomingMessage.md)`: (optional) 
	-`typeof [`ServerResponse`](../classes/ServerResponse.md)`: (optional) 

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:1230

**listen**(`path`, `callback?`): [`Server`](../classes/Server.md)<typeof [`IncomingMessage`](../classes/IncomingMessage.md), typeof [`ServerResponse`](../classes/ServerResponse.md)\>

#### Parameters

| Name |
| :------ |
| `path` | `string` |
| `callback?` | () => `void` |

#### Returns

[`Server`](../classes/Server.md)<typeof [`IncomingMessage`](../classes/IncomingMessage.md), typeof [`ServerResponse`](../classes/ServerResponse.md)\>

-`Server`: 
	-`typeof [`IncomingMessage`](../classes/IncomingMessage.md)`: (optional) 
	-`typeof [`ServerResponse`](../classes/ServerResponse.md)`: (optional) 

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:1231

**listen**(`handle`, `listeningListener?`): [`Server`](../classes/Server.md)<typeof [`IncomingMessage`](../classes/IncomingMessage.md), typeof [`ServerResponse`](../classes/ServerResponse.md)\>

#### Parameters

| Name |
| :------ |
| `handle` | `any` |
| `listeningListener?` | () => `void` |

#### Returns

[`Server`](../classes/Server.md)<typeof [`IncomingMessage`](../classes/IncomingMessage.md), typeof [`ServerResponse`](../classes/ServerResponse.md)\>

-`Server`: 
	-`typeof [`IncomingMessage`](../classes/IncomingMessage.md)`: (optional) 
	-`typeof [`ServerResponse`](../classes/ServerResponse.md)`: (optional) 

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:1232

___

### listenerCount

**listenerCount**(`eventName`, `listener?`): `number`

Returns the number of listeners listening for the event named `eventName`.
If `listener` is provided, it will return how many times the listener is found
in the list of the listeners of the event.

#### Parameters

| Name | Description |
| :------ | :------ |
| `eventName` | `string` \| `symbol` | The name of the event being listened for |
| `listener?` | `Function` | The event handler function |

#### Returns

`number`

-`number`: (optional) 

**Since**

v3.2.0

#### Inherited from

[EventEmitter](../classes/EventEmitter.md).[listenerCount](../classes/EventEmitter.md#listenercount)

#### Defined in

docs-util/node_modules/@types/node/events.d.ts:781

___

### listeners

**listeners**(`eventName`): `Function`[]

Returns a copy of the array of listeners for the event named `eventName`.

```js
server.on('connection', (stream) => {
  console.log('someone connected!');
});
console.log(util.inspect(server.listeners('connection')));
// Prints: [ [Function] ]
```

#### Parameters

| Name |
| :------ |
| `eventName` | `string` \| `symbol` |

#### Returns

`Function`[]

-`Function[]`: 

**Since**

v0.1.26

#### Inherited from

[EventEmitter](../classes/EventEmitter.md).[listeners](../classes/EventEmitter.md#listeners)

#### Defined in

docs-util/node_modules/@types/node/events.d.ts:700

___

### off

**off**(`eventName`, `listener`): [`Application`](Application.md)<`LocalsObj`\>

Alias for `emitter.removeListener()`.

#### Parameters

| Name |
| :------ |
| `eventName` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`Application`](Application.md)<`LocalsObj`\>

-`Application`: 

**Since**

v10.0.0

#### Inherited from

[EventEmitter](../classes/EventEmitter.md).[off](../classes/EventEmitter.md#off)

#### Defined in

docs-util/node_modules/@types/node/events.d.ts:660

___

### once

**once**(`eventName`, `listener`): [`Application`](Application.md)<`LocalsObj`\>

Adds a **one-time**`listener` function for the event named `eventName`. The
next time `eventName` is triggered, this listener is removed and then invoked.

```js
server.once('connection', (stream) => {
  console.log('Ah, we have our first user!');
});
```

Returns a reference to the `EventEmitter`, so that calls can be chained.

By default, event listeners are invoked in the order they are added. The`emitter.prependOnceListener()` method can be used as an alternative to add the
event listener to the beginning of the listeners array.

```js
import { EventEmitter } from 'node:events';
const myEE = new EventEmitter();
myEE.once('foo', () => console.log('a'));
myEE.prependOnceListener('foo', () => console.log('b'));
myEE.emit('foo');
// Prints:
//   b
//   a
```

#### Parameters

| Name | Description |
| :------ | :------ |
| `eventName` | `string` \| `symbol` | The name of the event. |
| `listener` | (...`args`: `any`[]) => `void` | The callback function |

#### Returns

[`Application`](Application.md)<`LocalsObj`\>

-`Application`: 

**Since**

v0.3.0

#### Inherited from

[EventEmitter](../classes/EventEmitter.md).[once](../classes/EventEmitter.md#once)

#### Defined in

docs-util/node_modules/@types/node/events.d.ts:572

___

### param

**param**(`name`, `handler`): [`Application`](Application.md)<`LocalsObj`\>

Map the given param placeholder `name`(s) to the given callback(s).

Parameter mapping is used to provide pre-conditions to routes
which use normalized placeholders. For example a _:user_id_ parameter
could automatically load a user's information from the database without
any additional code,

The callback uses the samesignature as middleware, the only differencing
being that the value of the placeholder is passed, in this case the _id_
of the user. Once the `next()` function is invoked, just like middleware
it will continue on to execute the route, or subsequent parameter functions.

     app.param('user_id', function(req, res, next, id){
       User.find(id, function(err, user){
         if (err) {
           next(err);
         } else if (user) {
           req.user = user;
           next();
         } else {
           next(new Error('failed to load user'));
         }
       });
     });

#### Parameters

| Name |
| :------ |
| `name` | `string` \| `string`[] |
| `handler` | [`RequestParamHandler`](../index.md#requestparamhandler) |

#### Returns

[`Application`](Application.md)<`LocalsObj`\>

-`Application`: 

#### Overrides

[IRouter](IRouter.md).[param](IRouter.md#param)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:1145

**param**(`callback`): [`Application`](Application.md)<`LocalsObj`\>

Alternatively, you can pass only a callback, in which case you have the opportunity to alter the app.param()

#### Parameters

| Name |
| :------ |
| `callback` | (`name`: `string`, `matcher`: `RegExp`) => [`RequestParamHandler`](../index.md#requestparamhandler) |

#### Returns

[`Application`](Application.md)<`LocalsObj`\>

-`Application`: 

**Deprecated**

since version 4.11

#### Overrides

[IRouter](IRouter.md).[param](IRouter.md#param)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:1152

___

### path

**path**(): `string`

Return the app's absolute pathname
based on the parent(s) that have
mounted it.

For example if the application was
mounted as "/admin", which itself
was mounted as "/blog" then the
return value would be "/blog/admin".

#### Returns

`string`

-`string`: (optional) 

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:1164

___

### prependListener

**prependListener**(`eventName`, `listener`): [`Application`](Application.md)<`LocalsObj`\>

Adds the `listener` function to the _beginning_ of the listeners array for the
event named `eventName`. No checks are made to see if the `listener` has
already been added. Multiple calls passing the same combination of `eventName`and `listener` will result in the `listener` being added, and called, multiple
times.

```js
server.prependListener('connection', (stream) => {
  console.log('someone connected!');
});
```

Returns a reference to the `EventEmitter`, so that calls can be chained.

#### Parameters

| Name | Description |
| :------ | :------ |
| `eventName` | `string` \| `symbol` | The name of the event. |
| `listener` | (...`args`: `any`[]) => `void` | The callback function |

#### Returns

[`Application`](Application.md)<`LocalsObj`\>

-`Application`: 

**Since**

v6.0.0

#### Inherited from

[EventEmitter](../classes/EventEmitter.md).[prependListener](../classes/EventEmitter.md#prependlistener)

#### Defined in

docs-util/node_modules/@types/node/events.d.ts:799

___

### prependOnceListener

**prependOnceListener**(`eventName`, `listener`): [`Application`](Application.md)<`LocalsObj`\>

Adds a **one-time**`listener` function for the event named `eventName` to the _beginning_ of the listeners array. The next time `eventName` is triggered, this
listener is removed, and then invoked.

```js
server.prependOnceListener('connection', (stream) => {
  console.log('Ah, we have our first user!');
});
```

Returns a reference to the `EventEmitter`, so that calls can be chained.

#### Parameters

| Name | Description |
| :------ | :------ |
| `eventName` | `string` \| `symbol` | The name of the event. |
| `listener` | (...`args`: `any`[]) => `void` | The callback function |

#### Returns

[`Application`](Application.md)<`LocalsObj`\>

-`Application`: 

**Since**

v6.0.0

#### Inherited from

[EventEmitter](../classes/EventEmitter.md).[prependOnceListener](../classes/EventEmitter.md#prependoncelistener)

#### Defined in

docs-util/node_modules/@types/node/events.d.ts:815

___

### rawListeners

**rawListeners**(`eventName`): `Function`[]

Returns a copy of the array of listeners for the event named `eventName`,
including any wrappers (such as those created by `.once()`).

```js
import { EventEmitter } from 'node:events';
const emitter = new EventEmitter();
emitter.once('log', () => console.log('log once'));

// Returns a new Array with a function `onceWrapper` which has a property
// `listener` which contains the original listener bound above
const listeners = emitter.rawListeners('log');
const logFnWrapper = listeners[0];

// Logs "log once" to the console and does not unbind the `once` event
logFnWrapper.listener();

// Logs "log once" to the console and removes the listener
logFnWrapper();

emitter.on('log', () => console.log('log persistently'));
// Will return a new Array with a single function bound by `.on()` above
const newListeners = emitter.rawListeners('log');

// Logs "log persistently" twice
newListeners[0]();
emitter.emit('log');
```

#### Parameters

| Name |
| :------ |
| `eventName` | `string` \| `symbol` |

#### Returns

`Function`[]

-`Function[]`: 

**Since**

v9.4.0

#### Inherited from

[EventEmitter](../classes/EventEmitter.md).[rawListeners](../classes/EventEmitter.md#rawlisteners)

#### Defined in

docs-util/node_modules/@types/node/events.d.ts:731

___

### removeAllListeners

**removeAllListeners**(`event?`): [`Application`](Application.md)<`LocalsObj`\>

Removes all listeners, or those of the specified `eventName`.

It is bad practice to remove listeners added elsewhere in the code,
particularly when the `EventEmitter` instance was created by some other
component or module (e.g. sockets or file streams).

Returns a reference to the `EventEmitter`, so that calls can be chained.

#### Parameters

| Name |
| :------ |
| `event?` | `string` \| `symbol` |

#### Returns

[`Application`](Application.md)<`LocalsObj`\>

-`Application`: 

**Since**

v0.1.26

#### Inherited from

[EventEmitter](../classes/EventEmitter.md).[removeAllListeners](../classes/EventEmitter.md#removealllisteners)

#### Defined in

docs-util/node_modules/@types/node/events.d.ts:671

___

### removeListener

**removeListener**(`eventName`, `listener`): [`Application`](Application.md)<`LocalsObj`\>

Removes the specified `listener` from the listener array for the event named`eventName`.

```js
const callback = (stream) => {
  console.log('someone connected!');
};
server.on('connection', callback);
// ...
server.removeListener('connection', callback);
```

`removeListener()` will remove, at most, one instance of a listener from the
listener array. If any single listener has been added multiple times to the
listener array for the specified `eventName`, then `removeListener()` must be
called multiple times to remove each instance.

Once an event is emitted, all listeners attached to it at the
time of emitting are called in order. This implies that any`removeListener()` or `removeAllListeners()` calls _after_ emitting and _before_ the last listener finishes execution
will not remove them from`emit()` in progress. Subsequent events behave as expected.

```js
import { EventEmitter } from 'node:events';
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

const callbackA = () => {
  console.log('A');
  myEmitter.removeListener('event', callbackB);
};

const callbackB = () => {
  console.log('B');
};

myEmitter.on('event', callbackA);

myEmitter.on('event', callbackB);

// callbackA removes listener callbackB but it will still be called.
// Internal listener array at time of emit [callbackA, callbackB]
myEmitter.emit('event');
// Prints:
//   A
//   B

// callbackB is now removed.
// Internal listener array [callbackA]
myEmitter.emit('event');
// Prints:
//   A
```

Because listeners are managed using an internal array, calling this will
change the position indices of any listener registered _after_ the listener
being removed. This will not impact the order in which listeners are called,
but it means that any copies of the listener array as returned by
the `emitter.listeners()` method will need to be recreated.

When a single function has been added as a handler multiple times for a single
event (as in the example below), `removeListener()` will remove the most
recently added instance. In the example the `once('ping')`listener is removed:

```js
import { EventEmitter } from 'node:events';
const ee = new EventEmitter();

function pong() {
  console.log('pong');
}

ee.on('ping', pong);
ee.once('ping', pong);
ee.removeListener('ping', pong);

ee.emit('ping');
ee.emit('ping');
```

Returns a reference to the `EventEmitter`, so that calls can be chained.

#### Parameters

| Name |
| :------ |
| `eventName` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`Application`](Application.md)<`LocalsObj`\>

-`Application`: 

**Since**

v0.1.26

#### Inherited from

[EventEmitter](../classes/EventEmitter.md).[removeListener](../classes/EventEmitter.md#removelistener)

#### Defined in

docs-util/node_modules/@types/node/events.d.ts:655

___

### render

**render**(`name`, `options?`, `callback?`): `void`

Render the given view `name` name with `options`
and a callback accepting an error and the
rendered template string.

Example:

   app.render('email', { name: 'Tobi' }, function(err, html){
     // ...
   })

#### Parameters

| Name |
| :------ |
| `name` | `string` |
| `options?` | `object` |
| `callback?` | (`err`: `Error`, `html`: `string`) => `void` |

#### Returns

`void`

-`void`: (optional) 

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:1207

**render**(`name`, `callback`): `void`

#### Parameters

| Name |
| :------ |
| `name` | `string` |
| `callback` | (`err`: `Error`, `html`: `string`) => `void` |

#### Returns

`void`

-`void`: (optional) 

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:1208

___

### route

**route**<`T`\>(`prefix`): [`IRoute`](IRoute.md)<`T`\>

| Name | Type |
| :------ | :------ |
| `T` | `string` |

#### Parameters

| Name |
| :------ |
| `prefix` | `T` |

#### Returns

[`IRoute`](IRoute.md)<`T`\>

-`IRoute`: 

#### Inherited from

[IRouter](IRouter.md).[route](IRouter.md#route)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:310

**route**(`prefix`): [`IRoute`](IRoute.md)<`string`\>

#### Parameters

| Name |
| :------ |
| `prefix` | [`PathParams`](../index.md#pathparams) |

#### Returns

[`IRoute`](IRoute.md)<`string`\>

-`IRoute`: 
	-`string`: (optional) 

#### Inherited from

[IRouter](IRouter.md).[route](IRouter.md#route)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:311

___

### set

**set**(`setting`, `val`): [`Application`](Application.md)<`LocalsObj`\>

Assign `setting` to `val`, or return `setting`'s value.

   app.set('foo', 'bar');
   app.get('foo');
   // => "bar"
   app.set('foo', ['bar', 'baz']);
   app.get('foo');
   // => ["bar", "baz"]

Mounted servers inherit their parent server's settings.

#### Parameters

| Name |
| :------ |
| `setting` | `string` |
| `val` | `any` |

#### Returns

[`Application`](Application.md)<`LocalsObj`\>

-`Application`: 

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:1142

___

### setMaxListeners

**setMaxListeners**(`n`): [`Application`](Application.md)<`LocalsObj`\>

By default `EventEmitter`s will print a warning if more than `10` listeners are
added for a particular event. This is a useful default that helps finding
memory leaks. The `emitter.setMaxListeners()` method allows the limit to be
modified for this specific `EventEmitter` instance. The value can be set to`Infinity` (or `0`) to indicate an unlimited number of listeners.

Returns a reference to the `EventEmitter`, so that calls can be chained.

#### Parameters

| Name |
| :------ |
| `n` | `number` |

#### Returns

[`Application`](Application.md)<`LocalsObj`\>

-`Application`: 

**Since**

v0.3.5

#### Inherited from

[EventEmitter](../classes/EventEmitter.md).[setMaxListeners](../classes/EventEmitter.md#setmaxlisteners)

#### Defined in

docs-util/node_modules/@types/node/events.d.ts:681
