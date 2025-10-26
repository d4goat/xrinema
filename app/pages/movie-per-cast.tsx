import * as react from 'react'
import { IMAGE_URL, usePersonCombinedCredits, usePersonDetail } from '~/api/tmdb'
import type { Route } from './+types/movie-per-cast'
import { useParams, useLoaderData, Link } from 'react-router'
import _ from 'lodash'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import type { PersonCombined } from '~/types/person'
import { Skeleton } from '~/components/ui/skeleton'
import { Separator } from '~/components/ui/separator'

export function loader({ params, request }: Route.LoaderArgs) {
    const url = new URL(request.url)
    const person_name = url.searchParams.get('name')
    return {
        person_id: params.person_id,
        person_name
    }
}

export function meta({ data }: Route.MetaArgs) {
    return [
        { title: data.person_name },
        { name: "Movie-Per-Cast", content: "Movie Per Cast Page" },
    ]
}

const LazyMovie = ({ item, media_type }: { item: PersonCombined, media_type: string }) => {
    const [isVisible, setIsVisible] = react.useState(false)
    const imgRef = react.useRef<HTMLDivElement>(null)

    react.useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true)
                        observer.disconnect()
                    }
                })
            },
            {
                rootMargin: '100px',
                threshold: 0.01
            }
        )

        if (imgRef.current) {
            observer.observe(imgRef.current)
        }

        return () => observer.disconnect()
    }, [])

    return (
        <div key={`${media_type}-${item.id}`} ref={imgRef} className='min-h-72'>
            {isVisible ? (
                <Link to={`/movie/${item.id}/${item.media_type == 'movie' ? item.title : item.name}`} className='space-y-3'>
                    <img
                        className='w-56 h-76 object-cover rounded-lg'
                        src={`${IMAGE_URL}/original${item.poster_path}`}
                        alt={item.title || item.name || 'Movie poster'}
                        loading="lazy"
                    />
                    <h2 className='text-lg font-medium'>{item.media_type == 'movie' ? item.title : item.name}</h2>
                </Link>

            ) : (
                <Skeleton className='w-56 h-72'></Skeleton>
            )}
        </div>
    )
}

const MediaTypeSection = ({ media_type, movies }: { media_type: string, movies: PersonCombined[] }) => {
    const [displayCount, setDisplayCount] = react.useState(10)
    const loadMoreRef = react.useRef<HTMLDivElement>(null)

    const displayedMovies = react.useMemo(() => {
        return movies.slice(0, displayCount)
    }, [movies, displayCount])

    react.useEffect(() => {
        if (displayCount >= movies.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setDisplayCount(prev => Math.min(prev + 10, movies.length))
                }
            },
            {
                rootMargin: '200px'
            }
        )

        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current)
        }

        return () => observer.disconnect()
    }, [displayCount, movies.length])

    return (
        <div className="mb-8">
            <h2 className="text-lg font-semibold capitalize mb-4">
                {media_type} ({movies.length})
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                {displayedMovies.map((item: PersonCombined) => (
                    <LazyMovie
                        key={`${media_type}-${item.id}`}
                        item={item}
                        media_type={media_type}
                    />
                ))}
            </div>

            {displayCount < movies.length && (
                <div ref={loadMoreRef} className="h-10 flex items-center justify-center mt-4">
                    <div className="text-sm text-gray-500">Loading more...</div>
                </div>
            )}
        </div>
    )
}

const MoviePerCast = () => {
    const { person_id } = useParams()
    const { person_name } = useLoaderData()

    if (person_id) {
        const { data: credits } = usePersonCombinedCredits({ id: person_id })

        const groupedCredits = react.useMemo(() => {
            if (!credits?.cast) return {};

            return _.groupBy(credits.cast, 'media_type')
        }, [credits])

        return (
            <main className='container mx-auto pt-20 min-h-dvh'>
                <Card>
                    <CardHeader>
                        <CardTitle className='text-2xl'>
                            {person_name} Movie
                            <Separator className='mt-3' />
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {Object.entries(groupedCredits).map(([media_type, movie]) => (
                            <MediaTypeSection key={media_type} media_type={media_type} movies={movie as PersonCombined[]} />
                        ))}
                    </CardContent>
                </Card>
            </main>
        )
    }

    return <div className='container mx-auto pt-20 capitalize'>No person id found</div>
}

export default react.memo(MoviePerCast)