import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";
import { Link } from "react-router";

interface navItem {
    name: string,
    link: string
}

const navbar = () => {
    const nav: navItem[] = [
        {
            name: "Home",
            link: '/'
        },
        {
            name: "Trending",
            link: '/'
        },
        {
            name: "Top Rated",
            link: '/about'
        },
        {
            name: "Upcoming",
            link: '/about'
        },
    ]

    return (
        <header>
            <nav id="navbar" className={`px-7 py-5 bg-neutral-900/40 backdrop-blur-xl z-50 flex justify-between fixed w-full transition-all duration-200`}>
                <h2 className="text-2xl font-bold"><a href="/">Xrinema</a></h2>
                <div className="flex items-center gap-3">
                    <ul className=" flex gap-7">
                        {nav.map((item, index) => (
                            <li key={index} className="relative group">
                                <Link to={item.link} className="">{item.name}</Link>
                                <span className="block h-0.5 bg-primary max-w-0 group-hover:max-w-full transition-all duration-300" />
                            </li>
                        ))}
                    </ul>
                    <ModeToggle />
                </div>
            </nav>
        </header>
    )
}

export default navbar;