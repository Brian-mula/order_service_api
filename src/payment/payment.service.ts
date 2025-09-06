import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/order/entity/order.entity';
import { Repository } from 'typeorm';
import { Payment } from './entity/payment.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,

    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}


   
}
