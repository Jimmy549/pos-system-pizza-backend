import { Injectable } from '@nestjs/common';
import { OrderService } from '../orders/order.service';
import { RawMaterialService } from '../raw-material/raw-material.service';
import { ProductService } from '../products/product.service';

@Injectable()
export class DashboardService {
  constructor(
    private orderService: OrderService,
    private rawService: RawMaterialService,
    private productService: ProductService
  ) {}

  async getStats() {
    const orders = await this.orderService.findAll();
    const materials = await this.rawService.findAll();
    const products = await this.productService.findAll();

    const lowStock = materials.filter(m => m.minStock && m.stock <= m.minStock);
    
    // Calculate revenue and sales
    const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const totalSales = orders.reduce((sum, order) => 
      sum + order.items.reduce((orderSum, item) => orderSum + item.qty, 0), 0
    );

    // Calculate most sold products
    const productSales: { [key: string]: { qty: number; revenue: number; name: string } } = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        if (!productSales[item.productId]) {
          const product = products.find(p => p._id.toString() === item.productId);
          productSales[item.productId] = { 
            qty: 0, 
            revenue: 0, 
            name: product?.name || 'Unknown' 
          };
        }
        productSales[item.productId].qty += item.qty;
        productSales[item.productId].revenue += item.totalPrice || 0;
      });
    });

    const mostSold = Object.entries(productSales)
      .sort(([, a], [, b]) => b.qty - a.qty)
      .slice(0, 5)
      .map(([productId, data]) => ({
        productId,
        productName: data.name,
        quantity: data.qty,
        revenue: Math.round(data.revenue * 100) / 100
      }));

    // Calculate today's stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayOrders = orders.filter(order => 
      order.createdAt && new Date(order.createdAt) >= today
    );
    const todayRevenue = todayOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const todayItems = todayOrders.reduce((sum, order) => 
      sum + order.items.reduce((s, item) => s + item.qty, 0), 0
    );

    // Calculate stock value
    const stockValue = materials.reduce((sum, mat) => {
      const product = products.find(p => 
        p.recipe.some(r => r.materialId.toString() === mat._id.toString())
      );
      const pricePerUnit = product ? product.price / (product.recipe.length || 1) : 0;
      return sum + (mat.stock * pricePerUnit);
    }, 0);

    return {
      totalOrders: orders.length,
      totalSales,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      todayOrders: todayOrders.length,
      todaySales: todayItems,
      todayRevenue: Math.round(todayRevenue * 100) / 100,
      averageOrderValue: orders.length > 0 ? Math.round((totalRevenue / orders.length) * 100) / 100 : 0,
      stockValue: Math.round(stockValue * 100) / 100,
      lowStock,
      lowStockCount: lowStock.length,
      mostSoldProducts: mostSold,
      totalRawMaterials: materials.length,
      totalProducts: products.length,
      outOfStockProducts: products.filter(p => p.available === 0).length,
      inventoryStatus: {
        inStock: products.filter(p => p.available > 0).length,
        lowStock: products.filter(p => p.available > 0 && p.available <= 5).length,
        outOfStock: products.filter(p => p.available === 0).length
      }
    };
  }

  async getRawMaterialStats() {
    const materials = await this.rawService.findAll();
    const lowStock = materials.filter(m => m.minStock && m.stock <= m.minStock);

    return {
      total: materials.length,
      lowStock: lowStock.length,
      outOfStock: materials.filter(m => m.stock === 0).length,
      materials: materials.map(m => ({
        id: m._id,
        name: m.name,
        stock: m.stock,
        unit: m.unit,
        minStock: m.minStock || 0,
        isLowStock: m.minStock && m.stock <= m.minStock,
        isOutOfStock: m.stock === 0
      }))
    };
  }

  async getOrderHistory(limit: number = 10) {
    const orders = await this.orderService.findAll();
    return orders.slice(0, limit).map(order => ({
      id: order._id,
      totalAmount: order.totalAmount,
      itemCount: order.items.length,
      createdAt: order.createdAt,
      status: order.status
    }));
  }
}