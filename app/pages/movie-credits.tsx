import * as react from "react"
import { Link, useParams, useLocation } from "react-router"
import { IMAGE_URL, useMovieCredits, useMoviesDetail } from "~/api/tmdb"
import type { Route } from "./+types/movie-credits"
import { Card, CardContent } from "~/components/ui/card"
import moment from "moment"
import { Button } from "~/components/ui/button"
import { ArrowLeft } from "lucide-react"
import type { Cast } from "~/types/movie"
import _ from "lodash"

export function meta({ }: Route.MetaArgs) {
    const { movie_title } = useParams()

    return [
        { title: `${movie_title} | Cast` },
        { name: "Movie-Credits", content: "Movie Credits Page" },
    ]
}

const MovieCredits = () => {
    const { movie_id } = useParams()
    if (movie_id) {
        const { data: movie } = useMoviesDetail({ id: movie_id })
        const { data: credits } = useMovieCredits({ id: movie_id })
        const loc = useLocation()

        const groupedCrew = react.useMemo(() => {
            if (!credits?.crew) return {};

            return _.groupBy(credits.crew, 'known_for_department')
        }, [credits?.crew])

        return (
            <main className="container mx-auto pt-20 mb-10 min-h-dvh flex flex-col gap-6">
                <Card>
                    <CardContent className="flex items-center gap-4">
                        <img src={`${IMAGE_URL}/original${movie?.poster_path}`} className="h-44 rounded-lg" alt={movie?.title} />
                        <div className="space-y-3">
                            <h1 className="md:text-4xl font-bold">{movie?.title} <span className="font-normal text-gray-300">({moment(movie?.release_date).format('YYYY')})</span></h1>
                            <Link to={`${loc.pathname.replace('/cast', '')}`}>
                                <Button variant={"ghost"} className="text-lg text-gray-300"><ArrowLeft /> Back to the main</Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-2">
                    <div className="flex flex-col gap-3">
                        <h1 className="text-xl font-semibold">Cast <span className="text-gray-400">({credits?.cast.length})</span></h1>
                        {credits?.cast.map((item: Cast, index: number) => (
                            <div className="flex items-center gap-4" key={index}>
                                <img className="h-20 w-20 object-cover rounded-lg" src={item.profile_path != null ? `${IMAGE_URL}/original${item.profile_path}` : '../../../public/blank.png'} alt={item.name} />
                                <div className="flex flex-col gap-1">
                                    <span className="text-lg font-bold">{item.name}</span>
                                    <span>{item.character}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex flex-col gap-3">
                        <h1 className="text-xl font-semibold">Crew <span className="text-gray-400">({credits?.crew.length})</span></h1>
                        {Object.entries(groupedCrew).map(([departement, members]) => (
                            <div key={departement} className="flex flex-col gap-3">
                                <h2 className="text-lg font-semibold">{departement} &nbsp;
                                    <span className="text-sm text-gray-400">({members.length})</span>
                                </h2>

                                <div className="flex flex-col gap-3">
                                    {members.map((item: Cast, index: number) => (
                                        <div key={`${departement}-${index}`} className="flex items-center gap-4">
                                            <img className="h-20 w-20 object-cover rounded-lg" src={item.profile_path != null ? `${IMAGE_URL}/original${item.profile_path}` : '../../../public/blank.png'} alt={item.name} />
                                            <div className="flex flex-col">
                                                <span className="text-lg font-bold">{item.name}</span>
                                                <span className="text-gray-400">{item.job}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        )
    }

    return <div className="pt-20 min-h-dvh text-4xl" >Invalid Movie Id</div>
}

export default react.memo(MovieCredits)