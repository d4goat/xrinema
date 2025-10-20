interface Company {
    id: number
    logo_path: string | null
    name: string
    origin_country: string
}

interface Movie{
    id: number;
    adult: boolean;
    backdrop_path: string | null;
    genre_ids: number[];
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string | null;
    release_date: string;
    title: string;
    video: boolean
    vote_average: number;
    vote_count: number;
}

interface MovieDetail extends Movie{
    genres?: {id: number, name: string}[];
    runtime: number;
    budget: number;
    homepage: string | null;
    imdb_id: number | string;
    origin_country: string[]
    production_companies: Company[];
    production_countries: { iso_3166_1: string, name: string }[];
    revenue: number;
    spoken_languages: { english_name: string, iso_639_1: string, name: string }[];
    status: string;
    tagline: string | null;
}

interface PersonMovie extends Movie{
    character: string;
    credit_id: string;
    order: number
}

interface PersonTv extends PersonMovie{
    origin_country: string[];
    first_air_date: string;
    name: string;
    episode_count: number;
}

interface Video {
    id: string;
    iso_639_1: string;
    iso_3166_1: string;
    key: string;
    name: string;
    site: string;
    size: number;
    type: string;
}

interface VideoResponse {
    id: number;
    results: Video[];
}

interface Cast {
    adult: false,
    cast_id: number;
    character: string;
    credit_id: string;
    gender: number;
    id: number;
    known_for_department: string;
    job: string;
    name: string;
    order: number
    original_name: string;
    popularity: number;
    profile_path: string | null;
}



interface Credits {
    id: number;
    cast: Cast[];
    crew: Cast[];
}

export type { Movie, MovieDetail, Video, VideoResponse, Credits, Cast, PersonMovie, PersonTv }