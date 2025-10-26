import Autoplay from "embla-carousel-autoplay";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext, type CarouselApi } from "./ui/carousel";
import * as react from "react"
import { Link } from "react-router";
import { IMAGE_URL } from "~/api/tmdb";
import { Skeleton } from "./ui/skeleton";

type CarouselCardProps = {
    autoplay?: boolean;
    item: any[];
    seeMore?: boolean
    useNext?: boolean;
    onLoadMore?: () => void;
    hasMore?: boolean;
    isLoadingMore?: boolean
}

const LazyCarouseItem = ({item}: { item: any }) => {
    const [isVisible, setIsVisible] = react.useState(false)
    const [hasError, setHasError] = react.useState(false)
    const imgRef = react.useRef<HTMLDivElement>(null)

    react.useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if(entry.isIntersecting) {
                        setIsVisible(true)
                        observer.disconnect()
                    }
                })
            }, {
                rootMargin: '50px',
                threshold: 0.01
            }
        )

        if(imgRef.current) observer.observe(imgRef.current);

        return () => observer.disconnect()
    }, [])

    return (
        <div ref={imgRef} className="space-y-3">
            <div className="relative w-56 h-80">
                {!isVisible ? (
                    <Skeleton className="w-56 h-80"></Skeleton>
                ) : hasError ? (
                    <div className="w-56 h-80 bg-gray-300 rounded-lg flex items-center justify-center">
                        <span className="text-gray-500 text-sm">No Image</span>
                    </div>
                ) : (
                    <img loading="lazy" onError={() => setHasError(true)} className="w-56 h-80 rounded-lg hover:scale-105 transition-transform duration-300" src={`${IMAGE_URL}/original${item.poster_path}` || ""} alt={item.title} />
                )}
            </div>
            <h2 className="text-lg font-semibold leading-relaxed">{item.title}</h2>
        </div>
    )
}

const CarouselCard: react.FC<CarouselCardProps> = ({ autoplay = false, item, seeMore = false, useNext = false,
    onLoadMore,
    hasMore = false,
    isLoadingMore = false

 }) => {

    const [api, setApi] = react.useState<CarouselApi>()
    const [currentIndex, setCurrentIndex] = react.useState(0)
    const hasTriggeredLoadMore = react.useRef(false)
    const plugin = react.useRef(
        Autoplay({ delay: 3000, stopOnInteraction: true })
    )

    const handlerMouseEnter = react.useCallback(() => {
        if(autoplay) {
            plugin.current.stop()
        }
    }, [autoplay])

    const handlerMouseLeave = react.useCallback(() => {
        if(autoplay) {
            plugin.current.reset()
        }
    }, [autoplay])

    react.useEffect(() => {
        if (!api) return

        const onSelect = () => {
            const selected = api.selectedScrollSnap()
            setCurrentIndex(selected)
        }

        api.on('select', onSelect)
        onSelect() // Set initial index

        return () => {
            api.off('select', onSelect)
        }
    }, [api])

     react.useEffect(() => {
        const totalItems = item.length
        const threshold = Math.max(totalItems - 5, 0) // Trigger 5 item sebelum akhir

        // Reset flag ketika item bertambah (setelah fetch)
        if (hasTriggeredLoadMore.current && totalItems > threshold) {
            hasTriggeredLoadMore.current = false
        }

        // Trigger load more
        if (
            currentIndex >= threshold && 
            hasMore && 
            !isLoadingMore && 
            !hasTriggeredLoadMore.current &&
            onLoadMore
        ) {
            hasTriggeredLoadMore.current = true
            onLoadMore()
        }
    }, [currentIndex, item.length, hasMore, isLoadingMore, onLoadMore])

    return (
        <Carousel 
            setApi={setApi}
            plugins={autoplay ? [plugin.current] : undefined} 
            onMouseEnter={handlerMouseEnter}
            onMouseLeave={handlerMouseLeave}
        >
            <CarouselContent className={`mx-6 ${seeMore ? 'flex items-center' : ''}`}>
                {item.map((item, index) => (
                    <CarouselItem className="max-w-58 py-3" key={`${item.id}-${index}`}>
                        <Link to={{ pathname: `movie/${item.id}/${item.title}` }}>
                            <LazyCarouseItem item={item} />
                        </Link>
                    </CarouselItem>
                ))}
                
                {/* Loading indicator */}
                {isLoadingMore && (
                    <CarouselItem className="max-w-58 py-3">
                        <div className="space-y-3">
                            <div className="w-56 h-80 bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">
                                <span className="text-gray-500">Loading...</span>
                            </div>
                            <div className="h-6 bg-gray-200 animate-pulse rounded"></div>
                        </div>
                    </CarouselItem>
                )}
            </CarouselContent>
            {useNext && (
                <>
                    <CarouselNext />
                    <CarouselPrevious />
                </>
            )}
        </Carousel>
    )
}

export default react.memo(CarouselCard);