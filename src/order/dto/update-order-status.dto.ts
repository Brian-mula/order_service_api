import { IsEnum } from 'class-validator';
import { OrderStatus } from '../entity/order.entity';

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
