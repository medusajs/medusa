
import { Column, Entity, ManyToOne, ManyToMany, JoinColumn, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm'; 
import { User } from './user';
import { SoftDeletableEntity } from "../interfaces/models/soft-deletable-entity"
import { Store } from './store';



@Entity()
export class Department extends SoftDeletableEntity {
    @PrimaryGeneratedColumn()
    id: string;
    
    @Column()
    store_id: string;
    
    @Column()
    user_id: string

    // @ManyToMany(()=>User, user=>user.userdepartments)
    // @JoinColumn()
    // user_id: User[];
    
    @ManyToOne(() => User, (user) => user.departments)
    @JoinColumn({name: 'user_id',})
    users: User[];
    
    
    @ManyToOne(() => Store, (store) => store.departments)
    @JoinColumn({name: 'store_id',})
    stores: Store[];

    
    // @ManyToMany(()=>Store, store=>store.departments)
    // @JoinColumn()
    // store: User[];
    
    // @ManyToMany(() => Store, (store) => store.departments)
    // @JoinColumn({name: 'store_id',})
    // stores: Store[];
}
/**
 * @schema Department
 * title: "Department"
 * description: "Represents a Department"
 * type: object
 * required:
 *   - store_id
 *   - user_id
 *   - created_at
 *   - display_id
 *   - id
 
 * properties:
 *   id:
 *     description: The draft Department's ID
 *     type: string
 *     example: dprt_01G8TJFKBG38YYFQ035MSVG03C
 *   store_id:
 *     description: The draft store's display ID
 *     type: string
 *     example: 2
 *   user_id:
 *     description: The ID of the store associated with the Department order.
 *     nullable: true
 *     type: string
 *     example: cart_01G8ZH853Y6TFXWPG5EYE81X63
 *   users:
 *     description: A User object Array..
 *     nullable: true
 *     $ref: "#/components/schemas/Cart"
 *   created_at:
 *     description: The date with timezone at which the resource was created.
 *     type: string
 *     format: date-time
 *   updated_at:
 *     description: The date with timezone at which the resource was updated.
 *     type: string
 *     format: date-time
 */
