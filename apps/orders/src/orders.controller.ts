import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '@app/common';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}
  @Post()
  @UseGuards(JwtAuthGuard)
  async createOrder(@Body() req: CreateOrderDto,@Req() request:any){
  
    return this.ordersService.createOrder(req,request.cookies?.Authentication)
  }
  @Get()
  async getOrders(){
    return this.ordersService.getOrders()
  }
}
