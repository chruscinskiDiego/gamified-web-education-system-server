import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Role } from 'src/user-modules/roles/enum/roles.enum';
import { Roles } from 'src/user-modules/roles/decorator/roles.decorator';
import { AuthTokenGuard } from 'src/user-modules/auth/guards/auth-token.guard';
import { RolesGuard } from 'src/user-modules/roles/guard/roles.guard';

@UseGuards(AuthTokenGuard, RolesGuard)
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @Roles(Role.ADMIN)
  @Post('/create')
  async createCategory(
    @Body() createCategoryDto: CreateCategoryDto
  ) {
    return this.categoryService.createCategory(createCategoryDto);
  }

  @Roles(Role.ADMIN)
  @Get('/view-all')
  async findAllCategories() {
    return this.categoryService.findAllCategories();
  }

  @Roles(Role.ADMIN)
  @Patch('/update/:id')
  async updateCategoryById(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto
  ) {
    return this.categoryService.updateCategoryById(+id, updateCategoryDto);
  }

  @Roles(Role.ADMIN)
  @Patch('/disable/:id')
  async disableCategoryById(
    @Param('id') id: string
  ) {
    return this.categoryService.disableCategoryById(+id);
  }
}
