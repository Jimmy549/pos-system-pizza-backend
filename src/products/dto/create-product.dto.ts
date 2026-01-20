import { IsString, IsNumber, IsArray, IsOptional, Min, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class RecipeItemDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011', description: 'Raw Material ID' })
  @IsString()
  materialId: string;

  @ApiProperty({ example: 100, description: 'Quantity needed of this material' })
  @IsNumber()
  @Min(0)
  quantity: number;
}

export class CreateProductDto {
  @ApiProperty({ example: 'Small Tikka Pizza', description: 'Product name' })
  @IsString()
  name: string;

  @ApiProperty({ example: 299.99, description: 'Product price' })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ type: [RecipeItemDto], description: 'Recipe/Composition of raw materials' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RecipeItemDto)
  recipe: RecipeItemDto[];
}
