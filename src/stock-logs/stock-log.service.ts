import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StockLog } from './stock-log.schema';

@Injectable()
export class StockLogService {
  constructor(
    @InjectModel(StockLog.name) private model: Model<StockLog>
  ) {}

  async logStockChange(data: {
    materialId: string;
    materialName: string;
    action: string;
    previousStock: number;
    newStock: number;
    quantity: number;
    orderId?: string;
    reason?: string;
  }) {
    return this.model.create(data);
  }

  findAll() {
    return this.model.find().sort({ createdAt: -1 });
  }

  findByMaterial(materialId: string) {
    return this.model.find({ materialId }).sort({ createdAt: -1 });
  }
}