import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './order.schema';
import { ProductService } from '../products/product.service';
import { RawMaterialService } from '../raw-material/raw-material.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private model: Model<Order>,
    private productService: ProductService,
    private rawService: RawMaterialService
  ) {}

  async create(order: CreateOrderDto) {
    const products = await this.productService.findAll();
    const materials = await this.rawService.findAll();
    let totalAmount = 0;

    // Validate all products exist and have sufficient stock
    for (const item of order.items) {
      const product = products.find(p => p._id.toString() === item.productId);
      if (!product) {
        throw new BadRequestException(`Product with ID ${item.productId} not found`);
      }

      if (product.available < item.qty) {
        throw new BadRequestException(
          `Insufficient stock for ${product.name}. Available: ${product.available}, Requested: ${item.qty}`
        );
      }

      // Validate and calculate pricing
      item.productName = product.name;
      item.unitPrice = product.price;
      item.totalPrice = product.price * item.qty;
      totalAmount += item.totalPrice;

      // Check individual raw materials exist and have enough stock
      for (const r of product.recipe) {
        const mat = materials.find(m => m.id === r.materialId.toString());
        if (!mat) {
          throw new BadRequestException(
            `Raw material not found for ${product.name}`
          );
        }
        
        const needed = r.quantity * item.qty;
        if (mat.stock < needed) {
          throw new BadRequestException(
            `Insufficient ${mat.name}. Available: ${mat.stock}${mat.unit}, Needed: ${needed}${mat.unit}`
          );
        }
      }
    }

    // Create order
    const createdOrder = await this.model.create({
      ...order,
      totalAmount,
      status: 'completed'
    });

    // Deduct stock for all materials
    for (const item of order.items) {
      const product = products.find(p => p._id.toString() === item.productId);
      if (!product) {
        throw new BadRequestException(`Product not found for ${item.productId}`);
      }
      
      for (const r of product.recipe) {
        const mat = materials.find(m => m.id === r.materialId.toString());
        if (!mat) {
          throw new BadRequestException(
            `Raw material not found for ${product.name}`
          );
        }
        const needed = r.quantity * item.qty;
        await this.rawService.deductStock(mat.id, needed, createdOrder._id.toString());
      }
    }

    return createdOrder;
  }

  async findAll() {
    return this.model.find().sort({ createdAt: -1 });
  }

  async findById(id: string) {
    return this.model.findById(id);
  }

  async getMostSoldProducts() {
    const orders = await this.findAll();
    const productSales: { [key: string]: { qty: number; revenue: number; name: string } } = {};
    
    orders.forEach(order => {
      order.items.forEach(item => {
        if (!productSales[item.productId]) {
          productSales[item.productId] = { 
            qty: 0, 
            revenue: 0, 
            name: item.productName || 'Unknown' 
          };
        }
        productSales[item.productId].qty += item.qty;
        productSales[item.productId].revenue += item.totalPrice || 0;
      });
    });

    return Object.entries(productSales)
      .sort(([, a], [, b]) => b.qty - a.qty)
      .slice(0, 5)
      .map(([productId, data]) => ({
        productId,
        productName: data.name,
        quantity: data.qty,
        revenue: data.revenue
      }));
  }

  async getOrderStats() {
    const orders = await this.findAll();
    
    return {
      totalOrders: orders.length,
      totalRevenue: orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0),
      totalItemsSold: orders.reduce((sum, o) => 
        sum + o.items.reduce((s, i) => s + i.qty, 0), 0
      ),
      averageOrderValue: orders.length > 0 
        ? orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0) / orders.length 
        : 0
    };
  }
}