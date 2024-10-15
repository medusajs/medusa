import {
  Cascade,
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
  Rel,
} from "@mikro-orm/core"
import { Searchable } from "../decorators/searchable"

@Entity()
class Product {
  @PrimaryKey()
  id: string

  @Property()
  name: string

  @OneToMany(() => ProductOption, (o) => o.product, {
    cascade: ["soft-remove"] as any,
  })
  options = new Collection<ProductOption>(this)

  @OneToMany(() => ProductVariant, (variant) => variant.product, {
    cascade: ["soft-remove"] as any,
  })
  variants = new Collection<ProductVariant>(this)
}

@Entity()
class ProductOption {
  @PrimaryKey()
  id: string

  @Property()
  name: string

  @ManyToOne(() => Product, {
    persist: false,
    nullable: true,
  })
  product: Product | null

  @OneToMany(() => ProductOptionValue, (value) => value.option, {
    cascade: [Cascade.PERSIST, "soft-remove" as any],
  })
  values = new Collection<ProductOptionValue>(this)
}

@Entity()
class ProductOptionValue {
  @PrimaryKey()
  id: string

  @Property()
  name: string

  @ManyToOne(() => ProductOption, {
    columnType: "text",
    fieldName: "option_id",
    mapToPk: true,
    nullable: true,
    onDelete: "cascade",
  })
  option_id: string | null

  @ManyToOne(() => ProductOption, {
    nullable: true,
    persist: false,
  })
  option: ProductOption | null

  @ManyToMany(() => ProductVariant, (variant) => variant.options)
  variants = new Collection<ProductVariant>(this)
}

@Entity()
class ProductVariant {
  @PrimaryKey()
  id: string

  @Property()
  name: string

  @ManyToOne(() => Product, {
    columnType: "text",
    nullable: true,
    onDelete: "cascade",
    fieldName: "product_id",
    mapToPk: true,
  })
  product_id: string | null

  @ManyToOne(() => Product, {
    persist: false,
    nullable: true,
  })
  product: Product | null

  @ManyToMany(() => ProductOptionValue, "variants", {
    owner: true,
    pivotTable: "product_variant_option",
    joinColumn: "variant_id",
    inverseJoinColumn: "option_value_id",
  })
  options = new Collection<ProductOptionValue>(this)
}

// Circular dependency one level
@Entity()
class RecursiveEntity1 {
  constructor(props: { id: string; deleted_at: Date | null }) {
    this.id = props.id
    this.deleted_at = props.deleted_at
  }

  @PrimaryKey()
  id: string

  @Property({ nullable: true })
  deleted_at: Date | null

  @OneToMany(() => RecursiveEntity2, (entity2) => entity2.entity1, {
    cascade: ["soft-remove"] as any,
  })
  entity2 = new Collection<RecursiveEntity2>(this)
}

@Entity()
class RecursiveEntity2 {
  constructor(props: {
    id: string
    deleted_at: Date | null
    entity1: RecursiveEntity1
  }) {
    this.id = props.id
    this.deleted_at = props.deleted_at
    this.entity1 = props.entity1
  }

  @PrimaryKey()
  id: string

  @Property({ nullable: true })
  deleted_at: Date | null

  @ManyToOne(() => RecursiveEntity1, {
    cascade: ["soft-remove"] as any,
  })
  entity1: Rel<RecursiveEntity1>
}

// No circular dependency
@Entity()
class Entity1 {
  constructor(props: { id: string; deleted_at: Date | null }) {
    this.id = props.id
    this.deleted_at = props.deleted_at
  }

  @PrimaryKey()
  id: string

  @Property({ nullable: true })
  deleted_at: Date | null

  @OneToMany(() => Entity2, (entity2) => entity2.entity1, {
    cascade: ["soft-remove"] as any,
  })
  entity2 = new Collection<Entity2>(this)
}

@Entity()
class Entity2 {
  constructor(props: {
    id: string
    deleted_at: Date | null
    entity1: Rel<Entity1>
  }) {
    this.id = props.id
    this.deleted_at = props.deleted_at
    this.entity1 = props.entity1
    this.entity1_id = props.entity1.id
  }

  @PrimaryKey()
  id: string

  @Property({ nullable: true })
  deleted_at: Date | null

  @ManyToOne(() => Entity1, { mapToPk: true })
  entity1_id: string

  @ManyToOne(() => Entity1, { persist: false })
  entity1: Entity1
}

// Circular dependency deep level

@Entity()
class DeepRecursiveEntity1 {
  constructor(props: { id: string; deleted_at: Date | null }) {
    this.id = props.id
    this.deleted_at = props.deleted_at
  }

  @PrimaryKey()
  id: string

  @Property({ nullable: true })
  deleted_at: Date | null

  @OneToMany(() => DeepRecursiveEntity3, (entity3) => entity3.entity1, {
    cascade: ["soft-remove"] as any,
  })
  entity3 = new Collection<DeepRecursiveEntity3>(this)

  @OneToMany(() => DeepRecursiveEntity2, (entity2) => entity2.entity1, {
    cascade: ["soft-remove"] as any,
  })
  entity2 = new Collection<DeepRecursiveEntity2>(this)
}

@Entity()
class DeepRecursiveEntity2 {
  constructor(props: {
    id: string
    deleted_at: Date | null
    entity1: Rel<DeepRecursiveEntity1>
    entity3: Rel<DeepRecursiveEntity3>
  }) {
    this.id = props.id
    this.deleted_at = props.deleted_at
    this.entity3 = props.entity3
  }

