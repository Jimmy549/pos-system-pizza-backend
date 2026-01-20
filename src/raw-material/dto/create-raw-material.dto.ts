import { IsString, IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRawMaterialDto {
  @ApiProperty({ example: 'Flour', description: 'Name of the raw material' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'g', description: 'Unit of measurement (g, ml, pcs, etc.)' })
  @IsString()
  unit: string;

  @ApiProperty({ example: 1000, description: 'Current stock quantity' })
  @IsNumber()
  @Min(0)
  stock: number;

  @ApiProperty({ example: 100, description: 'Minimum stock alert level', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minStock?: number;
}
