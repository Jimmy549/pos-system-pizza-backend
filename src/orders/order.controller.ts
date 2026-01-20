import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';

@ApiTags('Orders')
@Controller('orders')
export class OrderController {
  constructor(private service: OrderService) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Order created and stock deducted' })
  @ApiResponse({ status: 400, description: 'Insufficient stock' })
  create(@Body() body: CreateOrderDto) {
    return this.service.create(body);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'List of all completed orders' })
  getAll() {
    return this.service.findAll();
  }
}