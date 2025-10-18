import * as react from "react"
import { Button } from "~/components/ui/button"
import { IMAGE_URL, useMoviesDetail, useMovieTrailer } from "~/api/tmdb"
import { useParams } from "react-router"
import type { Route } from "./+types/movie-detail"
import { Card, CardContent } from "~/components/ui/card"
import moment from "moment"
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "~/components/ui/drawer"
import type { Video } from "~/types/movie"

export function meta({ }: Route.MetaArgs) {
    const { movie_title } = useParams()
    return [
        { title: `${movie_title} | Details` || "Movie Detail" },
        { name: "Movie-Detail", content: "Movie Detail Page" },
    ]
}

const MovieDetail = () => {
    const { movie_id } = useParams()
    if (movie_id) {
        const { data: movie, isLoading, error } = useMoviesDetail({ id: movie_id })
        const { data: trailer } = useMovieTrailer({ id: movie_id })

        react.useEffect(() => console.log(trailer))

        if (isLoading) {
            return (
                <main className="pt-16 p-4 min-h-dvh container mx-auto">
                    <div>Loading movie details...</div>
                </main>
            )
        }

        return (
            <div style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.9)), url(${IMAGE_URL}/original${movie?.backdrop_path})`, height: '100vh', backgroundSize: 'cover' }}>
                <Drawer >
            <main className="container mx-auto pt-20">
                {/* <img src={`${IMAGE_URL}/original${movie?.backdrop_path}`} alt={movie?.title} className="absolute top-0 left-0 w-full h-full -z-30" /> */}
                <Card className="bg-neutral-800/50 text-white border-neutral-500">
                    <CardContent className="flex items-center gap-8">
                        <img src={`${IMAGE_URL}/original${movie?.poster_path}`} alt={movie?.title} className="w-60 h-88 rounded-lg" />
                        <div className="flex flex-col flex-1 gap-4">
                            <div>
                                <h2 className="text-3xl font-bold">{movie?.title} ({moment(movie?.release_date).format('YYYY')})</h2>
                                <span className="text-gray-400">{movie?.release_date} | {movie?.genres?.map(item => item.name).join(', ')} | {movie?.runtime} minutes </span>
                            </div>
                            <DrawerTrigger asChild>
                                <Button className="w-fit text-lg cursor-pointer" size={"lg"} variant={"secondary"} onClick={() => ""}>Trailer</Button>
                            </DrawerTrigger>
                            <DrawerContent className="bg-neutral-800">
                                <DrawerHeader>
                                    <DrawerTitle className="text-white">{movie?.title} Trailer</DrawerTitle>
                                    </DrawerHeader>
                                    <iframe src={`https://www.youtube.com/embed/${trailer?.find(item => item.type === 'Trailer')?.key}`}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                        height={500}
                                        className="m-5"
                                    ></iframe>
                            </DrawerContent>
                        </div>
                    </CardContent>
                </Card>
            </main>
                </Drawer>
            </div>
        )
    }
    return (
                <main className="pt-16 p-4 container mx-auto">
                    <div>Error loading movie details: Movie ID not found</div>
                </main>
            )
}

export default react.memo(MovieDetail)