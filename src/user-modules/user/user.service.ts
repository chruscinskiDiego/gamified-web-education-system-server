import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { HashingServiceProtocol } from '../auth/hashing/hashing.service';
import { UserXpService } from '../user-xp/user-xp.service';
import { TokenPayloadDto } from '../auth/dto/token-payload.dto';
import { AmazonS3Service } from 'src/external-tools/amazon-s3/amazon-s3.service';

@Injectable()
export class UserService {

  constructor(

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly hashingService: HashingServiceProtocol,

    private readonly userXpService: UserXpService,

    private readonly amazonS3Service: AmazonS3Service

  ) { }

  async createUserProfile(createUserDto: CreateUserDto) {

    try {

      const { password, ...userData } = createUserDto;

      const passwordHash = await this.hashingService.hash(password);

      const userDTO = {
        ...userData,
        password: passwordHash,
      };

      const user = await this.userRepository.create(userDTO as User);

      const createdUser = await this.userRepository.save(user);

      const createdStarterXp = await this.userXpService.createStarterUserXpByUserId(createdUser.id_user);

      if (!createdStarterXp) {
        throw new ConflictException(`XP já criado para o ID de usuário: ${createdUser.id_user}`);
      }

      return {
        message: 'Usuário criado com sucesso!',
        created_user_id: createdUser.id_user
      }

    }
    catch (error) {

      if (error.code === '23505') {

        throw new ConflictException('Email já cadastrado');

      }

      throw error;

    }
  }

  async setUserProfilePicture(id: string, file: Express.Multer.File) {

    try{

      const imageUrl: string = await this.amazonS3Service.uploadProfilePicture(file, id);

      await this.userRepository.update(id, {
        profile_picture_link: imageUrl
      });

      return {
        message: 'Foto de perfil atualizada com sucesso!',
        profile_picture_link: imageUrl
      }

    }catch(error){

      throw error;
      
    }
  }

  async findUserProfileById(id: string, jwtUserReq: TokenPayloadDto) {

    if((jwtUserReq.sub !== id) && (jwtUserReq.role !== 'ADMIN')){
      throw new UnauthorizedException(`Você não tem permissão para acessar o perfil de outro usuário.`);
    }

    const user = await this.userRepository.findOne({
      where: { id_user: id },
      select: {
        id_user: true,
        name: true,
        surname: true,
        email: true,
        profile_picture_link: true,
        birth_date: true,
        active: true,
      }
    });

    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }

    return user;

  }

  async updateUserProfileById(id: string, updateUserDto: UpdateUserDto, jwtUserReq: TokenPayloadDto) {

    if((jwtUserReq.sub !== id) && (jwtUserReq.role !== 'ADMIN')){
      throw new UnauthorizedException(`Você não tem permissão para acessar o perfil de outro usuário.`);
    }

    const user = await this.userRepository.preload({
      id_user: id,
      ...updateUserDto,
    });

    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }

    await this.userRepository.save(user);

    return {
      message: 'Usuário atualizado com sucesso!',
      updated_user_id: user.id_user
    }

  }

  async disableUserProfileById(id: string, jwtUserReq: TokenPayloadDto) {

    if((jwtUserReq.sub !== id) && (jwtUserReq.role !== 'ADMIN')){
      throw new UnauthorizedException(`Você não tem permissão para acessar o perfil de outro usuário.`);
    }

    const user = await this.userRepository.findOne({
      where: {
        id_user: id
      },
      select: {
        id_user: true,
        active: true,
      }
    });


    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }

    if( !user.active) {
      throw new ConflictException(`Usuário com ID ${id} já está desativado`); 
    }

    await this.userRepository.update(id, {
      active: false
    });

    return {
      message: 'Usuário desativado com sucesso!',
      deactivated_user_id: user.id_user
    }
  }
}
