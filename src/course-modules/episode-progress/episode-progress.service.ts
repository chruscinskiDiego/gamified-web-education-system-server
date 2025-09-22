import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { SaveEpisodeProgressDto } from './dto/create-episode-progress.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EpisodeProgress } from './entities/episode-progress.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user-modules/user/user.service';
import { TokenPayloadDto } from 'src/user-modules/auth/dto/token-payload.dto';


@Injectable()
export class EpisodeProgressService {

  constructor(
    @InjectRepository(EpisodeProgress)
    private readonly episodeProgressRepository: Repository<EpisodeProgress>,
    private readonly userService: UserService
  ){}

  async createEpisodeProgress(createEpisodeProgressDto: SaveEpisodeProgressDto, userReq: TokenPayloadDto ) {

    const {id_student, id_module_episode, ...episodeProgress} = createEpisodeProgressDto;

    try{

      const user = await this.userService.findUserProfileById(id_student, userReq);

      const progressAlreadyRegistered = await this.verifyProgressExists(id_student, id_module_episode);

      if(progressAlreadyRegistered) throw new ConflictException('Progresso já registrado para este usuário e episódio!');

      const episodeProgressDTO = {
        completed: episodeProgress.completed,
        completed_at: episodeProgress.completed_at,
        fk_id_module_episode: id_module_episode,
        fk_id_student: user.id_user
      }

      const createdEpisodeProgress = await this.episodeProgressRepository.create(episodeProgressDTO);

      const savedEpisode = await this.episodeProgressRepository.save(createdEpisodeProgress);

      return {
        message: 'Progresso de episódio salvo com sucesso!',
        created_progress_episode_id: savedEpisode.id_episode_progress
      }

    }catch(error){

      if(error.code === '23503') throw new NotFoundException('Episódio inexistente!');
      
      throw error;

    }

  }

  async verifyProgressExists(idUser: string, idEpisode: number){

    const response = await this.episodeProgressRepository
    .findOne({
      where: {
        fk_id_student: idUser,
        fk_id_module_episode: idEpisode
      }
    });

    const exists = response === null ? false : true;

    return exists;

  };

}
