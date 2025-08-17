import { PartialType } from '@nestjs/mapped-types';
import { CreateUserXpDto } from './create-user-xp.dto';

export class UpdateUserXpDto extends PartialType(CreateUserXpDto) {}
