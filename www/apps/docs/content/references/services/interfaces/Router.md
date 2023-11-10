# Router

## Hierarchy

- [`Router`](Router-1.md)

  ↳ **`Router`**

## Callable

### Router

**Router**(`req`, `res`, `next`): `void`

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

## Constructors

### constructor

 **constructor**: `object`

#### Inherited from

core.Router.constructor

## Properties

### all

 **all**: [`IRouterMatcher`](IRouterMatcher.md)<[`Router`](../index.md#router), ``"all"``\>

Special-cased "all" method, applying the given route `path`,
middleware, and callback to _every_ HTTP method.

#### Inherited from

[Router](Router-1.md).[all](Router-1.md#all)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:277

___

### checkout

 **checkout**: [`IRouterMatcher`](IRouterMatcher.md)<[`Router`](../index.md#router), `any`\>

#### Inherited from

[Router](Router-1.md).[checkout](Router-1.md#checkout)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:286

___

### connect

 **connect**: [`IRouterMatcher`](IRouterMatcher.md)<[`Router`](../index.md#router), `any`\>

#### Inherited from

[Router](Router-1.md).[connect](Router-1.md#connect)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:287

___

### copy

 **copy**: [`IRouterMatcher`](IRouterMatcher.md)<[`Router`](../index.md#router), `any`\>

#### Inherited from

[Router](Router-1.md).[copy](Router-1.md#copy)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:288

___

### delete

 **delete**: [`IRouterMatcher`](IRouterMatcher.md)<[`Router`](../index.md#router), ``"delete"``\>

#### Inherited from

[Router](Router-1.md).[delete](Router-1.md#delete)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:281

___

### get

 **get**: [`IRouterMatcher`](IRouterMatcher.md)<[`Router`](../index.md#router), ``"get"``\>

#### Inherited from

[Router](Router-1.md).[get](Router-1.md#get)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:278

___

### head

 **head**: [`IRouterMatcher`](IRouterMatcher.md)<[`Router`](../index.md#router), ``"head"``\>

#### Inherited from

[Router](Router-1.md).[head](Router-1.md#head)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:284

___

### link

 **link**: [`IRouterMatcher`](IRouterMatcher.md)<[`Router`](../index.md#router), `any`\>

#### Inherited from

[Router](Router-1.md).[link](Router-1.md#link)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:305

___

### lock

 **lock**: [`IRouterMatcher`](IRouterMatcher.md)<[`Router`](../index.md#router), `any`\>

#### Inherited from

[Router](Router-1.md).[lock](Router-1.md#lock)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:289

___

### m-search

 **m-search**: [`IRouterMatcher`](IRouterMatcher.md)<[`Router`](../index.md#router), `any`\>

#### Inherited from

[Router](Router-1.md).[m-search](Router-1.md#m-search)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:294

___

### merge

 **merge**: [`IRouterMatcher`](IRouterMatcher.md)<[`Router`](../index.md#router), `any`\>

#### Inherited from

[Router](Router-1.md).[merge](Router-1.md#merge)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:290

___

### mkactivity

 **mkactivity**: [`IRouterMatcher`](IRouterMatcher.md)<[`Router`](../index.md#router), `any`\>

#### Inherited from

[Router](Router-1.md).[mkactivity](Router-1.md#mkactivity)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:291

___

### mkcol

 **mkcol**: [`IRouterMatcher`](IRouterMatcher.md)<[`Router`](../index.md#router), `any`\>

#### Inherited from

[Router](Router-1.md).[mkcol](Router-1.md#mkcol)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:292

___

### move

 **move**: [`IRouterMatcher`](IRouterMatcher.md)<[`Router`](../index.md#router), `any`\>

#### Inherited from

[Router](Router-1.md).[move](Router-1.md#move)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:293

___

### notify

 **notify**: [`IRouterMatcher`](IRouterMatcher.md)<[`Router`](../index.md#router), `any`\>

#### Inherited from

[Router](Router-1.md).[notify](Router-1.md#notify)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:295

___

### options

 **options**: [`IRouterMatcher`](IRouterMatcher.md)<[`Router`](../index.md#router), ``"options"``\>

#### Inherited from

[Router](Router-1.md).[options](Router-1.md#options)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:283

___

### patch

 **patch**: [`IRouterMatcher`](IRouterMatcher.md)<[`Router`](../index.md#router), ``"patch"``\>

#### Inherited from

[Router](Router-1.md).[patch](Router-1.md#patch)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:282

___

### post

 **post**: [`IRouterMatcher`](IRouterMatcher.md)<[`Router`](../index.md#router), ``"post"``\>

#### Inherited from

[Router](Router-1.md).[post](Router-1.md#post)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:279

___

### propfind

 **propfind**: [`IRouterMatcher`](IRouterMatcher.md)<[`Router`](../index.md#router), `any`\>

#### Inherited from

[Router](Router-1.md).[propfind](Router-1.md#propfind)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:296

___

### proppatch

 **proppatch**: [`IRouterMatcher`](IRouterMatcher.md)<[`Router`](../index.md#router), `any`\>

#### Inherited from

[Router](Router-1.md).[proppatch](Router-1.md#proppatch)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:297

___

### purge

 **purge**: [`IRouterMatcher`](IRouterMatcher.md)<[`Router`](../index.md#router), `any`\>

#### Inherited from

[Router](Router-1.md).[purge](Router-1.md#purge)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:298

___

### put

 **put**: [`IRouterMatcher`](IRouterMatcher.md)<[`Router`](../index.md#router), ``"put"``\>

#### Inherited from

[Router](Router-1.md).[put](Router-1.md#put)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:280

___

### report

 **report**: [`IRouterMatcher`](IRouterMatcher.md)<[`Router`](../index.md#router), `any`\>

#### Inherited from

[Router](Router-1.md).[report](Router-1.md#report)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:299

___

### search

 **search**: [`IRouterMatcher`](IRouterMatcher.md)<[`Router`](../index.md#router), `any`\>

#### Inherited from

[Router](Router-1.md).[search](Router-1.md#search)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:300

___

### stack

 **stack**: `any`[]

Stack of configured routes

#### Inherited from

[Router](Router-1.md).[stack](Router-1.md#stack)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:315

___

### subscribe

 **subscribe**: [`IRouterMatcher`](IRouterMatcher.md)<[`Router`](../index.md#router), `any`\>

#### Inherited from

[Router](Router-1.md).[subscribe](Router-1.md#subscribe)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:301

___

### trace

 **trace**: [`IRouterMatcher`](IRouterMatcher.md)<[`Router`](../index.md#router), `any`\>

#### Inherited from

[Router](Router-1.md).[trace](Router-1.md#trace)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:302

___

### unlink

 **unlink**: [`IRouterMatcher`](IRouterMatcher.md)<[`Router`](../index.md#router), `any`\>

#### Inherited from

[Router](Router-1.md).[unlink](Router-1.md#unlink)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:306

___

### unlock

 **unlock**: [`IRouterMatcher`](IRouterMatcher.md)<[`Router`](../index.md#router), `any`\>

#### Inherited from

[Router](Router-1.md).[unlock](Router-1.md#unlock)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:303

___

### unsubscribe

 **unsubscribe**: [`IRouterMatcher`](IRouterMatcher.md)<[`Router`](../index.md#router), `any`\>

#### Inherited from

[Router](Router-1.md).[unsubscribe](Router-1.md#unsubscribe)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:304

___

### use

 **use**: [`IRouterHandler`](IRouterHandler.md)<[`Router`](../index.md#router), `string`\> & [`IRouterMatcher`](IRouterMatcher.md)<[`Router`](../index.md#router), `any`\>

#### Inherited from

[Router](Router-1.md).[use](Router-1.md#use)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:308

## Methods

### param

**param**(`name`, `handler`): [`Router`](../index.md#router)

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
| `name` | `string` |
| `handler` | [`RequestParamHandler`](../types/RequestParamHandler.md) |

#### Returns

[`Router`](../index.md#router)

-`Router`: 

#### Inherited from

[Router](Router-1.md).[param](Router-1.md#param)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:264

**param**(`callback`): [`Router`](../index.md#router)

Alternatively, you can pass only a callback, in which case you have the opportunity to alter the app.param()

#### Parameters

| Name |
| :------ |
| `callback` | (`name`: `string`, `matcher`: `RegExp`) => [`RequestParamHandler`](../types/RequestParamHandler.md) |

#### Returns

[`Router`](../index.md#router)

-`Router`: 

**Deprecated**

since version 4.11

#### Inherited from

[Router](Router-1.md).[param](Router-1.md#param)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:271

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

[Router](Router-1.md).[route](Router-1.md#route)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:310

**route**(`prefix`): [`IRoute`](IRoute.md)<`string`\>

#### Parameters

| Name |
| :------ |
| `prefix` | [`PathParams`](../types/PathParams.md) |

#### Returns

[`IRoute`](IRoute.md)<`string`\>

-`IRoute`: 
	-`string`: (optional) 

#### Inherited from

[Router](Router-1.md).[route](Router-1.md#route)

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:311
