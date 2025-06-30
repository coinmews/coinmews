import Footer from '@/components/sections/footer';
import Header from '@/components/sections/header';
import ShareDialog from '@/components/share-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import { AlertTriangle, Calendar, ExternalLink, Info, ThumbsDown, ThumbsUp, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface CryptoExchangeListing {
    id: number;
    coin_name: string;
    coin_symbol: string;
    exchange_name: string;
    exchange_logo: string | null;
    coin_logo: string | null;
    listing_type: 'listing' | 'delisting';
    listing_date: string;
    trading_pairs: string | null;
    description: string | null;
    about_project: string | null;
    website_url: string | null;
    explorer_url: string | null;
    what_happens: string | null;
    final_thoughts: string | null;
    already_listing_count: number;
    yes_votes: number;
    no_votes: number;
    yes_percentage: number;
    no_percentage: number;
    is_featured: boolean;
    is_published: boolean;
    slug: string;
}

interface CryptoExchangeListingShowProps extends PageProps {
    listing: CryptoExchangeListing;
    relatedListings: CryptoExchangeListing[];
    meta: {
        title: string;
        description: string | null;
        keywords: string;
        canonical?: string;
        og: {
            title: string;
            description: string | null;
            image: string | null;
            type: string;
            url: string;
        };
        twitter: {
            card: string;
            title: string;
            description: string | null;
            image: string | null;
        };
    };
}

