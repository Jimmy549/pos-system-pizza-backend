import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ timestamps: true })
export class Category extends Document {
  @ApiProperty({ example: 'Hot Dishes', description: 'Category name' })
  @Prop({ required: true, unique: true })
  name: string;

  @ApiProperty({ example: 'Spicy and hot food items', description: 'Category description' })
  @Prop()
  description: string;

  @ApiProperty({ example: true, description: 'Whether category is active' })
  @Prop({ default: true })
  isActive: boolean;

  @ApiProperty({ example: 1, description: 'Display order' })
  @Prop({ default: 0 })
  order: number;
}

export const CategorySchema = SchemaFactory.createForClass(Category);