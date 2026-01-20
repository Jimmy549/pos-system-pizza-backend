import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RawMaterial, RawMaterialSchema } from './raw-material.schema';
import { RawMaterialService } from './raw-material.service';
import { RawMaterialController } from './raw-material.controller';
import { StockLogModule } from '../stock-logs/stock-log.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RawMaterial.name, schema: RawMaterialSchema }
    ]),
    StockLogModule
  ],
  controllers: [RawMaterialController],
  providers: [RawMaterialService],
  exports: [RawMaterialService]
})
export class RawMaterialModule {}