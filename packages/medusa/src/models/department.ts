
import { Column, Entity, ManyToOne, ManyToMany, JoinColumn, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm'; 
import { User } from './user';
import { SoftDeletableEntity } from "../interfaces/models/soft-deletable-entity"



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

    
    // @ManyToMany(()=>Store, store=>store.departments)
    // @JoinColumn()
    // store: User[];
    
    // @ManyToMany(() => Store, (store) => store.departments)
    // @JoinColumn({name: 'store_id',})
    // stores: Store[];
}