interface Person {
    adult: string;
    also_known_as: any[];
    biography: string;
    birthday: string;
    deathday: string | null;
    gender: number | null;
    homepage: string | null;
    id: number;
    imdb_id: string;
    known_for_department: string;
    name: string;
    place_of_birth: string | null;
    popularity: number;
    profile_path: string | null;
}

export type { Person }