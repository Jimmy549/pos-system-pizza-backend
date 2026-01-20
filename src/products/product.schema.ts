import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema()
export class RecipeItem {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  @Prop({ type: Types.ObjectId, ref: 'RawMaterial' })
  materialId: string;

  @ApiProperty({ example: 100 })
  @Prop()
  quantity: number;
}

@Schema({ timestamps: true })
export class Product extends Document {
  @ApiProperty({ example: 'Small Tikka Pizza' })
  @Prop({ required: true })
  name: string;

  @ApiProperty({ example: 299.99 })
  @Prop({ required: true })
  price: number;

  @ApiProperty({ example: 'Hot Dishes' })
  @Prop({ default: 'Hot Dishes' })
  category: string;

  @ApiProperty({ example: 'image.jpg' })
  @Prop()
  image: string;

  @ApiProperty({ type: [RecipeItem] })
  @Prop({ type: [RecipeItem] })
  recipe: RecipeItem[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);