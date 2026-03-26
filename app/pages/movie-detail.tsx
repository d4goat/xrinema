import * as react from "react"
import { Button } from "~/components/ui/button"
import { IMAGE_URL, useMovieCredits, useMoviesDetail, useMoviesSimilar, useMovieTrailer, useMovieKeywords } from "~/api/tmdb"
import { Link, useParams } from "react-router"
import type { Route } from "./+types/movie-detail"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import moment from "moment"
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "~/components/ui/drawer"
import type { Video, Cast } from "~/types/movie"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "~/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import { ArrowRight, ChevronLeft } from "lucide-react"
import CarouselCard from "~/components/CarouselCard"
import { Badge } from "~/components/ui/badge"

export function meta({ }: Route.MetaArgs) {
    const { movie_title } = useParams()
    return [
        { title: `${movie_title} | Details` || "Movie Detail" },
        { name: "Movie-Detail", content: "Movie Detail Page" },
    ]
}

const movieMoreInfoData = [
    {
        title: 'Movie Status',
        key: 'status'
    },
    {
        title: 'Original Language',
        key: 'original_language'
    },
    {
        title: 'Movie Budget',
        key: 'budget'
    },
    {
        title: 'Movie Revenue',
        key: 'revenue'
    },
] as const

const MovieDetail = () => {
    const { movie_id, movie_title } = useParams()
    const [page, setPage] = react.useState(1)
    const [allSimilarMovies, setAllSimilarMovies] = react.useState<any[]>([])

    if (movie_id) {
        const { data: movie, isLoading, error } = useMoviesDetail({ id: movie_id })
        const { data: keywords, isLoading: isLoadingKeywords } = useMovieKeywords({ id: movie_id })
        const { data: trailer } = useMovieTrailer({ id: movie_id })
        const { data: credits } = useMovieCredits({ id: movie_id })
        const { data: similar, isLoading: isLoadingSimilar, refetch } = useMoviesSimilar({ id: movie_id, page: page })

        const plugin = react.useRef(
            Autoplay({ delay: 2000, stopOnInteraction: true })
        )

        react.useEffect(() => {
            if (similar?.results) {
                setAllSimilarMovies(prev => {
                    // Prevent duplicate berdasarkan ID
                    const existingIds = new Set(prev.map(m => m.id))
                    const newMovies = similar.results.filter((m: any) => !existingIds.has(m.id))

                    // Hanya tambahkan jika ada data baru
                    if (newMovies.length > 0) {
                        console.log(`Added ${newMovies.length} new movies from page ${page}`)
                        return [...prev, ...newMovies]
                    }
                    return prev
                })
            }
        }, [similar, page])

        react.useEffect(() => {
            if (page > 1) {
                refetch()
            }
        }, [page, refetch])

        const handleLoadMore = react.useCallback(() => {
            if (similar && page >= similar.total_pages) {
                console.log('No more pages available')
                return
            }

            if (isLoadingSimilar) {
                console.log('Already loading, please wait')
                return
            }

            console.log(`Loading page ${page + 1}...`)
            setPage(prev => prev + 1)
        }, [])

        const hasMore = similar ? page < similar.total_pages : false

        if (movie) {
            movie.budget = movie.budget === 0 ? '-' : movie.budget
            movie.revenue = movie.revenue === 0 ? '-' : movie.revenue
        }

        if (isLoading || isLoadingKeywords) {
            return (
                <main className="pt-20 p-4 min-h-dvh container mx-auto">
                    <div>Loading movie details...</div>
                </main>
            )
        }

        if (error || movie == null || movie == undefined || keywords == undefined || keywords.keywords == undefined) {
            console.log(keywords?.keywords)
            return <div className="pt-20 min-h-dvh container mx-auto">Error loading movie details</div>
        }

        return (
            <main className="min-h-dvh pb-5" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.9)), url(${IMAGE_URL}/original${movie?.backdrop_path})`, backgroundSize: 'cover' }}>
                <Drawer >
                    <div className="container mx-auto pt-20 flex flex-col gap-6">
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
                        <Link to="/"><Button className="mb-3 cursor-pointer"><ChevronLeft /> Back</Button></Link>
                        <Card>
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

                        <div className="grid grid-cols-3 gap-3">
                            <div className="flex flex-col gap-4 w-full col-span-2">
                                <h1 className="text-2xl font-bold">Cast Info</h1>
                                <Carousel className="mx-12" plugins={[plugin.current]} onMouseEnter={plugin.current.stop} onMouseLeave={plugin.current.reset}>
                                    <CarouselContent className="mx-6 flex items-center">
                                        {credits?.cast?.slice(0, 10).map((item: Cast, index: number, arr: Cast[]) => (
                                            <react.Fragment key={item.id}>
                                                <CarouselItem className="max-w-52">
                                                    <Link to={`/person/${item.id}?name=${encodeURIComponent(item.name)}`} className="hover:cursor-pointer">
                                                        <Card className="pt-0 border-none gap-2">
                                                            <CardHeader className="!p-0">
                                                                <img className="h-60 w-full rounded-t-lg" src={item.profile_path != null ? `${IMAGE_URL}/original/${item.profile_path}` : '../../blank.png'} alt={item.name} />
                                                            </CardHeader>
                                                            <CardContent className="p-2">
                                                                <div>
                                                                    <p className="font-semibold text-">{item.name}</p>
                                                                    <p className="text-primary/80 text-sm">as <br />{item.character}</p>
                                                                </div>
                                                            </CardContent>
                                                        </Card>
                                                    </Link>
                                                </CarouselItem>
                                                {index === arr.length - 1 && (
                                                    <Link to={`cast`}>
                                                        <Button variant={"ghost"} className="ml-3">See More <ArrowRight /></Button>
                                                    </Link>
                                                )}
                                            </react.Fragment>
                                        ))}
                                    </CarouselContent>
                                    <CarouselNext />
                                    <CarouselPrevious />
                                </Carousel>
                            </div>

                            <Card>
                                <CardHeader><CardTitle>More {movie.title} Info</CardTitle></CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {movieMoreInfoData.map((item, index) => (
                                            <react.Fragment key={`${item.title}-${index}`}>
                                                <h3 className="font-semibold">{item.title}</h3>
                                                <p className="text-sm">{item.key === 'budget' || item.key === 'revenue' ? `$ ${movie[item.key]}` : movie[item.key]}</p>
                                            </react.Fragment>
                                        ))}
                                    </div>
                                    <h3 className="font-semibold">Keywords</h3>
                                    <div className="flex gap-2 flex-wrap mt-2">
                                        {keywords?.keywords.map((item) => (
                                            <react.Fragment key={item.id}>
                                                <Badge className="text-sm">{item.name}</Badge>
                                            </react.Fragment>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                        </div>
                        <div className="flex flex-col gap-4 mt-4 p-4">
                            <h1 className="text-2xl font-semibold">Similar Movie</h1>
                            {allSimilarMovies.length > 0 &&
                                <CarouselCard
                                    item={allSimilarMovies}
                                    useNext={true}
                                    onLoadMore={handleLoadMore}
                                    hasMore={hasMore}
                                    isLoadingMore={isLoadingSimilar && page > 1}
                                />
                            }
                        </div>
                    </div>
                </Drawer>
            </main>
        )
    }
    return (
        <main className="pt-16 p-4 container mx-auto">
            <div>Error loading movie details: Movie ID not found</div>
        </main>
    )
}

export default react.memo(MovieDetail)