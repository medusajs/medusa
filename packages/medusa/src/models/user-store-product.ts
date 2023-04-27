
import { Column, Entity, ManyToOne, ManyToMany, JoinColumn, PrimaryColumn, PrimaryGeneratedColumn, BaseEntity } from 'typeorm'; 
import { User } from './user';
import { SoftDeletableEntity } from "../interfaces/models/soft-deletable-entity"
import { Store } from './store';



@Entity({'name':'user_store_products'})
export class UserStoreProduct{

    @PrimaryGeneratedColumn()
    id: string;
    
    @Column()
    store_id: string;
    
    @Column()
    user_id: string
    
        
    @Column()
    product_id: string
}