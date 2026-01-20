import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { OrderModule } from '../orders/order.module';
import { RawMaterialModule } from '../raw-material/raw-material.module';
import { ProductModule } from '../products/product.module';

@Module({
  imports: [OrderModule, RawMaterialModule, ProductModule],
  controllers: [DashboardController],
  providers: [DashboardService]
})
export class DashboardModule {}