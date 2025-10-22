import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum InsigniaRarity {
    COMMON = 'COMMON',
    RARE = 'RARE',
    LEGENDARY = 'LEGENDARY',
}

@Entity()
export class Insignia {

    @PrimaryGeneratedColumn()
    id_insignia: number;

    @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
    name: string;

    @Column({ type: 'text', nullable: false })
    description: string;

    @Column({
        type: 'enum',
        enum: InsigniaRarity,
        enumName: 'insignia_rarity',
        default: InsigniaRarity.COMMON,
    })
    rarity: InsigniaRarity;

}
