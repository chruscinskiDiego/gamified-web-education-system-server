import { Course } from "src/course-modules/course/entities/course.entity";
import { User } from "src/user-modules/user/entities/user.entity";
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
@Index(['fk_id_course', 'fk_id_student'], { unique: true })
export class MaterialQualityAvaliation {

    @PrimaryGeneratedColumn()
    id_avaliation: number;

    @Column({ type: 'int', nullable: false })
    note: number;

    @Column({ name: 'fk_id_course', type: 'uuid', nullable: false })
    fk_id_course: string;

    @ManyToOne(() => Course)
    @JoinColumn({ name: 'fk_id_course', referencedColumnName: 'id_course' })
    course?: Course;

    @Column({ name: 'fk_id_student', type: 'uuid', nullable: false })
    fk_id_student: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'fk_id_student', referencedColumnName: 'id_user' })
    user?: User;

}
