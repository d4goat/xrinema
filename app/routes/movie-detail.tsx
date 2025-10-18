import type { Route } from "../pages/+types/movie-detail";
import MovieDetail from "~/pages/movie-detail"

export function meta({}: Route.MetaArgs){
    return [
        { title: "" },
        { name: "Movie-Detail", content: "Movie Detail Page" },
    ]
}

export default function MovieDetailRoute(){
    return <MovieDetail />
}
