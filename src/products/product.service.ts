import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './product.schema';
import { RawMaterialService } from '../raw-material/raw-material.service';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private model: Model<Product>,
    private rawService: RawMaterialService
  ) {}

  async create(data: CreateProductDto) {
    return this.model.create(data);
  }

  async findAll(search?: string) {
    const query = search ? { name: { $regex: search, $options: 'i' } } : {};
    const products = await this.model.find(query);
    const materials = await this.rawService.findAll();

    return products.map((p) => {
      const counts = p.recipe.map((r) => {
        const mat = materials.find(m => m.id === r.materialId.toString());
        if (!mat) return 0;
        return Math.floor(mat.stock / r.quantity);
      });

      const available = counts.length > 0 ? Math.min(...counts) : 0;

      return { 
        ...p.toObject(), 
        available,
        recipeDetails: p.recipe.map(r => {
          const mat = materials.find(m => m.id === r.materialId.toString());
          return {
            materialId: r.materialId,
            materialName: mat?.name || 'Unknown',
            quantity: r.quantity,
            unit: mat?.unit || ''
          };
        })
      };
    });
  }

  async findById(id: string) {
    const product = await this.model.findById(id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    const materials = await this.rawService.findAll();
    const counts = product.recipe.map((r) => {
      const mat = materials.find(m => m.id === r.materialId.toString());
      if (!mat) return 0;
      return Math.floor(mat.stock / r.quantity);
    });

    const available = counts.length > 0 ? Math.min(...counts) : 0;

    return {
      ...product.toObject(),
      available,
      recipeDetails: product.recipe.map(r => {
        const mat = materials.find(m => m.id === r.materialId.toString());
        return {
          materialId: r.materialId,
          materialName: mat?.name || 'Unknown',
          quantity: r.quantity,
          unit: mat?.unit || ''
        };
      })
    };
  }

  async update(id: string, data: Partial<CreateProductDto>) {
    return this.model.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string) {
    return this.model.findByIdAndDelete(id);
  }

  async getProductsWithAvailability(productIds: string[]) {
    const products = await this.model.find({ _id: { $in: productIds } });
    const materials = await this.rawService.findAll();

    return products.map((p) => {
      const counts = p.recipe.map((r) => {
        const mat = materials.find(m => m.id === r.materialId.toString());
        if (!mat) return 0;
        return Math.floor(mat.stock / r.quantity);
      });

      const available = counts.length > 0 ? Math.min(...counts) : 0;

      return { ...p.toObject(), available };
    });
  }
}