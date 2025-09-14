import { Course } from "src/course-modules/course/entities/course.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class CourseModule {

    @PrimaryGeneratedColumn()
    id_course_module: number;

    @Column({ type: 'varchar', length: 255, nullable: false })
    title: string;

    @Column({ type: 'text', nullable: false })
    description: string;

    @Column({ type: 'int', nullable: false })
    order: number;

    @CreateDateColumn({ type: 'timestamp', nullable: false })
    created_at: Date;

    @Column({type: 'uuid', nullable: false})
    fk_id_course: string;

    @ManyToOne(() => Course)
    @JoinColumn({ name: 'fk_id_course', referencedColumnName: 'id_course' })
    course?: Course;

}
