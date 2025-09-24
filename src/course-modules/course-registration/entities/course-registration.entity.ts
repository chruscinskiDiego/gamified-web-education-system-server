import { Course } from "src/course-modules/course/entities/course.entity";
import { User } from "src/user-modules/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class CourseRegistration {

    @PrimaryGeneratedColumn()
    id_course_registration: number;

    @Column({type: 'char', length: 255, nullable: false})
    state: string;

    @CreateDateColumn({ type: 'timestamp', nullable: false})
    created_at: Date;

    @Column({name: 'fk_id_student', type: 'uuid', nullable: false})
    fk_id_student;

    @ManyToOne(() => User)
    @JoinColumn({name: 'fk_id_student', referencedColumnName: 'id_user'})
    student?: User;

    @Column({name: 'fk_id_course', type: 'uuid', nullable:false})
    fk_id_course;

    @ManyToOne(() => Course)
    @JoinColumn({name: 'fk_id_course', referencedColumnName: 'id_course'})
    course?: Course;

}
