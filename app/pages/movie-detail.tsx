import * as react from "react"
import { Button } from "~/components/ui/button"
import { useMoviesDetail } from "~/api/tmdb"
import { useParams } from "react-router"

const movie_detail = () => {
    const { movie_id } = useParams()

    return (
        <main>
            
        </main>
    )
}

export default react.memo(movie_detail)