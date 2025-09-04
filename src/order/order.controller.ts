import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/user/common/current-user-decorator';
import { JwtAuthGuard } from 'src/user/guard/auth.guard';
import { UserThrottlerGuard } from 'src/user/guard/user-throttle.guard';
import { GetOrdersDto } from './dto/get-orders.dto';
import { NewOrderDto } from './dto/new-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(JwtAuthGuard)
  @UseGuards(UserThrottlerGuard)
  @Post()
  async newOrder(@Body()orderDto:NewOrderDto,@CurrentUser()user:jwtPayloadType) {
    return this.orderService.newOrder(orderDto,user);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getOrders(@CurrentUser()user:jwtPayloadType,@Query()query:GetOrdersDto) {
    return this.orderService.getOrders(user,query);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/status')
  async updateOrderStatus(@Param('id')id:string,@Body()statusDto:UpdateOrderStatusDto,@CurrentUser()user:jwtPayloadType) {
    return this.orderService.updateOrderStatus(id,statusDto,user);
    
  }

  @Get(':id')
  async getOrderById(@Param('id')id:string,@CurrentUser()user:jwtPayloadType) {
    return this.orderService.getOrderById(id,user);
  }
}
