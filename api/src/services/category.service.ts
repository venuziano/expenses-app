import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateCategoryDto } from 'src/dto/category/create-category.dto';
import { UpdateCategoryDto } from 'src/dto/category/update-category.dto';
import { Category } from 'src/entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  create(createCategoryDto: CreateCategoryDto) {
    return 'This action adds a new category';
  }

  findAll() {
    return this.categoryRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }

  async identifyCategory(lower: string): Promise<number> {
    const categories = await this.findAll();
    for (const { id, regex } of categories) {
      // use word-boundaries if you like: new RegExp(`\\b(${regex.join('|')})\\b`)
      if (regex.some((p) => lower.includes(p))) {
        return id;
      }
    }
    return 1;
    // return 'outros';
  }
}
