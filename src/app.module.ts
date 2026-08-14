import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      // Make configuration variables available throughout the application
      // without importing ConfigModule in every feature module.
      isGlobal: true,
    }),

    MongooseModule.forRoot(process.env.MONGO_URI as string),
  ],
})
export class AppModule {}
