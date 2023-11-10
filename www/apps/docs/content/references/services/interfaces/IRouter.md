# IRouter

## Hierarchy

- [`RequestHandler`](RequestHandler-1.md)

  ↳ **`IRouter`**

  ↳↳ [`Application`](Application.md)

  ↳↳ [`Router`](Router-1.md)

## Callable

### IRouter

**IRouter**(`req`, `res`, `next`): `void`

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

### all

 **all**: [`IRouterMatcher`](IRouterMatcher.md)<[`IRouter`](IRouter.md), ``"all"``\>

Special-cased "all" method, applying the given route `path`,
middleware, and callback to _every_ HTTP method.

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:277

___

### checkout

 **checkout**: [`IRouterMatcher`](IRouterMatcher.md)<[`IRouter`](IRouter.md), `any`\>

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:286

___

### connect

 **connect**: [`IRouterMatcher`](IRouterMatcher.md)<[`IRouter`](IRouter.md), `any`\>

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:287

___

### copy

 **copy**: [`IRouterMatcher`](IRouterMatcher.md)<[`IRouter`](IRouter.md), `any`\>

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:288

___

### delete

 **delete**: [`IRouterMatcher`](IRouterMatcher.md)<[`IRouter`](IRouter.md), ``"delete"``\>

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:281

___

### get

 **get**: [`IRouterMatcher`](IRouterMatcher.md)<[`IRouter`](IRouter.md), ``"get"``\>

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:278

___

### head

 **head**: [`IRouterMatcher`](IRouterMatcher.md)<[`IRouter`](IRouter.md), ``"head"``\>

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:284

___

### link

 **link**: [`IRouterMatcher`](IRouterMatcher.md)<[`IRouter`](IRouter.md), `any`\>

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:305

___

### lock

 **lock**: [`IRouterMatcher`](IRouterMatcher.md)<[`IRouter`](IRouter.md), `any`\>

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:289

___

### m-search

 **m-search**: [`IRouterMatcher`](IRouterMatcher.md)<[`IRouter`](IRouter.md), `any`\>

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:294

___

### merge

 **merge**: [`IRouterMatcher`](IRouterMatcher.md)<[`IRouter`](IRouter.md), `any`\>

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:290

___

### mkactivity

 **mkactivity**: [`IRouterMatcher`](IRouterMatcher.md)<[`IRouter`](IRouter.md), `any`\>

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:291

___

### mkcol

 **mkcol**: [`IRouterMatcher`](IRouterMatcher.md)<[`IRouter`](IRouter.md), `any`\>

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:292

___

### move

 **move**: [`IRouterMatcher`](IRouterMatcher.md)<[`IRouter`](IRouter.md), `any`\>

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:293

___

### notify

 **notify**: [`IRouterMatcher`](IRouterMatcher.md)<[`IRouter`](IRouter.md), `any`\>

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:295

___

### options

 **options**: [`IRouterMatcher`](IRouterMatcher.md)<[`IRouter`](IRouter.md), ``"options"``\>

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:283

___

### patch

 **patch**: [`IRouterMatcher`](IRouterMatcher.md)<[`IRouter`](IRouter.md), ``"patch"``\>

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:282

___

### post

 **post**: [`IRouterMatcher`](IRouterMatcher.md)<[`IRouter`](IRouter.md), ``"post"``\>

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:279

___

### propfind

 **propfind**: [`IRouterMatcher`](IRouterMatcher.md)<[`IRouter`](IRouter.md), `any`\>

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:296

___

### proppatch

 **proppatch**: [`IRouterMatcher`](IRouterMatcher.md)<[`IRouter`](IRouter.md), `any`\>

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:297

___

### purge

 **purge**: [`IRouterMatcher`](IRouterMatcher.md)<[`IRouter`](IRouter.md), `any`\>

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:298

___

### put

 **put**: [`IRouterMatcher`](IRouterMatcher.md)<[`IRouter`](IRouter.md), ``"put"``\>

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:280

___

### report

 **report**: [`IRouterMatcher`](IRouterMatcher.md)<[`IRouter`](IRouter.md), `any`\>

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:299

___

### search

 **search**: [`IRouterMatcher`](IRouterMatcher.md)<[`IRouter`](IRouter.md), `any`\>

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:300

___

### stack

 **stack**: `any`[]

Stack of configured routes

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:315

___

### subscribe

 **subscribe**: [`IRouterMatcher`](IRouterMatcher.md)<[`IRouter`](IRouter.md), `any`\>

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:301

___

### trace

 **trace**: [`IRouterMatcher`](IRouterMatcher.md)<[`IRouter`](IRouter.md), `any`\>

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:302

___

### unlink

 **unlink**: [`IRouterMatcher`](IRouterMatcher.md)<[`IRouter`](IRouter.md), `any`\>

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:306

___

### unlock

 **unlock**: [`IRouterMatcher`](IRouterMatcher.md)<[`IRouter`](IRouter.md), `any`\>

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:303

___

### unsubscribe

 **unsubscribe**: [`IRouterMatcher`](IRouterMatcher.md)<[`IRouter`](IRouter.md), `any`\>

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:304

___

### use

 **use**: [`IRouterHandler`](IRouterHandler.md)<[`IRouter`](IRouter.md), `string`\> & [`IRouterMatcher`](IRouterMatcher.md)<[`IRouter`](IRouter.md), `any`\>

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:308

## Methods

### param

**param**(`name`, `handler`): [`IRouter`](IRouter.md)

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
| `handler` | [`RequestParamHandler`](../index.md#requestparamhandler) |

#### Returns

[`IRouter`](IRouter.md)

-`IRouter`: 

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:264

**param**(`callback`): [`IRouter`](IRouter.md)

Alternatively, you can pass only a callback, in which case you have the opportunity to alter the app.param()

#### Parameters

| Name |
| :------ |
| `callback` | (`name`: `string`, `matcher`: `RegExp`) => [`RequestParamHandler`](../index.md#requestparamhandler) |

#### Returns

[`IRouter`](IRouter.md)

-`IRouter`: 

**Deprecated**

since version 4.11

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

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:311
