import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Category {

    @PrimaryGeneratedColumn()
    id_category: number;

    @Column({ type: 'varchar', length: 255, nullable: false, unique: true})
    name: string;

    @Column({ type: 'bool', default: true })
    active: boolean;

    @CreateDateColumn({ type: 'timestamp', nullable: false })
    created_at: Date;

}
