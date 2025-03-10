import { NestFactory } from '@nestjs/core';
import { RmqService } from '@app/common';
import { BillingModule } from './billing.module';

async function bootstrap() {
  const app = await NestFactory.create(BillingModule);
  const rmqService = app.get<RmqService>(RmqService);
  console.log("=====",rmqService);
  
  app.connectMicroservice(rmqService.getOptions('BILLING',false));

  await app.startAllMicroservices();
  
}
bootstrap();
