import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';



@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule implements OnModuleInit {
  async onModuleInit() {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('MongoDB connection successful');
    } catch (error) {
      console.error('MongoDB connection error:', error);
    }
  }
}
