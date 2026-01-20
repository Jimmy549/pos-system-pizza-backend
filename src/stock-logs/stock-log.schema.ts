import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class StockLog extends Document {
  @Prop({ required: true })
  materialId: string;

  @Prop({ required: true })
  materialName: string;

  @Prop({ required: true })
  action: string; // 'sale', 'adjustment', 'restock'

  @Prop({ required: true })
  previousStock: number;

  @Prop({ required: true })
  newStock: number;

  @Prop({ required: true })
  quantity: number;

  @Prop()
  orderId?: string;

  @Prop()
  reason?: string;
}

export const StockLogSchema = SchemaFactory.createForClass(StockLog);