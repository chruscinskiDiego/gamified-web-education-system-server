import { Course } from "src/course-modules/course/entities/course.entity";
import { Challenge } from "src/gamification-modules/challenge/entities/challenge.entity";
import { User } from "src/user-modules/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
@Index(['fk_id_course', 'fk_id_student'], { unique: true })
export class ChallengeUserProgress {

    @PrimaryGeneratedColumn()
    id_challenge_user_progress: number;

    // P = Pending, F = Finished
    @Column({type: 'char', nullable: false, default: 'P'})
    status: string;

    @CreateDateColumn({ type: 'timestamp', nullable: false})
    start_date: Date;

    @UpdateDateColumn({ type: 'timestamp', nullable: true})
    end_date: Date;

    @Column({type: 'int', nullable: false})
    start_xp: number;
    
    @Column({type: 'int', nullable: true})
    end_xp: number;

    @Column({name: 'fk_id_challenge', type: 'int', nullable: false})
    fk_id_challenge: number;

    @ManyToOne(() => Challenge)
    @JoinColumn({ name: 'fk_id_challenge', referencedColumnName: 'id_challenge' })
    challenge?: Challenge;

    @Column({name: 'fk_id_student', type: 'uuid', nullable: false})
    fk_id_student: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'fk_id_student', referencedColumnName: 'id_user' })
    student?: User;

    @Column({name: 'fk_id_course', type: 'uuid', nullable: false})
    fk_id_course: string;

    @ManyToOne(() => Course)
    @JoinColumn({ name: 'fk_id_course', referencedColumnName: 'id_course' })
    course?: Course;

}
