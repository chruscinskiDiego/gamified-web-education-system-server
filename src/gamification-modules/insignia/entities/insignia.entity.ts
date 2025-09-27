import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Insignia {

    @PrimaryGeneratedColumn()
    id_insignia: number;

    @Column({ type: 'varchar', length: 255, nullable: false, unique: true})
    name: string;

    @Column({ type: 'text', nullable: false})
    description: string;
    
}
