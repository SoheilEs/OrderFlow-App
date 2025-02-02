import { Controller, Get, UseGuards } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { JwtAuthGuard, RmqService } from '@app/common';
import { BillingService } from './billing.service';


@Controller("billing")
export class BillingController {
  constructor(
    private readonly billingService: BillingService,
    private readonly rmqService: RmqService,
  ) {}
  
  @EventPattern('order_created')
  @UseGuards(JwtAuthGuard)
  async handleOrderCreated(@Payload() data: any, @Ctx() context: RmqContext) {
    console.log('[Billing] Received order_created event:', data);  // Ensure this log appears
  await this.billingService.bill(data);
  this.rmqService.ack(context);
  }
  @Get()
  hello(){
    return "Hello world billing...."
  }
}