  @PrimaryKey()
  id: string

  @Property({ nullable: true })
  deleted_at: Date | null

  @ManyToOne(() => DeepRecursiveEntity1)
  entity1: DeepRecursiveEntity1

  @ManyToOne(() => DeepRecursiveEntity3, {
    cascade: ["soft-remove"] as any,
  })
  entity3: Rel<DeepRecursiveEntity3>
}

@Entity()
class DeepRecursiveEntity3 {
  constructor(props: {
    id: string
    deleted_at: Date | null
    entity1: Rel<DeepRecursiveEntity1>
  }) {
    this.id = props.id
    this.deleted_at = props.deleted_at
    this.entity1 = props.entity1
  }

  @PrimaryKey()
  id: string

  @Property({ nullable: true })
  deleted_at: Date | null

  @ManyToOne(() => DeepRecursiveEntity1, {
    cascade: ["soft-remove"] as any,
  })
  entity1: Rel<DeepRecursiveEntity1>
}

@Entity()
class DeepRecursiveEntity4 {
  constructor(props: {
    id: string
    deleted_at: Date | null
    entity1: Rel<DeepRecursiveEntity1>
  }) {
    this.id = props.id
    this.deleted_at = props.deleted_at
    this.entity1 = props.entity1
  }

  @PrimaryKey()
  id: string

  @Property({ nullable: true })
  deleted_at: Date | null

  @ManyToOne(() => DeepRecursiveEntity1)
  entity1: Rel<DeepRecursiveEntity1>
}

// Internal circular dependency

@Entity()
class InternalCircularDependencyEntity1 {
  constructor(props: {
    id: string
    deleted_at: Date | null
    parent?: InternalCircularDependencyEntity1
  }) {
    this.id = props.id
    this.deleted_at = props.deleted_at

    if (props.parent) {
      this.parent = props.parent
    }
  }

  @PrimaryKey()
  id: string

  @Property({ nullable: true })
  deleted_at: Date | null

  @OneToMany(
    () => InternalCircularDependencyEntity1,
    (entity) => entity.parent,
    {
      cascade: ["soft-remove"] as any,
    }
  )
  children = new Collection<InternalCircularDependencyEntity1>(this)

  @ManyToOne(() => InternalCircularDependencyEntity1, { nullable: true })
  parent: Rel<InternalCircularDependencyEntity1>
}

// With un decorated prop

@Entity()
class Entity1WithUnDecoratedProp {
  constructor(props: { id: string; deleted_at: Date | null }) {
    this.id = props.id
    this.deleted_at = props.deleted_at
  }

  unknownProp: string

  @PrimaryKey()
  id: string

  @Property({ nullable: true })
  deleted_at: Date | null

  @OneToMany(() => Entity2WithUnDecoratedProp, (entity2) => entity2.entity1, {
    cascade: ["soft-remove"] as any,
  })
  entity2 = new Collection<Entity2WithUnDecoratedProp>(this)
}

@Entity()
class Entity2WithUnDecoratedProp {
  constructor(props: {
    id: string
    deleted_at: Date | null
    entity1: Rel<Entity1WithUnDecoratedProp>
  }) {
    this.id = props.id
    this.deleted_at = props.deleted_at
    this.entity1 = props.entity1
    this.entity1_id = props.entity1.id
  }

  unknownProp: string

  @PrimaryKey()
  id: string

  @Property({ nullable: true })
  deleted_at: Date | null

  @ManyToOne(() => Entity1WithUnDecoratedProp, { mapToPk: true })
  entity1_id: string

  @ManyToOne(() => Entity1WithUnDecoratedProp, { persist: false })
  entity1: Rel<Entity1WithUnDecoratedProp>
}

// Searchable fields

@Entity()
class SearchableEntity1 {
  constructor(props: { id: string; deleted_at: Date | null }) {
    this.id = props.id
    this.deleted_at = props.deleted_at
  }

  @PrimaryKey()
  id: string

  @Property({ nullable: true })
  deleted_at: Date | null

  @Searchable()
  @Property({ columnType: "text" })
  searchableField: string

  @Searchable()
  @OneToMany(() => SearchableEntity2, (entity2) => entity2.entity1)
  entity2 = new Collection<SearchableEntity2>(this)
}

@Entity()
class SearchableEntity2 {
  constructor(props: {
    id: string
    deleted_at: Date | null
    entity1: SearchableEntity1
  }) {
    this.id = props.id
    this.deleted_at = props.deleted_at
    this.entity1 = props.entity1
    this.entity1_id = props.entity1.id
  }

  @PrimaryKey()
  id: string

  @Property({ nullable: true })
  deleted_at: Date | null

  @Searchable()
  @Property({ columnType: "text" })
  searchableField: string

  @ManyToOne(() => SearchableEntity1, { mapToPk: true })
  entity1_id: string

  @ManyToOne(() => SearchableEntity1, { persist: false })
  entity1: Rel<SearchableEntity1>
}

export {
  DeepRecursiveEntity1,
  DeepRecursiveEntity2,
  DeepRecursiveEntity3,
  DeepRecursiveEntity4,
  Entity1,
  Entity1WithUnDecoratedProp,
  Entity2,
  Entity2WithUnDecoratedProp,
  InternalCircularDependencyEntity1,
  Product,
  ProductOption,
  ProductOptionValue,
  ProductVariant,
  RecursiveEntity1,
  RecursiveEntity2,
  SearchableEntity1,
  SearchableEntity2,
}
