/**
 * @schema AdminDeletePaymentCollectionResponse
 * type: object
 * description: The result of deleting the payment collection.
 * x-schemaName: AdminDeletePaymentCollectionResponse
 * required:
 *   - id
 *   - object
 *   - deleted
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The payment collection's ID.
 *   object:
 *     type: string
 *     title: object
 *     description: The name of the object that was deleted.
 *     default: payment-collection
 *   deleted:
 *     type: boolean
 *     title: deleted
 *     description: Whether the object was deleted.
 * 
*/

