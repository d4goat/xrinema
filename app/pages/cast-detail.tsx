import * as react from "react";
import { useParams, Link, useSearchParams, } from "react-router";
import { IMAGE_URL, usePersonDetail } from "~/api/tmdb";
import type { Route } from "./+types/cast-detail";
import { Button } from "~/components/ui/button";

export async function loader({ params, request }: Route.LoaderArgs) {
    const url = new URL(request.url);
    const person_name = url.searchParams.get('name');
    return {
        person_id: params.person_id,
        person_name
    };
}

// Meta function menggunakan data dari loader
export function meta({ data }: Route.MetaArgs) {
    return [
        { title: `${data?.person_name || 'Person'} | Details` },
        { name: "Cast-Detail", content: "Cast Detail Page" }
    ];
}

const CastDetail = () => {
    const { person_id } = useParams();
    const [expanded, setExpanded] = react.useState(false);
    if (person_id) {
        const { data: person, isLoading } = usePersonDetail({ id: person_id })

        if (isLoading) {
            return (
                <main className="pt-20 p-4 min-h-dvh container mx-auto">
                    <div>Loading person details...</div>
                </main>
            )
        }

        return (
            <main className="pt-24 min-h-dvh">
                <div className="container mx-auto flex gap-10">
                    <div className="flex flex-col gap-6">
                        <img src={`${IMAGE_URL}/original${person?.profile_path}`} className="w-80 h-[30rem] rounded-lg" alt="" />
                    </div>
                    <div className="flex flex-col flex-1 gap-7">
                        <h1 className="text-3xl font-bold">{person?.name}</h1>

                        <div className="space-y-3">
                            <h2 className="text-xl font-semibold">Biography</h2>
                            <div className="relative">
                                <div className={`relative ${!expanded ? "max-h-48 overflow-hidden" : ""}`}>
                                    <p className="whitespace-pre-line">{person?.biography}</p>

                                    {!expanded && (
                                        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-neutral-900 via-neutral-900/90 to-transparent flex items-end justify-center pb-2">
                                            <Button
                                                variant="ghost"
                                                onClick={() => setExpanded(true)}
                                                className="hover:bg-transparent hover:text-gray-500 hover:cursor-pointer"
                                            >
                                                See More
                                            </Button>
                                        </div>
                                    )}
                                </div>

                                {expanded && (
                                    <div className="flex justify-center mt-4">
                                        <Button
                                            variant="ghost"
                                            onClick={() => setExpanded(false)}
                                            className="hover:bg-transparent hover:text-gray-500 hover:cursor-pointer"
                                        >
                                            Show Less
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        )
    }

    return (
        <main className="pt-20 p-4 min-h-dvh container mx-auto">
            <div>Person ID not Found</div>
        </main>
    )
}

export default react.memo(CastDetail)