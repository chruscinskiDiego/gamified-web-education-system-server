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
                    type: true,
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

    async findUserDataByIdAndType(userId: string, userType: string) {

        let result: any = null;

        try {

            if (userType === 'S') {

                const query = await this.userRepository.query(`
            select
                jsonb_build_object(
                    'student',
                    jsonb_build_object(
                            'id_user',              u.id_user,
                            'name',                 u."name",
                            'surname',              u.surname,
                            'email',                u.email,
                            'type',                 u."type",
                            'birth_date',           u.birth_date,
                            'profile_picture_link', u.profile_picture_link,
                            'created_at',           u.created_at,
                            'active',               u.active,
                            'points',               ux.points
                        ),
                    'courses',
                    jsonb_agg(
                        jsonb_build_object(
                        'id_course',       c.id_course,
                        'title',           c.title,
                        'link_thumbnail',  c.link_thumbnail,
                        'active',          c.active,
                        'created_at',      c.created_at
                        )
                    )
                ) as result
                from "user" u
                inner join course_registration cr 
                        on u.id_user = cr.fk_id_student
                inner join course c 
                        on cr.fk_id_course = c.id_course
                inner join user_xp ux
                        on u.id_user = ux.fk_id_student 
                where u.id_user = '${userId}'
                group by u.id_user, ux.points;
            `);

                result = query[0]?.result || null;

            } else {

                const query = await this.userRepository.query(`
                select
                    jsonb_build_object(
                        'teacher',
                        jsonb_build_object(
                            'id_user',              u.id_user,
                            'name',                 u."name",
                            'surname',              u.surname,
                            'email',                u.email,
                            'type',                 u."type",
                            'birth_date',           u.birth_date,
                            'profile_picture_link', u.profile_picture_link,
                            'created_at',           u.created_at,
                            'active',               u.active
                        ),
                        'courses',
                        jsonb_agg(
                            jsonb_build_object(
                            'id_course',      c.id_course,
                            'title',          c.title,
                            'link_thumbnail', c.link_thumbnail,
                            'active',         c.active,
                            'created_at',     c.created_at
                            )
                        )
                    ) as result
                    from "user" u
                    inner join course c 
                            on c.fk_id_teacher = u.id_user
                    where u.id_user = '${userId}'
                    group by u.id_user;    
                `);

                result = query[0]?.result || null;

            }

            if (!result) {
                throw new NotFoundException('Usuário não encontrado');
            }

            return JSON.stringify(result);

        } catch (error) {

            if (error.code === '22P02') {
                throw new BadRequestException('Formato de ID inválido');
            }

            throw error;
        }

    };
}
