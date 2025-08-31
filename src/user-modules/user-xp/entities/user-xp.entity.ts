import { User } from "src/user-modules/user/entities/user.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class UserXp {

    @PrimaryGeneratedColumn()
    id_xp: number;

    @Column({type: 'int', default: 0, nullable: false})
    points: number;

    @Column({name: 'fk_id_student', type: 'uuid'})
    fk_id_student: string;

    @OneToOne(() => User)
    @JoinColumn({ name: 'fk_id_student', referencedColumnName: 'id_user' })
    user?: User;

}
