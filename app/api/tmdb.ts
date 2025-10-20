import axios from "axios"
import { useQuery } from "@tanstack/react-query"
import type { Credits, Movie, MovieDetail, PersonMovie, PersonTv, Video } from "~/types/movie"
import type { Person } from "~/types/person"

// Use environment variable for backend proxy URL, default to development URL
const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001/api/tmdb"

export function usePopularMovies(){
    return useQuery({
        queryKey: ['popular-movies'],
        queryFn: async () => axios.get(`${BACKEND_BASE_URL}/movies/popular`).then(res => res.data.results)
    })
}

export function useMoviesDetail({id}: {id: number | string}){
    return useQuery({
        queryKey: [`movie-detail`, id],
        queryFn: async () => axios.get(`${BACKEND_BASE_URL}/movies/${id}`).then(res => res.data as MovieDetail)
    })
}

export function useMovieTrailer({ id }: { id: number | string }) {
    return useQuery({
        queryKey: ['movie-trailer', id],
        queryFn: async () => axios.get(`${BACKEND_BASE_URL}/movies/${id}/trailer`).then(res => res.data.results as Video[])
    })
}

export function useMovieCredits({ id }: {id: number | string}){
    return useQuery({
        queryKey: ['movie-credits', id],
        queryFn: async () => axios.get(`${BACKEND_BASE_URL}/movies/${id}/credits`).then(res => res.data as Credits),
    })
}

export function useMoviesTopRated(){
    return useQuery({
        queryKey: ['top-rated-movies'],
        queryFn: async () => axios.get(`${BACKEND_BASE_URL}/movies/top_rated`).then(res => res.data.results)
    })
}

export function useUpcomingMovie(){
    return useQuery({
        queryKey: ['upcoming-movies'],
        queryFn: async () => axios.get(`${BACKEND_BASE_URL}/movies/upcoming`).then(res => res.data.results)
    })
}

// Additional API functions
export function useSearchMovies(query: string) {
    return useQuery({
        queryKey: ['search-movies', query],
        queryFn: async () => axios.get(`${BACKEND_BASE_URL}/search/movies?query=${encodeURIComponent(query)}`)
            .then(res => res.data.results),
        enabled: !!query
    })
}

export function usePersonDetail({ id }: { id: number | string }){
    return useQuery({
        queryKey: ['person-detail', id],
        queryFn: async () => axios.get(`${BACKEND_BASE_URL}/person/${id}`).then(res => res.data as Person)
    })
}

export function usePersonMovie({ id }: { id: number | string }){
    return useQuery({
        queryKey: ['person-movie', id],
        queryFn: async () => axios.get(`${BACKEND_BASE_URL}/person/${id}/movie-credits`).then(res => res.data as PersonMovie)
    })
}

export function usePersonTv({ id }: { id: number | string }){
    return useQuery({
        queryKey: ['person-tv', id],
        queryFn: async () => axios.get(`${BACKEND_BASE_URL}/person/${id}/tv-credits`).then(res => res.data as PersonTv)
    })
}

// Expose the backend URL for image handling since images are not proxied
export const IMAGE_URL = "https://image.tmdb.org/t/p"