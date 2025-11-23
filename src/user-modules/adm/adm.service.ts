import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AdmService {

    constructor(

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

    ) { }

    async findUserProfile(property: string, value: string) {

        try {


            property = property === 'id' ? 'id_user' : property;

            const user = await this.userRepository.findOne({
                where: {
                    [property]: value
                },
                select: {
                    id_user: true,
                    name: true,
                    surname: true,
                    profile_picture_link: true,
                    active: true
                }
            });

            if (!user) {
                throw new NotFoundException('Usuário não encontrado');
            }

            const { name, surname, ...userProps } = user;

            const formattedUser = {
                full_name: `${name} ${surname}`,
                ...userProps
            }

            return formattedUser;

        }
        catch (error) {

            if (error.code === '22P02') {
                throw new BadRequestException('Formato de ID inválido');
            }

            throw error;
        }
    }
}
