import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import { UserType } from "../dto/user.enum";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id_user: number;

    @Column({ type: 'varchar', length: 100, nullable: false })
    name: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    surname: string;

    @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
    email: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    password: string;

    @Column({ type: 'enum', enum: UserType, nullable: false })
    type: UserType;

    @Column({ type: 'date', nullable: false })
    birth_date: Date;

    @Column({ type: 'varchar', length: 255 })
    profile_picture_link: string;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @Column({ type: 'bool', default: true })
    active: boolean;

}
