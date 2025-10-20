import { type RouteConfig, index, layout, prefix, route } from "@react-router/dev/routes";

export default [
    layout("./layouts/AppLayout.tsx", [
        index("routes/home.tsx"),
        ...prefix("movie/:movie_id/:movie_title", [
            index("./pages/movie-detail.tsx"),
            route("cast", "./pages/movie-credits.tsx")
        ]),
        route("person/:person_id", "./pages/cast-detail.tsx")
    ]),
] satisfies RouteConfig;
