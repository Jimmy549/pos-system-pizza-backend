import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { RawMaterialModule } from './raw-material/raw-material.module';
import { ProductModule } from './products/product.module';
import { OrderModule } from './orders/order.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { CategoryModule } from './categories/category.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/pos-system'),
    RawMaterialModule,
    ProductModule,
    OrderModule,
    DashboardModule,
    CategoryModule
  ]
})
export class AppModule {}
