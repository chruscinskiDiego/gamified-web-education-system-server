import { Category } from "src/course-modules/category/entities/category.entity";
import { User } from "src/user-modules/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Course {

    @PrimaryGeneratedColumn('uuid')
    id_course: string;

    @Column({ type: 'varchar',  length: 255, nullable: false })
    title: string;

    @Column({ type: 'text', nullable: false })
    description: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    link_thumbnail: string;

    @Column({ type: 'char', length: 1, nullable: false })
    difficulty_level: string;

    @Column({ type: 'bool', default: true })
    active: boolean;

    @CreateDateColumn({ type: 'timestamp', nullable: false })
    created_at: Date;

    @Column({name: 'fk_id_teacher', type: 'uuid', nullable: false})
    fk_id_teacher: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'fk_id_teacher', referencedColumnName: 'id_user' })
    teacher?: User;

    @Column({ type: 'int', nullable: false})
    fk_id_category: number;

    @ManyToOne(() => Category)
    @JoinColumn({ name: 'fk_id_category', referencedColumnName: 'id_category' })
    category?: Category;

}
