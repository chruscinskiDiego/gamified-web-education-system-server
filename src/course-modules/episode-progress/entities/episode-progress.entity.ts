import { ModuleEpisode } from "src/course-modules/module-episode/entities/module-episode.entity";
import { User } from "src/user-modules/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class EpisodeProgress {

    @PrimaryGeneratedColumn()
    id_episode_progress: number;

    @Column({type: 'boolean', nullable: false})
    completed: boolean;

    @CreateDateColumn({type: 'timestamp', nullable: false})
    completed_at: number;

    @Column({type: 'int', nullable: false})
    fk_id_module_episode;

    @Column({type: 'uuid', nullable: false})
    fk_id_student;

    @ManyToOne(() => ModuleEpisode)
    @JoinColumn({name: 'fk_id_module_episode', referencedColumnName: 'id_module_episode'})
    module_episode?: ModuleEpisode;

    @ManyToOne(() => User)
    @JoinColumn({name: 'fk_id_student', referencedColumnName: 'id_user'})
    user?: User;

}
