export interface IUpdateAvaliation {
    id_avaliation: number,
    note?: number,
    commentary?: string
}

export interface IUpdatedAvaliationList {
    avaliation_type?: string,
    updated_avaliation_id?: number
}

export interface IDeleteAvaliation{
    id_avaliation: number;
    type_avaliation: 'material_quality' | 'didatics' | 'teaching_methodology' | 'commentary';
}

export interface IDeletedAvaliationList {
    avaliation_type?: string,
    deleted_avaliation_id?: number
}
