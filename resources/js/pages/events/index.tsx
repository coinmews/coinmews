import EventCard from '@/components/events/event-card';
import Footer from '@/components/sections/footer';
import Header from '@/components/sections/header';
import { Button } from '@/components/ui/button';
import { DateRangePicker } from '@/components/ui/date-time-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Head, Link, router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Filters {
    type?: string;
    status?: string;
    event_type?: string;
    sort_by?: string;
    start_date?: string;
    end_date?: string;
}

interface Event {
    id: number;
    title: string;
    slug: string;
    description: string;
    type: 'crypto_event' | 'web3_event' | 'community_event' | 'ai_event';
    start_date: string;
    end_date: string;
    location: string | null;
    is_virtual: boolean;
    virtual_link: string | null;
    registration_link: string | null;
    max_participants: number | null;
    current_participants: number;
    banner_image: string | null;
    banner_url: string | null;
    status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
    registration_status: 'open' | 'ongoing' | 'closed' | 'full';
    duration: string;
    organizer: {
        id: number;
        name: string;
    };
}

interface EventsPageProps {
    events: {
        data: Event[];
        links: { url: string | null; label: string }[];
        current_page: number;
        last_page: number;
    };
    filters: Filters;
    filterCounts: {
        total: number;
        types: {
            all: number;
            crypto_event: number;
            web3_event: number;
            community_event: number;
            ai_event: number;
        };
        status: {
            all: number;
            upcoming: number;
            ongoing: number;
            completed: number;
            cancelled: number;
        };
        eventTypes: {
            all: number;
            virtual: number;
            in_person: number;
        };
        sortOptions: {
            date_asc: number;
            date_desc: number;
            participants: number;
        };
    };
}

// Ad slider data
const adSlides = [
    {
        id: 1,
        image: 'https://dummyimage.com/1200x300/dbdbdb/000000.png',
        link: 'https://example.com/ad1',
    },
    {
        id: 2,
        image: 'https://dummyimage.com/1200x300/dbdbdb/000000.png',
        link: 'https://example.com/ad2',
    },
    {
        id: 3,
        image: 'https://dummyimage.com/1200x300/dbdbdb/000000.png',
        link: 'https://example.com/ad3',
    },
];

