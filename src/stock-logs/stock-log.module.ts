import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StockLog, StockLogSchema } from './stock-log.schema';
import { StockLogService } from './stock-log.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: StockLog.name, schema: StockLogSchema }
    ])
  ],
  providers: [StockLogService],
  exports: [StockLogService]
})
export class StockLogModule {}