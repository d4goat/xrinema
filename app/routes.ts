import { type RouteConfig, index, layout, prefix, route } from "@react-router/dev/routes";

export default [
    layout("./layouts/AppLayout.tsx", [
        index("routes/home.tsx"),
        ...prefix("movie/:movie_id/:movie_title", [
            index("./pages/movie-detail.tsx"),
            route("cast", "./pages/movie-credits.tsx")
        ]),
        ...prefix("person/:person_id", [
            index("./pages/cast-detail.tsx"),
            route("more-movie", "./pages/movie-per-cast.tsx")
        ])
    ]),
] satisfies RouteConfig;
