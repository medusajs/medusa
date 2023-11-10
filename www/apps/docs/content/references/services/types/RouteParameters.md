# RouteParameters

 **RouteParameters**<`Route`\>: `string` extends `Route` ? [`ParamsDictionary`](../interfaces/ParamsDictionary.md) : `Route` extends \`${string}(${string}\` ? [`ParamsDictionary`](../interfaces/ParamsDictionary.md) : `Route` extends \`${string}:${infer Rest}\` ? [`GetRouteParameter`](GetRouteParameter.md)<`Rest`\> extends `never` ? [`ParamsDictionary`](../interfaces/ParamsDictionary.md) : [`GetRouteParameter`](GetRouteParameter.md)<`Rest`\> extends \`${infer ParamName}?\` ? { [P in ParamName]?: string } : { [P in GetRouteParameter<Rest\\>]: string } & `Rest` extends \`${GetRouteParameter<Rest\\>}${infer Next}\` ? [`RouteParameters`](RouteParameters.md)<`Next`\> : `unknown` : {}

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Route` | `string` |

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:111
