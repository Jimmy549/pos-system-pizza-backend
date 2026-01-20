import { IsString, IsNumber, IsArray, ValidateNested, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class OrderItemDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011', description: 'Product ID' })
  @IsString()
  productId: string;

  @ApiProperty({ example: 2, description: 'Quantity of product' })
  @IsNumber()
  @Min(1)
  qty: number;

  @ApiProperty({ example: 'Small Tikka Pizza', description: 'Product name', required: false })
  productName?: string;

  @ApiProperty({ example: 299.99, description: 'Unit price', required: false })
  unitPrice?: number;

  @ApiProperty({ example: 599.98, description: 'Total price for this item', required: false })
  totalPrice?: number;
}

export class CreateOrderDto {
  @ApiProperty({ type: [OrderItemDto], description: 'Items in the order' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}
