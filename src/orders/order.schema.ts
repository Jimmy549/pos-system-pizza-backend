import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema()
export class OrderItem {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  @Prop({ required: true })
  productId: string;

  @ApiProperty({ example: 2 })
  @Prop({ required: true })
  qty: number;

  @ApiProperty({ example: 'Small Tikka Pizza' })
  @Prop()
  productName?: string;

  @ApiProperty({ example: 299.99 })
  @Prop()
  unitPrice?: number;

  @ApiProperty({ example: 599.98 })
  @Prop()
  totalPrice?: number;
}

@Schema({ timestamps: true })
export class Order extends Document {
  @ApiProperty({ type: [OrderItem] })
  @Prop({ type: [OrderItem], required: true })
  items: OrderItem[];

  @ApiProperty({ example: 599.98 })
  @Prop({ default: 0 })
  totalAmount: number;

  @ApiProperty({ example: 'completed' })
  @Prop({ default: 'completed' })
  status: string;

  @ApiProperty()
  createdAt?: Date;

  @ApiProperty()
  updatedAt?: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);