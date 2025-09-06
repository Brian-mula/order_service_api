import {
  ConflictException,
  ForbiddenException,
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Counter } from 'prom-client';
import { User, UserRole } from 'src/user/entity/user.entity';
import { Repository } from 'typeorm';
import { GetOrdersDto } from './dto/get-orders.dto';
import { NewOrderDto } from './dto/new-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { Order } from './entity/order.entity';

@Injectable()
export class OrderService {
  private readonly ordersCreated: Counter<string>;
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async newOrder(orderDto: NewOrderDto, user: jwtPayloadType) {
    try {
      if (user.role !== UserRole.USER) {
        throw new UnauthorizedException(
          'You are not authorized to perform this action',
        );
      }

      const { items, clientToken } = orderDto;

      const userExists = await this.userRepository.findOne({
        where: { id: user.sub },
      });
      if (!userExists) {
        throw new NotFoundException('User not found');
      }

      // check if the order exists
      const orderExists = await this.orderRepository.findOne({
        where: { clientToken },
      });
      if (orderExists) {
        return orderExists;
      }
      const newOrder = this.orderRepository.create({
        items,
        clientToken,
        user: userExists,
      });
      return await this.orderRepository.save(newOrder);
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }

  async getOrders(user: jwtPayloadType, query: GetOrdersDto) {
    try {
      const { status, q, page, limit } = query;

      const pageNum = Number(page) || 1;
      const limitNum = Number(limit) || 10;

      const qb = this.orderRepository.createQueryBuilder('order');

      if (user.role !== UserRole.ADMIN) {
        qb.andWhere('order.userId = :userId', { userId: user.sub });
      }
      if (status) {
        qb.andWhere('order.status = :status', { status });
      }
      if (q) {
        qb.andWhere(
          `EXISTS (
                    SELECT 1 FROM jsonb_array_elements(order.items) AS item
                    WHERE item->>'sku' ILIKE :q
                )
                    `,
          { q: `%${q}%` },
        );
      }

      qb.skip((pageNum - 1) * limitNum).take(limitNum);

      const [orders, total] = await qb.getManyAndCount();
      return {
        data: orders,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limitNum),
      };
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }

  async updateOrderStatus(
    orderId: string,
    updateDto: UpdateOrderStatusDto,
    user: jwtPayloadType,
  ) {
    try {
      if (user.role !== UserRole.ADMIN) {
        throw new ForbiddenException(
          'You are not authorized to perform this action',
        );
      }
      const order = await this.orderRepository.findOne({
        where: { id: orderId },
      });
      if (!order) {
        throw new NotFoundException('Order not found');
      }
      order.status = updateDto.status;
      return await this.orderRepository.save(order);
    } catch (error) {
      if (error.name === 'OptimisticLockVersionMismatchError') {
        throw new ConflictException(
          'The order was updated by another process. Please try again.',
        );
      }
      throw new HttpException(error.message, error.status || 500);
    }
  }

  async getOrderById(orderId: string, user: jwtPayloadType) {
    try {
      const order = await this.orderRepository.findOne({
        where: { id: orderId },
      });
      if (!order) {
        throw new NotFoundException('Order not found');
      }
      if (user.role !== UserRole.ADMIN && order.user.id !== user.sub) {
        throw new UnauthorizedException(
          'You are not authorized to perform this action',
        );
      }
      return order;
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }
}
