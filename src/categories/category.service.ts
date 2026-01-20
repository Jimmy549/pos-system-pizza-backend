import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './category.schema';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private model: Model<Category>
  ) {}

  async create(data: any) {
    return this.model.create(data);
  }

  async findAll() {
    return this.model.find({ isActive: true }).sort({ order: 1, name: 1 });
  }

  async findById(id: string) {
    return this.model.findById(id);
  }

  async update(id: string, data: any) {
    return this.model.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string) {
    return this.model.findByIdAndUpdate(id, { isActive: false }, { new: true });
  }
}