/**
 * @schema AdminBatchPropertyLabels
 * type: object
 * description: The property labels to manage.
 * x-schemaName: AdminBatchPropertyLabels
 * properties:
 *   create:
 *     type: array
 *     description: The property labels to create.
 *     items:
 *       type: object
 *       description: The details of a property label to create.
 *       required:
 *         - entity
 *         - property
 *         - label
 *       properties:
 *         entity:
 *           type: string
 *           title: entity
 *           description: The name of the entity the property label belongs to.
 *         property:
 *           type: string
 *           title: property
 *           description: The property the label is for.
 *         label:
 *           type: string
 *           title: label
 *           description: The label to use for the property.
 *         description:
 *           type: string
 *           title: description
 *           description: The description of the property label.
 *   update:
 *     type: array
 *     description: The property labels to update.
 *     items:
 *       type: object
 *       description: The details of a property label to update.
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: string
 *           title: id
 *           description: The ID of the property label to update.
 *         label:
 *           type: string
 *           title: label
 *           description: The updated label of the property label.
 *         description:
 *           type: string
 *           title: description
 *           description: The updated description of the property label.
 *   delete:
 *     type: array
 *     description: The property labels to delete.
 *     items:
 *       type: string
 *       title: delete
 *       description: The ID of the property label to delete.
 * 
*/

