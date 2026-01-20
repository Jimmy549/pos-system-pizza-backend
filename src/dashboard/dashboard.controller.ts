import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';

@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private service: DashboardService) {}

  @Get('stats')
  @ApiResponse({ status: 200, description: 'Dashboard statistics' })
  stats() {
    return this.service.getStats();
  }

  @Get('raw-materials')
  @ApiResponse({ status: 200, description: 'Raw material inventory status' })
  rawMaterials() {
    return this.service.getRawMaterialStats();
  }

  @Get('orders')
  @ApiResponse({ status: 200, description: 'Recent order history' })
  orders(@Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit) : 10;
    return this.service.getOrderHistory(limitNum);
  }
}