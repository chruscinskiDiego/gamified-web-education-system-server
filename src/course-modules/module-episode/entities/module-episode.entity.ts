import { CourseModule } from "src/course-modules/course-module/entities/course-module.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ModuleEpisode {

    @PrimaryGeneratedColumn()
    id_module_episode: number;

    @Column({ type: 'varchar', length: 255, nullable: false })
    title: string;

    @Column({ type: 'text', nullable: false })
    description: string;

    @Column({ type: 'int', nullable: false })
    order: number;

    @Column({ type: 'varchar', length: 255, nullable: true })
    link_episode: string;

    @CreateDateColumn({ type: 'timestamp', nullable: false })
    created_at: Date;

    @Column({type: 'int', nullable: false})
    fk_id_course_module: number;

    @ManyToOne( () => CourseModule)
    @JoinColumn({ name: 'fk_id_course_module', referencedColumnName: 'id_course_module' })
    course_module?: CourseModule;
    
}
