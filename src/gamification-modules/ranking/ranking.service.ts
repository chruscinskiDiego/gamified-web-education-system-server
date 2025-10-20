import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserXp } from 'src/user-modules/user-xp/entities/user-xp.entity';
import { Repository } from 'typeorm';


@Injectable()
export class RankingService {

  constructor(

    @InjectRepository(UserXp)
    private readonly userXpRepository: Repository<UserXp>

  ){}

  async getStudentsRanking() {

    const ranking = await this.userXpRepository.query(
      `
      SELECT
        ROW_NUMBER() OVER (ORDER BY uxp.points DESC, u.id_user) AS rank_position,
        CONCAT_WS(' ', u."name", u.surname) AS user_full_name,
        uxp.points
      FROM "user" u
      JOIN user_xp uxp
        ON u.id_user = uxp.fk_id_student
      ORDER BY uxp.points DESC, u.id_user
      LIMIT 10;
      `
    );

    return ranking;
  }
}
