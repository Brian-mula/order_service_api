import { Order } from 'src/order/entity/order.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
enum PaymentStatus {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  PENDING = 'PENDING',
}
@Entity()
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @OneToOne(() => Order, (order) => order.payment)
  order: Order;

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
  status: PaymentStatus;

    @Column()
    transactionId: string;

    @Column()
    phoneNumber: string;
}
