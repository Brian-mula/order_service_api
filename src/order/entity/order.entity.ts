import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn } from "typeorm";
import { User } from "../../user/entity/user.entity";

export enum OrderStatus {
    PENDING = 'PENDING',
    PAID = 'PAID',
    CANCELLED = 'CANCELLED',
}


@Entity()
export class Order {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(()=> User, (user)=>user.id)
    user:User;

    @Column({type:'jsonb'})
    items:{sku:string, quantity:number}[];

    @Column({type:'enum', enum: OrderStatus, default: OrderStatus.PENDING})
    status: OrderStatus;

    @Column({unique:true})
    clientToken: string;

    @VersionColumn()
    version: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}