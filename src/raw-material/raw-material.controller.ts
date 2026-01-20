import { Body, Controller, Get, Patch, Post, Param, Query } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { RawMaterialService } from './raw-material.service';
import { CreateRawMaterialDto } from './dto/create-raw-material.dto';

@ApiTags('Raw Materials')
@Controller('raw-material')
export class RawMaterialController {
  constructor(private service: RawMaterialService) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Raw material created successfully' })
  create(@Body() body: CreateRawMaterialDto) {
    return this.service.create(body);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'List of all raw materials' })
  getAll(@Query('lowStock') lowStock?: string) {
    return this.service.findAll(lowStock === 'true');
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Raw material by ID' })
  getById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Patch(':id')
  @ApiResponse({ status: 200, description: 'Raw material updated' })
  update(@Param('id') id: string, @Body() body: CreateRawMaterialDto) {
    return this.service.update(id, body);
  }
}