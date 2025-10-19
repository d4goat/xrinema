import * as react from "react"
import { Button } from "~/components/ui/button"
import { IMAGE_URL, useMovieCredits, useMoviesDetail, useMovieTrailer } from "~/api/tmdb"
import { Link, useParams } from "react-router"
import type { Route } from "./+types/movie-detail"
import { Card, CardContent } from "~/components/ui/card"
import moment from "moment"
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "~/components/ui/drawer"
import type { Video, Cast } from "~/types/movie"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "~/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import { ArrowLeft, ArrowRight } from "lucide-react"

export function meta({ }: Route.MetaArgs) {
    const { movie_title } = useParams()
    return [
        { title: `${movie_title} | Details` || "Movie Detail" },
        { name: "Movie-Detail", content: "Movie Detail Page" },
    ]
}

const MovieDetail = () => {
    const { movie_id, movie_title } = useParams()
    if (movie_id) {
        const { data: movie, isLoading, error } = useMoviesDetail({ id: movie_id })
        const { data: trailer } = useMovieTrailer({ id: movie_id })
        const { data: credits } = useMovieCredits({ id: movie_id })

        react.useEffect(() => {
            if (movie) {
                console.log(movie)
            }
        }, [movie])

        const plugin = react.useRef(
                Autoplay({ delay: 2000, stopOnInteraction: true })
            )

        if (isLoading) {
            return (
                <main className="pt-20 p-4 min-h-dvh container mx-auto">
                    <div>Loading movie details...</div>
                </main>
            )
        }

        return (
            <div className="h-full pb-5" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.9)), url(${IMAGE_URL}/original${movie?.backdrop_path})`, backgroundSize: 'cover' }}>
                <Drawer >
                    <main className="container mx-auto pt-20 space-y-6">
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
                        <Link to="/"><Button className="mb-3 cursor-pointer bg-transparent border hover:bg-neutral-800/50 transition-colors duration-200"><ArrowLeft/> Back</Button></Link>
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
                                    <span className="text-gray-400"> {movie?.tagline} </span>
                                    <div className="space-y-1">
                                        <h2 className="text-2xl font-bold">Synopsis</h2>
                                        <p className="text-[.9rem]"> {movie?.overview} </p>
                                    </div>
                                    <div className="space-y-1">
                                        <h2 className="text-xl font-bold">Cast</h2>
                                        <div className="">{credits?.cast.slice(0, 5).map((item: Cast) => item.name).join(', ')}</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex flex-col gap-4">
                            <h1 className="text-2xl font-bold">Cast Info</h1>
                            <Carousel plugins={[plugin.current]} onMouseEnter={plugin.current.stop} onMouseLeave={plugin.current.reset}>
                                <CarouselContent className="mx-6 flex items-center">
                                    {credits?.cast.slice(0, 10).map((item: Cast, index: number) =>
                                    (
                                        <>
                                        <CarouselItem key={index} className="flex flex-col max-w-58 py-3 gap-3">
                                            <img className="w-46 h-58 rounded-lg" src={`${IMAGE_URL}/original/${item.profile_path}`} alt={item.name} />
                                            <p className="text-lg font-semibold">{item.name} {index}</p>

                                        </CarouselItem>
                                            {index === 9 ? <Link to={`cast`}>
                                                <Button variant={"ghost"} className="hover:bg-transparent hover:text-gray-500 hover:cursor-pointer">See More <ArrowRight/></Button>
                                            </Link> : <></>}
                                        </>
                                    )
                                    )}
                                </CarouselContent>
                                <CarouselNext className="text-black disabled:text-gray-700 hover:cursor-pointer"/>
                                <CarouselPrevious className="text-black disabled:text-gray-700 hover:cursor-pointer"/>
                            </Carousel>
                        </div>
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