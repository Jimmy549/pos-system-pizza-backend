import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RawMaterial } from './raw-material.schema';
import { StockLogService } from '../stock-logs/stock-log.service';
import { CreateRawMaterialDto } from './dto/create-raw-material.dto';

@Injectable()
export class RawMaterialService {
  constructor(
    @InjectModel(RawMaterial.name)
    private model: Model<RawMaterial>,
    private stockLogService: StockLogService
  ) {}

  async create(data: CreateRawMaterialDto) {
    return this.model.create({
      ...data,
      minStock: data.minStock || 0
    });
  }

  async findAll(lowStock?: boolean) {
    if (lowStock) {
      return this.model.find({
        $expr: { $lte: ['$stock', '$minStock'] }
      });
    }
    return this.model.find();
  }

  async findById(id: string) {
    const material = await this.model.findById(id);
    if (!material) {
      throw new NotFoundException(`Raw material with ID ${id} not found`);
    }
    return material;
  }

  async update(id: string, data: Partial<CreateRawMaterialDto>) {
    const material = await this.findById(id);
    
    if (data.stock !== undefined && data.stock !== material.stock) {
      await this.stockLogService.logStockChange({
        materialId: id,
        materialName: material.name,
        action: 'adjustment',
        previousStock: material.stock,
        newStock: data.stock,
        quantity: data.stock - material.stock,
        reason: 'Manual adjustment'
      });
    }
    
    return this.model.findByIdAndUpdate(id, data, { new: true });
  }

  async deductStock(id: string, quantity: number, orderId?: string) {
    const material = await this.findById(id);
    const newStock = material.stock - quantity;
    
    await this.stockLogService.logStockChange({
      materialId: id,
      materialName: material.name,
      action: 'sale',
      previousStock: material.stock,
      newStock,
      quantity: -quantity,
      orderId
    });
    
    return this.model.findByIdAndUpdate(id, { stock: newStock }, { new: true });
  }
}