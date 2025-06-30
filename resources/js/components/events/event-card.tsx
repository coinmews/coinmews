import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import { format, isValid, parseISO } from 'date-fns';
import { CalendarIcon, MapPinIcon, Users2Icon, VideoIcon } from 'lucide-react';

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
    } | null;
}

interface EventCardProps {
    event: Event;
    showOrganizer?: boolean;
}

export default function EventCard({ event, showOrganizer = false }: EventCardProps) {
    const formatDate = (dateString: string | null, formatStr: string) => {
        if (!dateString) return 'Date unavailable';

        try {
            const date = parseISO(dateString);
            if (!isValid(date)) return 'Date unavailable';
            return format(date, formatStr);
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'Date unavailable';
        }
    };

    const getParticipantsText = () => {
        if (typeof event.current_participants !== 'number') return 'No participants yet';

        if (event.max_participants) {
            return `${event.current_participants} / ${event.max_participants} participants`;
        }

        return `${event.current_participants} participants registered`;
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

    const getStatusColor = (status: Event['status']) => {
        switch (status) {
            case 'upcoming':
                return 'text-green-600';
            case 'ongoing':
                return 'text-primary';
            case 'completed':
                return 'text-gray-600';
            case 'cancelled':
                return 'text-red-600';
            default:
                return 'text-gray-600';
        }
    };

    // Get the image source with proper type handling
    const getImageSrc = (): string => {
        if (event.banner_url) return event.banner_url;
        if (event.banner_image) return event.banner_image;
        return '';
    };

    return (
        <Card className="overflow-hidden p-0">
            <Link href={route('events.show', event.slug)}>
                {event.banner_url || event.banner_image ? (
                    <img src={getImageSrc()} alt={event.title || 'Event banner'} className="aspect-[16/9] object-cover" />
                ) : (
                    <div className="flex h-48 w-full items-center justify-center bg-gray-100">
                        <CalendarIcon className="h-12 w-12 text-gray-400" />
                    </div>
                )}
            </Link>

            <div className="p-6">
                <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium">{event.type ? getEventTypeLabel(event.type) : 'Event'}</span>
                    {event.status && <span className={`text-sm font-medium capitalize ${getStatusColor(event.status)}`}>{event.status}</span>}
                </div>

                <Link href={route('events.show', event.slug)} className="hover:text-primary mb-2 block text-xl font-semibold transition-colors">
                    {event.title || 'Untitled Event'}
                </Link>

                <div
                    className="text-muted-foreground mb-4 line-clamp-2 text-sm"
                    dangerouslySetInnerHTML={{
                        __html: event.description || 'No description available',
                    }}
                />

                {showOrganizer && event.organizer?.name && (
                    <p className="text-muted-foreground mb-4 text-sm">
                        Organized by <span className="font-medium">{event.organizer.name}</span>
                    </p>
                )}

                <div className="text-muted-foreground space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4" />
                        <span>{formatDate(event.start_date, 'MMM d, yyyy h:mm a')}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        {event.is_virtual ? (
                            <>
                                <VideoIcon className="h-4 w-4" />
                                <span>Virtual Event</span>
                            </>
                        ) : (
                            <>
                                <MapPinIcon className="h-4 w-4" />
                                <span>{event.location || 'Location not specified'}</span>
                            </>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <Users2Icon className="h-4 w-4" />
                        <span>{getParticipantsText()}</span>
                    </div>
                </div>

                <div className="mt-4">
                    <Button
                        className="w-full"
                        variant={event.registration_status === 'open' ? 'default' : 'secondary'}
                        disabled={event.registration_status !== 'open'}
                        asChild
                    >
                        <Link href={route('events.show', event.slug)}>
                            {event.registration_status === 'open'
                                ? 'Register Now'
                                : event.registration_status === 'full'
                                  ? 'Event Full'
                                  : 'Registration Closed'}
                        </Link>
                    </Button>
                </div>
            </div>
        </Card>
    );
}