export default function EventsPage({ events, filters, filterCounts }: EventsPageProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [hasFiltersChanged, setHasFiltersChanged] = useState(false);
    const [currentFilters, setCurrentFilters] = useState<Filters>(filters);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [startDate, setStartDate] = useState<Date | undefined>(filters.start_date ? new Date(filters.start_date) : undefined);
    const [endDate, setEndDate] = useState<Date | undefined>(filters.end_date ? new Date(filters.end_date) : undefined);

    useEffect(() => {
        if (!hasFiltersChanged) return;

        const updatedFilters = { ...currentFilters };

        // Type-safe way to iterate through filter keys
        (Object.keys(updatedFilters) as Array<keyof typeof updatedFilters>).forEach((key) => {
            if (updatedFilters[key] === 'all') {
                delete updatedFilters[key];
            }
        });

        setIsLoading(true);
        router.get(route('events.index'), updatedFilters as Record<string, string>, {
            preserveState: true,
            preserveScroll: true,
            onFinish: () => {
                setIsLoading(false);
                setHasFiltersChanged(false);
            },
        });
    }, [currentFilters, hasFiltersChanged]);

    const handleFilterChange = (key: keyof Filters, value: string) => {
        setCurrentFilters((prev) => ({
            ...prev,
            [key]: value,
        }));
        setHasFiltersChanged(true);
    };

    const handleStartDateChange = (date: Date | undefined) => {
        setStartDate(date);
        setCurrentFilters((prev) => ({
            ...prev,
            start_date: date ? date.toISOString() : undefined,
        }));
        setHasFiltersChanged(true);
    };

    const handleEndDateChange = (date: Date | undefined) => {
        setEndDate(date);
        setCurrentFilters((prev) => ({
            ...prev,
            end_date: date ? date.toISOString() : undefined,
        }));
        setHasFiltersChanged(true);
    };

    // Ad slider controls
    const nextSlide = () => {
        setCurrentSlide((prev) => (prev === adSlides.length - 1 ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev === 0 ? adSlides.length - 1 : prev - 1));
    };

    // Auto-rotate slides
    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide();
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <Head title="Events" />
            <Header />

            {/* Top Ad Space Slider */}
            <div className="relative mx-auto my-4 max-w-7xl overflow-hidden rounded-lg">
                <div className="relative flex">
                    {adSlides.map((slide, index) => (
                        <div
                            key={slide.id}
                            className={`w-full flex-shrink-0 transition-all duration-500 ease-in-out${index === currentSlide ? 'block' : 'hidden'}`}
                        >
                            <a href={slide.link} target="_blank" rel="noopener noreferrer">
                                <img src={slide.image} alt="Advertisement" className="h-auto w-full rounded-lg object-cover" />
                            </a>
                        </div>
                    ))}
                    <Button
                        onClick={prevSlide}
                        size="icon"
                        variant="outline"
                        className="absolute top-1/2 left-2 z-10 h-10 w-10 -translate-y-1/2 rounded-full bg-white/70 p-2 shadow-md hover:bg-white"
                        aria-label="Previous slide"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Button
                        onClick={nextSlide}
                        size="icon"
                        variant="outline"
                        className="absolute top-1/2 right-2 z-10 h-10 w-10 -translate-y-1/2 rounded-full bg-white/70 p-2 shadow-md hover:bg-white"
                        aria-label="Next slide"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </Button>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 lg:px-6">
                <div className="my-8 space-y-4">
                    <div>
                        <h1 className="text-3xl font-bold">Global Crypto Events & Conferences</h1>
                        <p className="mt-2 max-w-3xl text-gray-600">
                            Stay updated on crypto events from 2025. Explore blockchain conferences, meetups, and summits. Connect with experts, find
                            new projects, and learn about Web3 trends. Check our crypto events calendar for the latest updates and opportunities!
                        </p>
                    </div>

                    <div className="flex items-center justify-between">
                        <p className="text-muted-foreground text-sm">
                            {filterCounts.total} {filterCounts.total === 1 ? 'Event' : 'Events'}
                        </p>
                    </div>

                    <div className="flex flex-col gap-8">
                        {/* Filters Section - Left Sidebar */}
                        <div className="w-full">
                            <div className="sticky top-40">
                                <div className="grid grid-cols-1 gap-4 space-y-6 sm:grid-cols-5">
                                    <div className="space-y-4">
                                        <Select value={currentFilters.type || 'all'} onValueChange={(value) => handleFilterChange('type', value)}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select event type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Types ({filterCounts.types.all})</SelectItem>
                                                <SelectItem value="crypto_event">Crypto Events ({filterCounts.types.crypto_event})</SelectItem>
                                                <SelectItem value="web3_event">Web3 Events ({filterCounts.types.web3_event})</SelectItem>
                                                <SelectItem value="community_event">
                                                    Community Events ({filterCounts.types.community_event})
                                                </SelectItem>
                                                <SelectItem value="ai_event">AI Events ({filterCounts.types.ai_event})</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-4">
                                        <Select value={currentFilters.status || 'all'} onValueChange={(value) => handleFilterChange('status', value)}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Status ({filterCounts.status.all})</SelectItem>
                                                <SelectItem value="upcoming" className="text-green-600">
                                                    Upcoming ({filterCounts.status.upcoming})
                                                </SelectItem>
                                                <SelectItem value="ongoing" className="text-primary">
                                                    Ongoing ({filterCounts.status.ongoing})
                                                </SelectItem>
                                                <SelectItem value="completed" className="text-gray-600">
                                                    Completed ({filterCounts.status.completed})
                                                </SelectItem>
                                                <SelectItem value="cancelled" className="text-red-600">
                                                    Cancelled ({filterCounts.status.cancelled})
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-4">
                                        <Select
                                            value={currentFilters.event_type || 'all'}
                                            onValueChange={(value) => handleFilterChange('event_type', value)}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select event format" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Formats ({filterCounts.eventTypes.all})</SelectItem>
                                                <SelectItem value="virtual">Virtual ({filterCounts.eventTypes.virtual})</SelectItem>
                                                <SelectItem value="in_person">In Person ({filterCounts.eventTypes.in_person})</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-4">
                                        <Select
                                            value={currentFilters.sort_by || 'date_asc'}
                                            onValueChange={(value) => handleFilterChange('sort_by', value)}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Sort events by" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="date_asc">Date (Ascending)</SelectItem>
                                                <SelectItem value="date_desc">Date (Descending)</SelectItem>
                                                <SelectItem value="participants">Most Participants</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-4">
                                            <div>
                                                <DateRangePicker
                                                    startDate={startDate}
                                                    endDate={endDate}
                                                    onStartDateChange={handleStartDateChange}
                                                    onEndDateChange={handleEndDateChange}
                                                />
                                            </div>
                                            {(startDate || endDate) && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                        setStartDate(undefined);
                                                        setEndDate(undefined);
                                                        setCurrentFilters((prev) => ({
                                                            ...prev,
                                                            start_date: undefined,
                                                            end_date: undefined,
                                                        }));
                                                        setHasFiltersChanged(true);
                                                    }}
                                                    className="w-full"
                                                >
                                                    Clear dates
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Events Grid - Right Content */}
                        <div className="w-full">
                            {isLoading ? (
                                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                                    {[...Array(4)].map((_, i) => (
                                        <div key={i} className="space-y-3">
                                            <Skeleton className="h-[200px] w-full" />
                                            <Skeleton className="h-4 w-3/4" />
                                            <Skeleton className="h-4 w-1/2" />
                                        </div>
                                    ))}
                                </div>
                            ) : events.data.length === 0 ? (
                                <div className="rounded-lg bg-white py-12 text-center shadow">
                                    <h3 className="text-lg font-medium text-gray-900">No events found</h3>
                                    <p className="mt-2 text-sm text-gray-500">Try adjusting your filters or check back later for new events.</p>
                                </div>
                            ) : (
                                <>
                                    {/* Mid-page Ad Banner */}
                                    <div className="border-border bg-muted mb-8 rounded-lg border p-4">
                                        <div className="flex flex-col items-center justify-between md:flex-row">
                                            <div className="mb-4 md:mb-0">
                                                <h3 className="text-foreground text-lg font-bold">Promote Your Crypto Event</h3>
                                                <p className="text-muted-foreground">Reach thousands of crypto enthusiasts and boost attendance</p>
                                            </div>
                                            <Link className="cursor-pointer" href="mailto:contact@CoinMews.io">
                                                <Button variant="default" className="cursor-pointer">
                                                    Contact Us
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                                        {events.data.map((event) => (
                                            <EventCard key={event.id} event={event} showOrganizer />
                                        ))}
                                    </div>
                                </>
                            )}

                            {/* Bottom Ad Banner */}
                            <div className="border-border bg-muted my-8 rounded-lg border p-4">
                                <div className="flex flex-col items-center justify-between md:flex-row">
                                    <div className="mb-4 md:mb-0">
                                        <h3 className="text-foreground text-lg font-bold">Join Our Web3 Developer Community</h3>
                                        <p className="text-muted-foreground">Connect with other developers and blockchain experts</p>
                                    </div>
                                    <Button variant="default">Join Now</Button>
                                </div>
                            </div>

                            {/* Improved Pagination */}
                            {!isLoading && events.links && events.links.length > 3 && (
                                <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                                    {events.links.map((link, index) => {
                                        // Previous button
                                        if (link.label === '&laquo; Previous') {
                                            return (
                                                <Button
                                                    key={index}
                                                    variant="outline"
                                                    disabled={!link.url || isLoading}
                                                    onClick={() => {
                                                        if (link.url) {
                                                            router.visit(link.url, {
                                                                preserveScroll: true,
                                                                preserveState: true,
                                                                only: ['events'],
                                                            });
                                                        }
                                                    }}
                                                    className="flex items-center gap-1"
                                                >
                                                    <ChevronLeft className="h-4 w-4" />
                                                    <span>Previous</span>
                                                </Button>
                                            );
                                        }

                                        // Next button
                                        if (link.label === 'Next &raquo;') {
                                            return (
                                                <Button
                                                    key={index}
                                                    variant="outline"
                                                    disabled={!link.url || isLoading}
                                                    onClick={() => {
                                                        if (link.url) {
                                                            router.visit(link.url, {
                                                                preserveScroll: true,
                                                                preserveState: true,
                                                                only: ['events'],
                                                            });
                                                        }
                                                    }}
                                                    className="flex items-center gap-1"
                                                >
                                                    <span>Next</span>
                                                    <ChevronRight className="h-4 w-4" />
                                                </Button>
                                            );
                                        }

                                        // Ellipsis
                                        if (link.label === '...') {
                                            return (
                                                <Button key={index} variant="outline" disabled className="px-3">
                                                    ...
                                                </Button>
                                            );
                                        }

                                        // Number buttons
                                        return (
                                            <Button
                                                key={index}
                                                variant={link.label === events.current_page.toString() ? 'default' : 'outline'}
                                                disabled={!link.url || isLoading}
                                                onClick={() => {
                                                    if (link.url) {
                                                        router.visit(link.url, {
                                                            preserveScroll: true,
                                                            preserveState: true,
                                                            only: ['events'],
                                                        });
                                                    }
                                                }}
                                                className="min-w-[2.5rem] px-3"
                                            >
                                                {link.label}
                                            </Button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}