export default function Show({ auth, listing, relatedListings, meta }: CryptoExchangeListingShowProps) {
    // Ensure listing and its properties are safe to access
    const safeListing = listing || {};

    const [yesVotes, setYesVotes] = useState(safeListing.yes_votes || 0);
    const [noVotes, setNoVotes] = useState(safeListing.no_votes || 0);
    const [yesPercentage, setYesPercentage] = useState(() => {
        const total = (safeListing.yes_votes || 0) + (safeListing.no_votes || 0);
        return total > 0 ? Math.round((safeListing.yes_votes / total) * 100) : 0;
    });
    const [noPercentage, setNoPercentage] = useState(() => {
        const total = (safeListing.yes_votes || 0) + (safeListing.no_votes || 0);
        return total > 0 ? Math.round((safeListing.no_votes / total) * 100) : 0;
    });
    const [hasVoted, setHasVoted] = useState<'yes' | 'no' | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Load vote state from localStorage on component mount
    useEffect(() => {
        const savedVote = localStorage.getItem(`vote_${safeListing.id}`);
        if (savedVote === 'yes' || savedVote === 'no') {
            setHasVoted(savedVote);
        }
    }, [safeListing.id]);

    const handleVote = async (voteType: 'yes' | 'no') => {
        if (!auth.user) {
            toast.error('You need to be logged in to vote');
            return;
        }

        if (hasVoted || isLoading) return;

        setIsLoading(true);
        try {
            const response = await axios.post(`/crypto-exchange-listings/${safeListing.id}/vote`, { vote_type: voteType });
            const { yes_votes, no_votes, yes_percentage, no_percentage } = response.data;

            // Update vote counts and percentages
            setYesVotes(yes_votes);
            setNoVotes(no_votes);
            setYesPercentage(yes_percentage);
            setNoPercentage(no_percentage);
            setHasVoted(voteType);

            // Save vote state to localStorage
            localStorage.setItem(`vote_${safeListing.id}`, voteType);

            toast.success('Vote recorded successfully!');
        } catch (error: unknown) {
            console.error('Error voting', error);
            const axiosError = error as { response?: { status?: number } };
            if (axiosError.response?.status === 401) {
                toast.error('You need to be logged in to vote');
            } else {
                toast.error('Failed to vote. Please try again later.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    };

    return (
        <div>
            <Head title={meta.title}>
                <meta name="description" content={meta.description ?? ''} />
                <meta name="keywords" content={meta.keywords} />
                <meta property="og:title" content={meta.og.title} />
                <meta property="og:description" content={meta.og.description ?? ''} />
                {meta.og.image && <meta property="og:image" content={meta.og.image} />}
                <meta property="og:type" content={meta.og.type} />
                <meta property="og:url" content={meta.og.url} />
                <meta name="twitter:card" content={meta.twitter.card} />
                <meta name="twitter:title" content={meta.twitter.title} />
                <meta name="twitter:description" content={meta.twitter.description ?? ''} />
                {meta.twitter.image && <meta name="twitter:image" content={meta.twitter.image} />}
            </Head>

            <Header />

            <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
                <div className="mb-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center space-x-2">
                            <Link href="/crypto-exchange-listings" className="text-muted-foreground hover:text-foreground">
                                Crypto Exchange Listings
                            </Link>
                            <span className="text-muted-foreground">/</span>
                            <span className="font-medium">{safeListing.coin_name}</span>
                        </div>
                        <ShareDialog
                            url={window.location.href}
                            title={`${safeListing.coin_name} (${safeListing.coin_symbol}) ${safeListing.listing_type} on ${safeListing.exchange_name}`}
                            description={safeListing.description ? safeListing.description.slice(0, 200) : ''}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Main Content Column */}
                    <div className="lg:col-span-2">
                        {/* Header Card */}
                        <Card className="mb-6">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <div className="flex flex-col items-start gap-4 md:flex-row md:items-center">
                                    <div className="flex items-center">
                                        <Avatar className="mr-2 h-16 w-16">
                                            <AvatarImage src={safeListing.coin_logo || undefined} alt={safeListing.coin_name} />
                                            <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                                {safeListing.coin_symbol.slice(0, 2)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="mx-2 text-2xl">on</span>
                                        <Avatar className="ml-2 h-12 w-12">
                                            <AvatarImage src={safeListing.exchange_logo || undefined} alt={safeListing.exchange_name} />
                                            <AvatarFallback className="bg-secondary/80 text-secondary-foreground font-bold">
                                                {safeListing.exchange_name.slice(0, 2)}
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>
                                    <div>
                                        <CardTitle className="text-2xl md:text-3xl">
                                            {safeListing.coin_name} ({safeListing.coin_symbol}){' '}
                                            {safeListing.listing_type === 'listing' ? 'Listed on' : 'Delisted from'} {safeListing.exchange_name}
                                        </CardTitle>
                                        <div className="text-muted-foreground mt-2 flex flex-wrap items-center gap-3">
                                            <div className="flex items-center">
                                                <Calendar className="mr-2 h-4 w-4" />
                                                {formatDate(safeListing.listing_date)}
                                            </div>
                                            <ListingTypeBadge type={safeListing.listing_type} />
                                            {safeListing.is_featured && (
                                                <Badge className="border border-red-200 bg-red-100 font-semibold text-red-800">Featured</Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                        </Card>

                        {/* Quick Status Card */}
                        <Card className="bg-muted/30 mb-6">
                            <CardContent className="pt-6">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                    <div className="bg-background flex flex-col items-center justify-center rounded-lg p-4 shadow-sm">
                                        <div className="bg-primary/10 mb-2 flex h-10 w-10 items-center justify-center rounded-full">
                                            <Calendar className="text-primary h-5 w-5" />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm font-medium">
                                                {safeListing.listing_type === 'listing' ? 'Listing Date' : 'Delisting Date'}
                                            </p>
                                            <p className="font-bold">{formatDate(safeListing.listing_date)}</p>
                                        </div>
                                    </div>
                                    <div className="bg-background flex flex-col items-center justify-center rounded-lg p-4 shadow-sm">
                                        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                            <TrendingUp className="h-5 w-5 text-primary" />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm font-medium">Also Listed On</p>
                                            <p className="font-bold">
                                                {safeListing.already_listing_count}{' '}
                                                {safeListing.already_listing_count === 1 ? 'Exchange' : 'Exchanges'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="bg-background flex flex-col items-center justify-center rounded-lg p-4 shadow-sm">
                                        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-green-50">
                                            <ThumbsUp className="h-5 w-5 text-green-500" />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm font-medium">Community Rating</p>
                                            <p className="font-bold">{yesPercentage}% Positive</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Listing Details Card */}
                        <Card className="mb-6">
                            <CardHeader>
                                <CardTitle>Exchange {safeListing.listing_type === 'listing' ? 'Listing' : 'Delisting'} Details</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="rounded-md border">
                                    <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
                                        <div className="flex justify-between border-b p-3">
                                            <span className="font-medium">Exchange</span>
                                            <span>{safeListing.exchange_name}</span>
                                        </div>

                                        <div className="flex justify-between border-b p-3">
                                            <span className="font-medium">Listing Date</span>
                                            <span>{formatDate(safeListing.listing_date)}</span>
                                        </div>

                                        {safeListing.trading_pairs && (
                                            <div className="flex justify-between border-b p-3">
                                                <span className="font-medium">Trading Pairs</span>
                                                <span>{safeListing.trading_pairs}</span>
                                            </div>
                                        )}

                                        <div className="flex justify-between border-b p-3">
                                            <span className="font-medium">Listed on Other Exchanges</span>
                                            <span>
                                                {safeListing.already_listing_count}{' '}
                                                {safeListing.already_listing_count === 1 ? 'Exchange' : 'Exchanges'}
                                            </span>
                                        </div>

                                        {safeListing.website_url && (
                                            <div className="flex justify-between border-b p-3">
                                                <span className="font-medium">Website</span>
                                                <Link
                                                    href={safeListing.website_url}
                                                    className="text-primary flex items-center hover:underline"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <ExternalLink className="mr-1 h-4 w-4" />
                                                    Visit
                                                </Link>
                                            </div>
                                        )}

                                        {safeListing.explorer_url && (
                                            <div className="flex justify-between border-b p-3">
                                                <span className="font-medium">Explorer</span>
                                                <Link
                                                    href={safeListing.explorer_url}
                                                    className="text-primary flex items-center hover:underline"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <ExternalLink className="mr-1 h-4 w-4" />
                                                    Explore
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Description Card */}
                        {safeListing.description && (
                            <Card className="mb-6">
                                <CardHeader className="flex flex-row items-center gap-2">
                                    <Info className="text-primary h-5 w-5" />
                                    <CardTitle>About This {safeListing.listing_type === 'listing' ? 'Listing' : 'Delisting'}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: safeListing.description }} />
                                </CardContent>
                            </Card>
                        )}

                        {/* About Project Card */}
                        {safeListing.about_project && (
                            <Card className="mb-6">
                                <CardHeader className="flex flex-row items-center gap-2">
                                    <Info className="text-primary h-5 w-5" />
                                    <CardTitle>
                                        About {safeListing.coin_name} ({safeListing.coin_symbol})
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: safeListing.about_project }} />
                                </CardContent>
                            </Card>
                        )}

                        {/* What Happens Card */}
                        {safeListing.what_happens && (
                            <Card className="mb-6">
                                <CardHeader className="flex flex-row items-center gap-2">
                                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                                    <CardTitle>What Happens After {safeListing.listing_type === 'listing' ? 'Listing' : 'Delisting'}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: safeListing.what_happens }} />
                                </CardContent>
                            </Card>
                        )}

                        {/* Final Thoughts Card */}
                        {safeListing.final_thoughts && (
                            <Card className="mb-6">
                                <CardHeader className="flex flex-row items-center gap-2">
                                    <ThumbsUp className="h-5 w-5 text-green-500" />
                                    <CardTitle>Final Thoughts</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: safeListing.final_thoughts }} />
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar Column */}
                    <div className="space-y-6">
                        {/* Sticky container for sidebar */}
                        <div className="sticky top-4 space-y-6">
                            {/* Recommendation Card */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Community Recommendation</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <p className="text-center text-lg font-medium">
                                            Is {safeListing.coin_name} worth {safeListing.listing_type === 'listing' ? 'buying' : 'selling'}?
                                        </p>

                                        <div className="flex items-center justify-center gap-3">
                                            <Button
                                                onClick={() => handleVote('yes')}
                                                disabled={hasVoted !== null || isLoading}
                                                variant={hasVoted === 'yes' ? 'secondary' : 'outline'}
                                                className={`flex-1 ${hasVoted === 'yes' ? 'bg-green-100 text-green-700' : ''}`}
                                            >
                                                <ThumbsUp className={`mr-2 h-5 w-5 ${hasVoted === 'yes' ? 'fill-green-600' : ''}`} />
                                                Yes ({yesPercentage}%)
                                            </Button>

                                            <Button
                                                onClick={() => handleVote('no')}
                                                disabled={hasVoted !== null || isLoading}
                                                variant={hasVoted === 'no' ? 'secondary' : 'outline'}
                                                className={`flex-1 ${hasVoted === 'no' ? 'bg-red-100 text-red-700' : ''}`}
                                            >
                                                <ThumbsDown className={`mr-2 h-5 w-5 ${hasVoted === 'no' ? 'fill-red-600' : ''}`} />
                                                No ({noPercentage}%)
                                            </Button>
                                        </div>

                                        <div className="bg-muted/30 relative h-4 overflow-hidden rounded-full">
                                            <div
                                                className="absolute top-0 left-0 h-full rounded-l-full bg-green-500"
                                                style={{ width: `${yesPercentage}%` }}
                                            />
                                            <div
                                                className="absolute top-0 right-0 h-full rounded-r-full bg-red-500"
                                                style={{ width: `${noPercentage}%` }}
                                            />
                                        </div>

                                        <div className="text-muted-foreground text-center text-xs">Based on {yesVotes + noVotes} votes</div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Related Listings Card */}
                            {relatedListings.length > 0 && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Related Listings</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {relatedListings.map((relatedListing) => (
                                                <Link
                                                    key={relatedListing.id}
                                                    href={`/crypto-exchange-listings/${relatedListing.slug}`}
                                                    className="hover:bg-muted flex items-center gap-3 rounded-lg p-2 transition-colors"
                                                >
                                                    <Avatar className="h-10 w-10">
                                                        <AvatarImage src={relatedListing.coin_logo || undefined} alt={relatedListing.coin_name} />
                                                        <AvatarFallback>{relatedListing.coin_symbol.slice(0, 2)}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1 truncate">
                                                        <div className="font-medium">{relatedListing.coin_name}</div>
                                                        <div className="text-muted-foreground text-xs">
                                                            {relatedListing.listing_type === 'listing' ? 'Listed on' : 'Delisted from'}{' '}
                                                            {relatedListing.exchange_name}
                                                        </div>
                                                    </div>
                                                    <ListingTypeBadge type={relatedListing.listing_type} />
                                                </Link>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

function ListingTypeBadge({ type }: { type: 'listing' | 'delisting' }) {
    if (type === 'listing') {
        return <Badge className="rounded-full bg-green-500 px-3 py-0.5 text-white hover:bg-green-600">Listing</Badge>;
    } else {
        return <Badge className="rounded-full bg-red-500 px-3 py-0.5 text-white hover:bg-red-600">Delisting</Badge>;
    }
}
