# ConnectionEvents

 **ConnectionEvents**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `close` | () => `void` |
| `clusterTimeReceived` | (`clusterTime`: [`Document`](../interfaces/Document.md)) => `void` |
| `commandFailed` | (`event`: [`CommandFailedEvent`](../classes/CommandFailedEvent.md)) => `void` |
| `commandStarted` | (`event`: [`CommandStartedEvent`](../classes/CommandStartedEvent.md)) => `void` |
| `commandSucceeded` | (`event`: [`CommandSucceededEvent`](../classes/CommandSucceededEvent.md)) => `void` |
| `message` | (`message`: `any`) => `void` |
| `pinned` | (`pinType`: `string`) => `void` |
| `unpinned` | (`pinType`: `string`) => `void` |

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2102
