import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {

  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>
  ) {}

  async createCategory(createCategoryDto: CreateCategoryDto) {

    try{

      const newCategory = this.categoryRepository.create(createCategoryDto);

      const createdCategory = await this.categoryRepository.save(newCategory);

      return {
        message: 'Categoria criada com sucesso!',
        created_category_id: createdCategory.id_category
      }

    }catch(error){
      
      if(error.code === '23505'){
        throw new NotFoundException('Já existe uma categoria com esse nome!');
      }

      throw error;

    }
    
  }

  async findAllCategories() {
    
    const categories = await this.categoryRepository.find(
      {
        select: {
          id_category: true,
          name: true,
          active: true
        }
      }
    );

    return categories;
  }

  async updateCategoryById(id: number, updateCategoryDto: UpdateCategoryDto) {
    

    const category = await this.categoryRepository.preload({
      id_category: id,
      ...updateCategoryDto
    });

    if(!category){
      throw new NotFoundException(`Categoria com ID ${id} não encontrada.`);
    }

    await this.categoryRepository.save(category);

    return {
      message: 'Categoria atualizada com sucesso!',
      updated_category_id: category.id_category
    }

  }

  async disableCategoryById(id: number) {

    const category = await this.categoryRepository.preload({
      id_category: id,
      active: false
    });

    if(!category){
      throw new NotFoundException(`Categoria com ID ${id} não encontrada.`);
    }

    if(!category.active){
      throw new NotFoundException(`Categoria com ID ${id} já está desativada.`);
    }

    await this.categoryRepository.save(category);

    return {
      message: 'Categoria desativada com sucesso!',
      disabled_category_id: category.id_category
    }

  }
}
