import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
    layout("./layouts/AppLayout.tsx", [
        index("routes/home.tsx"),
        route("/movie/:movie_id", "./pages/movie-detail.tsx")
    ])
] satisfies RouteConfig;
