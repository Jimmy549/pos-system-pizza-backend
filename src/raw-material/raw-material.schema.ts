import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ timestamps: true })
export class RawMaterial extends Document {
  @ApiProperty({ example: 'Flour', description: 'Name of the raw material' })
  @Prop({ required: true })
  name: string;

  @ApiProperty({ example: 'g', description: 'Unit of measurement' })
  @Prop({ required: true })
  unit: string;

  @ApiProperty({ example: 1000, description: 'Current stock quantity' })
  @Prop({ required: true })
  stock: number;

  @ApiProperty({ example: 100, description: 'Minimum stock alert level' })
  @Prop()
  minStock: number;
}

export const RawMaterialSchema = SchemaFactory.createForClass(RawMaterial);