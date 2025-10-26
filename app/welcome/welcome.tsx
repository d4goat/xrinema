import { IMAGE_URL, useMoviesDetail, useMoviesTopRated, usePopularMovies, useUpcomingMovie } from "~/api/tmdb"
import type { Movie } from "~/types/movie"
import { Carousel, CarouselContent, CarouselItem } from "~/components/ui/carousel"
import Autoplay from 'embla-carousel-autoplay'
import useEmblaCarousel from "embla-carousel-react"
import React from "react"
import { Skeleton } from "~/components/ui/skeleton"
import { Link } from "react-router"
import CarouselCard from "~/components/CarouselCard"

export default function Home() {
    const { data: movies, isLoading} = usePopularMovies()
    const { data: topRatedMovie, isLoading: isLoadingTop } = useMoviesTopRated()
    const { data: upcomingMovie, isLoading: isLoadingUpcoming} = useUpcomingMovie()

    // console.log(upcomingMovie.data)

    const plugin = React.useRef(
        Autoplay({ delay: 2000, stopOnInteraction: true })
    )
    return (
        <div className="space-y-6">
            <div className="relative w-full">
                <img src="./2.png" className="grayscale brightness-50 h-[95vh] object-cover w-full" alt="" />
                <div className="absolute inset-0 bg-gradient-to-b from-black from-0% via-black/60 via-60% to-transparent mix-blend-multiply"></div>
                <h1 className="absolute top-50 start-1/2 -translate-x-1/2 text-title-xl font-semibold text-center tracking-wider">Millions of movie, TV shows and people to discover. Explore now with D-Moviez</h1>
            </div>

            {/* Trending Movie */}
            <div className="flex flex-col gap-4 p-4">
                <h2 className="text-2xl font-semibold">Trending Movie</h2>
                {isLoading ? (
                    <div className="flex gap-3">
                        {Array.from({ length: 7 }).map((_: any, index: number) => (
                            <Skeleton key={index} className="h-90 w-56" />
                        ))}
                    </div>
                ) : (
                    <div className="mx-10">
                        <CarouselCard  item={movies} autoplay useNext></CarouselCard>
                    </div>
                )}
            </div>

            {/* Top Rated Movie */}
            <div className="flex flex-col gap-4 p-4">
                <h2 className="text-2xl font-semibold">Top Rated Movie</h2>
                {isLoadingTop ? (
                    <div className="flex gap-3">
                        {Array.from({ length: 7 }).map((_: any, index: number) => (
                            <Skeleton key={index} className="h-90 w-56" />
                        ))}
                    </div>
                ) : (
                    <div className="mx-10">
                    <CarouselCard useNext  item={topRatedMovie} autoplay></CarouselCard>
                    </div>
                )}
            </div>

            {/* Upcoming Movies */}
            <div className="flex flex-col gap-4 p-4">
                <h2 className="text-2xl font-semibold">Upcoming Movie</h2>
                {isLoadingUpcoming ? (
                    <div className="flex gap-3">
                        {Array.from({ length: 7 }).map((_: any, index: number) => (
                            <Skeleton key={index} className="h-90 w-56" />
                        ))}
                    </div>
                ) : (
                    <div className="mx-10">
                    <CarouselCard useNext item={upcomingMovie} autoplay></CarouselCard>
                    </div>
                )}
            </div>
        </div>
    )
}