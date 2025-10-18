import * as react from "react";
import { Link, Outlet, useLocation } from "react-router";
import { Button } from "~/components/ui/button";
import { usePopularMovies } from "~/api/tmdb";
import {User} from 'lucide-react'
import Navbar from "~/components/navbar";

export default function AppLayout(){

    return (
        <div className="bg-neutral-900 text-white">
        <Navbar/>
        <main>
            <Outlet/>
        </main>
        <footer className="px-4 pb-2 pt-3 border-t-2">
            <Button variant="ghost">Privacy Policy</Button>
            <Button variant="ghost">Terms of Service</Button>
        </footer>
        </div>
    )
}