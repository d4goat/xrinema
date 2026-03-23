import { IMAGE_URL, useMoviesDetail, useMoviesTopRated, usePopularMovies, useUpcomingMovie } from "~/api/tmdb"
import type { Movie } from "~/types/movie"
import { Carousel, CarouselContent, CarouselItem } from "~/components/ui/carousel"
import Autoplay from 'embla-carousel-autoplay'
import useEmblaCarousel from "embla-carousel-react"
import React from "react"
import { Skeleton } from "~/components/ui/skeleton"
import { Link } from "react-router"
import CarouselCard from "~/components/CarouselCard"
import { motion } from 'framer-motion'

const Hero = () => (
    <section className="relative w-full min-h-screen pt-80">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7 }} className="absolute inset-0 z-0">
            <img src="./hero.png" className=" object-cover w-full" alt="" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/30 to-black/60"></div>
        </motion.div>
        <div className="container relative z-50 px-8">
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-5xl font-semibold tracking-wider w-[60%] text-gray-300">Millions of movie, TV shows and people to discover.</motion.h1>
        </div>
    </section>
)

const MovieCarousel = ({ data, title, isLoading }: { data: any, title: string, isLoading: boolean }) => {
    return (
        <div className="flex flex-col gap-4 p-4">
            <h2 className="text-2xl font-semibold">{title}</h2>
            {isLoading ? (
                <div className="flex gap-3">
                    {Array.from({ length: 7 }).map((_: any, index: number) => (
                        <Skeleton key={index} className="h-90 w-56" />
                    ))}
                </div>
            ) : (
                <div className="mx-10">
                    <CarouselCard item={data} autoplay useNext></CarouselCard>
                </div>
            )}
        </div>
    )
}

export default function Home() {
    const { data: movies, isLoading } = usePopularMovies()
    const { data: topRatedMovie, isLoading: isLoadingTop } = useMoviesTopRated()
    const { data: upcomingMovie, isLoading: isLoadingUpcoming } = useUpcomingMovie()

    // console.log(upcomingMovie.data)

    return (
        <div className="space-y-6">
            <Hero />
            {/* Trending Movie */}
            <div className="mt-24">
                <MovieCarousel isLoading={isLoading} data={movies} title="Trending Movie" />

                {/* Top Rated Movie */}
                <MovieCarousel isLoading={isLoadingTop} data={topRatedMovie} title="Top Rated Movie" />

                {/* Upcoming Movies */}
                <MovieCarousel isLoading={isLoadingUpcoming} data={upcomingMovie} title="Upcoming Movie" />
            </div>
        </div>
    )
}