import { Insignia } from "src/gamification-modules/insignia/entities/insignia.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Challenge {

    @PrimaryGeneratedColumn()
    id_challenge: number;

    @Column({type: 'varchar', length: 255, nullable: false})
    title: string;

    @Column({type: 'text', nullable: false})
    description: string;

    @Column({type: 'char', nullable: false})
    type: string;

    @Column({type: 'int', nullable: false})
    quantity: number;

    @Column({type: 'boolean', default: false})
    active: boolean;

    @Column({type: 'int', nullable: false})
    fk_id_insignia: number;

    @ManyToOne(() => Insignia)
    @JoinColumn({ name: 'fk_id_insignia', referencedColumnName: 'id_insignia' })
    insignia?: Insignia;

}
