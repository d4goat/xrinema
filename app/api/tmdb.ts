import axios from "axios"
import { useQuery } from "@tanstack/react-query"
import type { Credits, Movie, MovieDetail, Video } from "~/types/movie"

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

// Expose the backend URL for image handling since images are not proxied
export const IMAGE_URL = "https://image.tmdb.org/t/p"