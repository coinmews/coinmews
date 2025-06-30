import EventCard from '@/components/events/event-card';
import Footer from '@/components/sections/footer';
import Header from '@/components/sections/header';
import ShareDialog from '@/components/share-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Head, Link } from '@inertiajs/react';
import { format, isValid, parseISO } from 'date-fns';
import { AlertCircle, Calendar, Clock, Globe2, MapPin, Ticket, Users2, Video } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

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
    meta_title: string | null;
    meta_description: string | null;
    status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
    registration_status: 'open' | 'ongoing' | 'closed' | 'full';
    duration: string;
    organizer: {
        id: number;
        name: string;
    } | null;
}

interface EventShowPageProps {
    event: Event;
    relatedEvents: Event[];
}

export default function EventShowPage({ event, relatedEvents }: EventShowPageProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [isShareOpen, setIsShareOpen] = useState(false);

    useEffect(() => {
        if (event?.id) {
            setIsLoading(false);
        }

        const handleStart = () => setIsLoading(true);
        const handleFinish = () => setIsLoading(false);

        document.addEventListener('inertia:start', handleStart);
        document.addEventListener('inertia:finish', handleFinish);

        return () => {
            document.removeEventListener('inertia:start', handleStart);
            document.removeEventListener('inertia:finish', handleFinish);
        };
    }, [event?.id]);

    const formatDate = (dateString: string | null, formatStr: string) => {
        if (!dateString) return 'Date unavailable';
        try {
            const date = parseISO(dateString);
            if (!isValid(date)) {
                console.error('Invalid date:', dateString);
                return 'Date unavailable';
            }
            return format(date, formatStr);
        } catch (error) {
            console.error('Error formatting date:', error, dateString);
            return 'Date unavailable';
        }
    };

    const getEventTypeLabel = (type: string) => {
        switch (type) {
            case 'crypto_event':
                return 'Crypto Event';
            case 'web3_event':
                return 'Web3 Event';
            case 'community_event':
                return 'Community Event';
            case 'ai_event':
                return 'AI Event';
            default:
                return type;
        }
    };

    const getStatusBadgeVariant = (status: Event['status']): 'default' | 'secondary' | 'destructive' | 'outline' => {
        switch (status) {
            case 'upcoming':
                return 'default';
            case 'ongoing':
                return 'secondary';
            case 'completed':
                return 'outline';
            case 'cancelled':
                return 'destructive';
            default:
                return 'outline';
        }
    };

    const getRegistrationStatusMessage = () => {
        switch (event.registration_status) {
            case 'open':
                return { message: 'Registration is open', variant: 'default' as const };
            case 'ongoing':
                return { message: 'Event is in progress', variant: 'secondary' as const };
            case 'full':
                return { message: 'Event is full', variant: 'destructive' as const };
            case 'closed':
                return { message: 'Registration is closed', variant: 'outline' as const };
            default:
                return { message: '', variant: 'outline' as const };
        }
    };

    const handleShare = async (platform?: string) => {
        const eventUrl = window.location.href;
        const title = event.meta_title || event.title;
        const text = event.meta_description || 'Check out this event!';

        switch (platform) {
            case 'twitter':
                window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(eventUrl)}&text=${encodeURIComponent(text)}`, '_blank');
                break;
            case 'facebook':
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(eventUrl)}`, '_blank');
                break;
            case 'linkedin':
                window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(eventUrl)}`, '_blank');
                break;
            case 'copy':
                try {
                    await navigator.clipboard.writeText(eventUrl);
                    toast.success('Link copied to clipboard');
                } catch (err) {
                    toast.error('Failed to copy link');
                }
                break;
        }
        setIsShareOpen(false);
    };

    if (isLoading || !event?.id) {
        return (
            <>
                <Head title="Loading Event..." />
                <Header />
                <main className="min-h-screen bg-gray-50/50">
                    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
                        <div className="space-y-8">
                            <Skeleton className="h-8 w-64" />
                            <Skeleton className="h-[400px] w-full rounded-xl" />
                            <div className="grid gap-8 lg:grid-cols-3">
                                <div className="space-y-6 lg:col-span-2">
                                    <Card>
                                        <CardHeader>
                                            <Skeleton className="h-8 w-48" />
                                        </CardHeader>
                                        <CardContent className="space-y-2">
                                            <Skeleton className="h-4 w-full" />
                                            <Skeleton className="h-4 w-full" />
                                            <Skeleton className="h-4 w-3/4" />
                                        </CardContent>
                                    </Card>
                                </div>
                                <div className="space-y-6">
                                    <Card>
                                        <CardContent className="space-y-4 p-6">
                                            {[...Array(4)].map((_, i) => (
                                                <div key={i} className="flex items-start gap-3">
                                                    <Skeleton className="h-5 w-5" />
                                                    <div className="flex-1">
                                                        <Skeleton className="mb-1 h-4 w-24" />
                                                        <Skeleton className="h-3 w-full" />
                                                    </div>
                                                </div>
                                            ))}
                                            <Skeleton className="mt-4 h-10 w-full" />
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Head title={event.meta_title || event.title || 'Event Details'} />
            <Header />
            <main className="min-h-screen bg-gray-50/50">
                <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
                    {/* Navigation and Share */}
                    <div className="mb-8 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link
                                href={route('events.index')}
                                className="text-muted-foreground hover:text-primary flex items-center gap-2 text-sm transition-colors"
                            >
                                ← Back to Events
                            </Link>
                            <Badge variant={getStatusBadgeVariant(event.status)}>{event.status}</Badge>
                        </div>
                        <ShareDialog
                            url={window.location.href}
                            title={event.meta_title || event.title}
                            description={event.meta_description || event.description?.slice(0, 200)}
                        />
                    </div>

                    {/* Banner Image */}
                    {event.banner_url ? (
                        <div className="relative mb-8 aspect-[21/9] w-full overflow-hidden rounded-xl bg-gray-100">
                            <img src={event.banner_url} alt={event.title} className="h-full w-full object-cover" />
                        </div>
                    ) : (
                        <div className="mb-8 flex aspect-[21/9] w-full items-center justify-center rounded-xl bg-gray-100">
                            <Calendar className="h-20 w-20 text-gray-400" />
                        </div>
                    )}

                    <div className="grid gap-8 lg:grid-cols-3">
                        {/* Main Content - About Section */}
                        <div className="space-y-8 lg:col-span-2">
                            {/* Event Header */}
                            <div className="space-y-4">
                                <h1 className="text-4xl font-bold tracking-tight">{event.title}</h1>
                                <div className="flex flex-wrap items-center gap-4">
                                    <Badge variant="secondary">{getEventTypeLabel(event.type)}</Badge>
                                    {event.organizer && <span className="text-muted-foreground text-sm">Organized by {event.organizer.name}</span>}
                                </div>
                            </div>

                            {/* Quick Info Pills */}
                            <div className="flex flex-wrap gap-4">
                                <Card className="flex items-center gap-2 p-3">
                                    <Calendar className="text-primary h-5 w-5" />
                                    <div className="text-sm">{formatDate(event.start_date, 'MMM d, yyyy')}</div>
                                </Card>
                                <Card className="flex items-center gap-2 p-3">
                                    <Clock className="text-primary h-5 w-5" />
                                    <div className="text-sm">{formatDate(event.start_date, 'h:mm a')}</div>
                                </Card>
                                <Card className="flex items-center gap-2 p-3">
                                    {event.is_virtual ? <Globe2 className="text-primary h-5 w-5" /> : <MapPin className="text-primary h-5 w-5" />}
                                    <div className="text-sm">{event.is_virtual ? 'Virtual Event' : event.location || 'Location TBA'}</div>
                                </Card>
                                <Card className="flex items-center gap-2 p-3">
                                    <Users2 className="text-primary h-5 w-5" />
                                    <div className="text-sm">{event.current_participants} attending</div>
                                </Card>
                            </div>

                            {/* About Section */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>About this Event</CardTitle>
                                    {event.meta_description && <CardDescription>{event.meta_description}</CardDescription>}
                                </CardHeader>
                                <CardContent>
                                    <div className="prose max-w-none">
                                        <div className="whitespace-pre-wrap">{event.description}</div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Important Information */}
                            {(event.registration_status === 'open' || event.is_virtual) && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <AlertCircle className="h-5 w-5 text-primary" />
                                            Important Information
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        {event.registration_status === 'open' && (
                                            <p className="text-muted-foreground flex items-center gap-2 text-sm">
                                                <Ticket className="h-4 w-4" />
                                                Registration is required to attend this event
                                            </p>
                                        )}
                                        {event.is_virtual && event.registration_status === 'open' && (
                                            <p className="text-muted-foreground flex items-center gap-2 text-sm">
                                                <Video className="h-4 w-4" />
                                                Virtual event link will be provided after registration
                                            </p>
                                        )}
                                        {event.max_participants && (
                                            <p className="text-muted-foreground flex items-center gap-2 text-sm">
                                                <Users2 className="h-4 w-4" />
                                                Limited capacity: {event.max_participants} spots available
                                            </p>
                                        )}
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div>
                            <div className="space-y-6">
                                {/* Registration Card */}
                                <Card className="bg-card shadow-lg">
                                    <CardContent className="space-y-6 p-6">
                                        <div className="space-y-2 text-center">
                                            <Badge variant={getRegistrationStatusMessage().variant} className="w-full py-1.5">
                                                {getRegistrationStatusMessage().message}
                                            </Badge>
                                            {event.registration_status === 'open' && (
                                                <p className="text-muted-foreground text-sm">
                                                    {event.max_participants
                                                        ? `${event.max_participants - event.current_participants} spots remaining`
                                                        : 'Unlimited spots available'}
                                                </p>
                                            )}
                                        </div>

                                        {event.registration_link && event.registration_status === 'open' && (
                                            <Button className="w-full" size="lg" asChild>
                                                <a href={event.registration_link} target="_blank" rel="noopener noreferrer">
                                                    Register Now
                                                </a>
                                            </Button>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Event Details Card */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Event Details</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        {/* Date and Time */}
                                        <div className="bg-muted space-y-4 rounded-lg p-4">
                                            <div className="flex items-start gap-3">
                                                <Calendar className="text-primary mt-1 h-5 w-5" />
                                                <div>
                                                    <div className="font-medium">Date and Time</div>
                                                    <div className="text-muted-foreground text-sm">
                                                        {formatDate(event.start_date, 'EEEE, MMMM d, yyyy')}
                                                    </div>
                                                    <div className="text-muted-foreground text-sm">
                                                        {formatDate(event.start_date, 'h:mm a')} - {formatDate(event.end_date, 'h:mm a')}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3">
                                                <Clock className="text-primary mt-1 h-5 w-5" />
                                                <div>
                                                    <div className="font-medium">Duration</div>
                                                    <div className="text-muted-foreground text-sm">{event.duration}</div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Location/Virtual */}
                                        <div className="bg-muted space-y-4 rounded-lg p-4">
                                            {event.is_virtual ? (
                                                <div className="flex items-start gap-3">
                                                    <Globe2 className="text-primary mt-1 h-5 w-5" />
                                                    <div>
                                                        <div className="font-medium">Virtual Event</div>
                                                        {event.registration_status === 'open' ? (
                                                            <div className="text-muted-foreground text-sm">
                                                                Link will be provided after registration
                                                            </div>
                                                        ) : event.virtual_link ? (
                                                            <a
                                                                href={event.virtual_link}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-primary text-sm hover:underline"
                                                            >
                                                                Join virtual event
                                                            </a>
                                                        ) : null}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex items-start gap-3">
                                                    <MapPin className="text-primary mt-1 h-5 w-5" />
                                                    <div>
                                                        <div className="font-medium">Location</div>
                                                        <div className="text-muted-foreground text-sm">
                                                            {event.location || 'Location not specified'}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Participants */}
                                        <div className="bg-muted space-y-4 rounded-lg p-4">
                                            <div className="flex items-start gap-3">
                                                <Users2 className="text-primary mt-1 h-5 w-5" />
                                                <div>
                                                    <div className="font-medium">Participants</div>
                                                    <div className="text-muted-foreground text-sm">
                                                        {event.current_participants} / {event.max_participants || '∞'} registered
                                                    </div>
                                                    {event.max_participants && (
                                                        <div className="mt-2">
                                                            <div className="bg-muted-foreground/20 h-2 w-full overflow-hidden rounded-full">
                                                                <div
                                                                    className="bg-primary h-full transition-all"
                                                                    style={{
                                                                        width: `${Math.min((event.current_participants / event.max_participants) * 100, 100)}%`,
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>

                    {/* Similar Events */}
                    {relatedEvents?.length > 0 && (
                        <div className="mt-12">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Similar Events</CardTitle>
                                    <CardDescription>Events you might be interested in</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                        {relatedEvents.map((relatedEvent) => (
                                            <EventCard key={relatedEvent.id} event={relatedEvent} />
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
}
