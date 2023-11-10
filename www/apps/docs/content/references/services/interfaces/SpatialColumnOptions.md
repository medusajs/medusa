# SpatialColumnOptions

Options for spatial columns.

## Hierarchy

- **`SpatialColumnOptions`**

  ↳ [`EntitySchemaColumnOptions`](EntitySchemaColumnOptions.md)

## Properties

### spatialFeatureType

 `Optional` **spatialFeatureType**: ``"Point"`` \| ``"LineString"`` \| ``"Polygon"`` \| ``"MultiPoint"`` \| ``"MultiLineString"`` \| ``"MultiPolygon"`` \| ``"GeometryCollection"``

Column type's feature type.
Geometry, Point, Polygon, etc.

#### Defined in

node_modules/typeorm/decorator/options/SpatialColumnOptions.d.ts:10

___

### srid

 `Optional` **srid**: `number`

Column type's SRID.
Spatial Reference ID or EPSG code.

#### Defined in

node_modules/typeorm/decorator/options/SpatialColumnOptions.d.ts:15
