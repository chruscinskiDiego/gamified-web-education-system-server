import { Injectable } from '@nestjs/common';
import { CreateUserXpDto } from './dto/create-user-xp.dto';
import { UpdateUserXpDto } from './dto/update-user-xp.dto';

@Injectable()
export class UserXpService {
  create(createUserXpDto: CreateUserXpDto) {
    return 'This action adds a new userXp';
  }

  findAll() {
    return `This action returns all userXp`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userXp`;
  }

  update(id: number, updateUserXpDto: UpdateUserXpDto) {
    return `This action updates a #${id} userXp`;
  }

  remove(id: number) {
    return `This action removes a #${id} userXp`;
  }
}
