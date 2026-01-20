import { Body, Controller, Get, Post, Query, Param, Put, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(
    private service: ProductService,
    private cloudinaryService: CloudinaryService
  ) {}

  @Post('upload-image')
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 200, description: 'Image uploaded successfully' })
  async uploadImage(@UploadedFile() file: any) {
    const imageUrl = await this.cloudinaryService.uploadImage(file);
    return { imageUrl };
  }

  @Post()
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  create(@Body() body: CreateProductDto) {
    return this.service.create(body);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'List of all products with availability' })
  getAll(@Query('search') search?: string) {
    return this.service.findAll(search);
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Product by ID with availability' })
  getById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Put(':id')
  @ApiResponse({ status: 200, description: 'Product updated successfully' })
  update(@Param('id') id: string, @Body() data: CreateProductDto) {
    return this.service.update(id, data);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Product deleted successfully' })
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}