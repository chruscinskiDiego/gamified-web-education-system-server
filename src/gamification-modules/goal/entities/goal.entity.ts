import { User } from "src/user-modules/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Goal {

    @PrimaryGeneratedColumn()
    id_goal: number;

    @Column({ type: 'text', nullable: false })
    description: string;

    @Column({ type: 'boolean', default: false})
    completed: boolean;

    @CreateDateColumn({ type: 'timestamp', nullable: false })
    created_at: Date;

    @Column({name: 'fk_id_student', type: 'uuid', nullable: false})
    fk_id_student: string;

    @ManyToOne(() => User)
    @JoinColumn({name: 'fk_id_student', referencedColumnName: 'id_user'})
    student?: User;

}
