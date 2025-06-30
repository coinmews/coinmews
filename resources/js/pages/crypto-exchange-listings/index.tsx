import Footer from '@/components/sections/footer';
import Header from '@/components/sections/header';
import ShareDialog from '@/components/share-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Head, router } from '@inertiajs/react';
import axios from 'axios';
import { ChevronLeft, ChevronRight, FilterIcon, Search, Share2, ThumbsDown, ThumbsUp, XIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useDebounce } from '../../hooks/useDebounce';

interface CryptoExchangeListing {
    id: number;
    coin_name: string;
    coin_symbol: string;
    exchange_name: string;
    exchange_logo: string | null;
    coin_logo: string | null;
    listing_type: 'listing' | 'delisting';
    listing_date: string;
    formatted_listing_date: string;
    trading_pairs: string | null;
    description: string | null;
    already_listing_count: number;
    yes_votes: number;
    no_votes: number;
    yes_percentage: number;
    no_percentage: number;
    is_featured: boolean;
    is_published: boolean;
    slug: string;
    read_more_url: string;
}

interface CryptoExchangeListingFilters {
    exchange_type?: string;
    exchange?: string;
    date?: string;
    search?: string;
}

interface CryptoExchangeListingPageProps {
    listings: {
        data: CryptoExchangeListing[];
        current_page: number;
        per_page: number;
        total: number;
        last_page: number;
        links: {
            url: string | null;
            label: string;
            active: boolean;
        }[];
    };
    exchanges: string[];
    filters: CryptoExchangeListingFilters;
}

interface RowData {
    original: CryptoExchangeListing;
}

export default function Index({ listings, exchanges, filters }: CryptoExchangeListingPageProps) {
    // Initialize with direct checks on filters to avoid potential null/undefined errors
    const [exchangeType, setExchangeType] = useState<string>(filters && filters.exchange_type ? filters.exchange_type : 'all');
    const [selectedExchange, setSelectedExchange] = useState<string>(filters && filters.exchange ? filters.exchange : 'all');
    const [searchQuery, setSearchQuery] = useState<string>(filters && filters.search ? filters.search : '');
    const [votedListings, setVotedListings] = useState<{ [key: number]: 'yes' | 'no' | null }>(() => {
        const savedVotes: { [key: number]: 'yes' | 'no' | null } = {};
        if (typeof window !== 'undefined') {
            listings.data.forEach((listing) => {
                const savedVote = localStorage.getItem(`vote_${listing.id}`);
                if (savedVote === 'yes' || savedVote === 'no') {
                    savedVotes[listing.id] = savedVote;
                }
            });
        }
        return savedVotes;
    });
    const [loadingVotes, setLoadingVotes] = useState<{ [key: number]: boolean }>({});
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const debouncedSearch = useDebounce(searchQuery, 500);

    // Define safe objects for use throughout the component
    const safeListings = listings || { data: [], current_page: 1, per_page: 10, total: 0, last_page: 1, links: [] };
    const safeExchanges = exchanges || [];

    // Sample data for the image slider
    const sliderImages = [
        {
            src: 'https://dummyimage.com/970x90/dbdbdb/000000.png',
            alt: 'Crypto Exchange Listings',
            link: 'https://example.com/offer1',
        },
        {
            src: 'https://dummyimage.com/970x90/dbdbdb/000000.png',
            alt: 'Crypto Trading Opportunities',
            link: 'https://example.com/offer2',
        },
        {
            src: 'https://dummyimage.com/970x90/dbdbdb/000000.png',
            alt: 'Latest Crypto News',
            link: 'https://example.com/offer3',
        },
    ];

    useEffect(() => {
        const filterSearch = filters && filters.search ? filters.search : '';

        if (debouncedSearch !== filterSearch) {
            router.get(
                '/crypto-exchange-listings',
                {
                    exchange_type: exchangeType === 'all' ? undefined : exchangeType,
                    exchange: selectedExchange === 'all' ? undefined : selectedExchange,
                    search: debouncedSearch || undefined,
                },
                { preserveState: true, replace: true },
            );
        }
    }, [debouncedSearch, exchangeType, selectedExchange, filters]);

    const handleRowClick = (listing: CryptoExchangeListing) => {
        router.visit(`/crypto-exchange-listings/${listing.slug}`);
    };

    const handleVote = async (e: React.MouseEvent, listingId: number, voteType: 'yes' | 'no') => {
        e.stopPropagation();

        // Already voted or loading
        if (votedListings[listingId] || loadingVotes[listingId]) {
            return;
        }

        // Set loading state for this specific listing
        setLoadingVotes((prev) => ({ ...prev, [listingId]: true }));

        try {
            const response = await axios.post(`/crypto-exchange-listings/${listingId}/vote`, { vote_type: voteType });
            const { yes_votes, no_votes, yes_percentage, no_percentage } = response.data;

            // Update votedListings state with new vote
            setVotedListings((prev) => ({ ...prev, [listingId]: voteType }));

            // Save vote to localStorage
            localStorage.setItem(`vote_${listingId}`, voteType);

            // Update the listing in the data with new vote counts
            const updatedListings = { ...safeListings };
            const listingIndex = updatedListings.data.findIndex((l) => l.id === listingId);

            if (listingIndex !== -1) {
                updatedListings.data[listingIndex].yes_votes = yes_votes;
                updatedListings.data[listingIndex].no_votes = no_votes;
                updatedListings.data[listingIndex].yes_percentage = yes_percentage;
                updatedListings.data[listingIndex].no_percentage = no_percentage;
            }

            toast.success('Vote recorded successfully!');
        } catch (error) {
            console.error('Error voting for listing', error);
            const axiosError = error as { response?: { status?: number } };
            if (axiosError.response?.status === 401) {
                toast.error('You need to be logged in to vote');
            } else {
                toast.error('Failed to vote. Please try again later.');
            }
        } finally {
            // Clear loading state
            setLoadingVotes((prev) => ({ ...prev, [listingId]: false }));
        }
    };

    const handleExchangeTypeChange = (type: string) => {
        setExchangeType(type);
        router.get(
            '/crypto-exchange-listings',
            { exchange_type: type === 'all' ? undefined : type, exchange: selectedExchange === 'all' ? undefined : selectedExchange },
            { preserveState: true },
        );
    };

    const handleExchangeChange = (exchange: string) => {
        setSelectedExchange(exchange);
        router.get(
            '/crypto-exchange-listings',
            { exchange_type: exchangeType === 'all' ? undefined : exchangeType, exchange: exchange === 'all' ? undefined : exchange },
            { preserveState: true },
        );
    };

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            router.get(
                '/crypto-exchange-listings',
                {
                    exchange_type: exchangeType === 'all' ? undefined : exchangeType,
                    exchange: selectedExchange === 'all' ? undefined : selectedExchange,
                    search: searchQuery,
                },
                { preserveState: true },
            );
        }
    };

    const copyListingLink = (e: React.MouseEvent, listingId: number, slug: string) => {
        e.stopPropagation();
        const url = `${window.location.origin}/crypto-exchange-listings/${slug}`;
        navigator.clipboard.writeText(url);
        toast.success('Link copied to clipboard!');
    };

    const columns = [
        {
            accessorKey: 'formatted_listing_date',
            header: 'Date / Time',
            cell: ({ row }: { row: RowData }) => {
                return <div className="text-left font-medium" dangerouslySetInnerHTML={{ __html: row.original.formatted_listing_date }} />;
            },
            enableSorting: true,
        },
        {
            accessorKey: 'coin_name',
            header: 'Coin',
            cell: ({ row }: { row: RowData }) => {
                const listing = row.original;
                return (
                    <div className="flex items-center gap-2">
                        <Avatar className="h-10 w-10 rounded-full border">
                            <AvatarImage src={listing.coin_logo ?? undefined} alt={listing.coin_name} />
                            <AvatarFallback className="bg-primary/10 text-primary font-bold">{listing.coin_symbol.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="font-medium">{listing.coin_name}</div>
                            <div className="text-muted-foreground text-xs">({listing.coin_symbol})</div>
                        </div>
                        {listing.is_featured && <Badge className="ml-1 border border-red-200 bg-red-100 font-semibold text-red-800">Featured</Badge>}
                    </div>
                );
            },
            enableSorting: true,
        },
        {
            accessorKey: 'exchange_name',
            header: 'Exchange',
            cell: ({ row }: { row: RowData }) => {
                const listing = row.original;
                return (
                    <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8 rounded-full border">
                            <AvatarImage src={listing.exchange_logo ?? undefined} alt={listing.exchange_name} />
                            <AvatarFallback className="bg-secondary/80 text-secondary-foreground font-bold">
                                {listing.exchange_name.slice(0, 2)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="font-medium">{listing.exchange_name}</div>
                    </div>
                );
            },
            enableSorting: true,
        },
        {
            accessorKey: 'listing_type',
            header: 'Type',
            cell: ({ row }: { row: RowData }) => (
                <div className="flex justify-start">
                    <ListingTypeBadge type={row.original.listing_type} />
                </div>
            ),
            enableSorting: true,
        },
        {
            accessorKey: 'trading_pairs',
            header: 'Trading Pairs',
            cell: ({ row }: { row: RowData }) => {
                const listing = row.original;
                return <div className="text-left font-medium">{listing.trading_pairs || 'TBA'}</div>;
            },
        },
        {
            accessorKey: 'already_listing_count',
            header: 'Already Listing',
            cell: ({ row }: { row: RowData }) => {
                const listing = row.original;
                return (
                    <div className="text-left font-medium">
                        {listing.already_listing_count > 0 ? (
                            <Badge variant="outline" className="bg-primary/10 font-medium text-primary border-primary/20">
                                {listing.already_listing_count} Exchanges
                            </Badge>
                        ) : (
                            'None'
                        )}
                    </div>
                );
            },
            enableSorting: true,
        },
        {
            accessorKey: 'actions',
            header: 'Actions',
            cell: ({ row }: { row: RowData }) => {
                const listing = row.original;
                const isVoted = votedListings[listing.id];
                const isLoading = loadingVotes[listing.id];

                // Calculate totals
                const yesVotes = listing.yes_votes || 0;
                const noVotes = listing.no_votes || 0;
                const totalVotes = yesVotes + noVotes;
                const yesPercentage = totalVotes > 0 ? Math.round((yesVotes / totalVotes) * 100) : 0;
                const noPercentage = totalVotes > 0 ? Math.round((noVotes / totalVotes) * 100) : 0;

                return (
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        {/* Vote buttons */}
                        <div className="flex items-center overflow-hidden rounded-lg border">
                            <button
                                className={`flex items-center px-2 py-1 text-sm font-medium transition-colors ${
                                    isVoted === 'yes'
                                        ? 'bg-green-100 text-green-700'
                                        : isLoading
                                          ? 'bg-gray-100 text-gray-500'
                                          : 'bg-green-50 text-green-600 hover:bg-green-100'
                                }`}
                                onClick={(e) => handleVote(e, listing.id, 'yes')}
                                disabled={!!isVoted || isLoading}
                            >
                                <ThumbsUp className={`mr-1 h-3 w-3 ${isVoted === 'yes' ? 'fill-green-600' : ''}`} />
                                {yesPercentage}%
                            </button>
                            <button
                                className={`flex items-center px-2 py-1 text-sm font-medium transition-colors ${
                                    isVoted === 'no'
                                        ? 'bg-red-100 text-red-700'
                                        : isLoading
                                          ? 'bg-gray-100 text-gray-500'
                                          : 'bg-red-50 text-red-600 hover:bg-red-100'
                                }`}
                                onClick={(e) => handleVote(e, listing.id, 'no')}
                                disabled={!!isVoted || isLoading}
                            >
                                <ThumbsDown className={`mr-1 h-3 w-3 ${isVoted === 'no' ? 'fill-red-600' : ''}`} />
                                {noPercentage}%
                            </button>
                        </div>

                        {/* Share Dialog */}
                        <ShareDialog
                            url={`${window.location.origin}/crypto-exchange-listings/${listing.slug}`}
                            title={`${listing.coin_name} (${listing.coin_symbol}) ${listing.listing_type} on ${listing.exchange_name}`}
                            description={listing.description ? listing.description.slice(0, 200) : ''}
                            trigger={
                                <button
                                    className="rounded-full bg-gray-100 p-1.5 transition-colors hover:bg-gray-200"
                                    onClick={(e) => e.stopPropagation()}
                                    title="Share"
                                >
                                    <Share2 className="h-4 w-4" />
                                </button>
                            }
                        />
                    </div>
                );
            },
        },
    ];

    const toggleMobileFilters = () => {
        setMobileFiltersOpen(!mobileFiltersOpen);
    };

    return (
        <>
            <Head>
                <title>Crypto Exchange Listings | CoinMews</title>
                <meta
                    name="description"
                    content="Stay updated with the latest cryptocurrency exchange listings and delistings. Find information about upcoming token listings on major exchanges."
                />
            </Head>
            <Header />

            <div className="mx-auto max-w-7xl">
                <div className="px-4 pb-8 lg:px-8">
                    <div className="my-8">
                        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Crypto Exchange Listings</h1>
                        <p className="text-muted-foreground mt-1">
                            Track upcoming cryptocurrency listings and delistings on major exchanges. Stay ahead of market movements.
                        </p>
                    </div>

                    {/* Mobile Filter Button */}
                    <div className="mb-4 flex items-center justify-between lg:hidden">
                        <Button variant="outline" onClick={toggleMobileFilters} className="flex items-center gap-2">
                            <FilterIcon className="h-4 w-4" />
                            Filters
                        </Button>
                        <div className="relative ml-2 max-w-sm flex-1">
                            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                            <Input
                                placeholder="Search..."
                                className="pl-9"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleSearch}
                            />
                        </div>
                    </div>

                    {/* Image Slider */}
                    {/* <div className="my-6">
                        <ImageSlider images={sliderImages} />
                    </div> */}

                    {/* Filters */}
                    <div className="mb-8">
                        <div className="">
                            {/* Desktop Filters */}
                            <div className="hidden lg:block">
                                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                                    <div>
                                        <div className="relative">
                                            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                                            <Input
                                                placeholder="Search By Coin Name or Symbol..."
                                                className="pl-9"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                onKeyDown={handleSearch}
                                            />
                                        </div>
                                    </div>
                                    <div className="w-max">
                                        <Select value={selectedExchange} onValueChange={handleExchangeChange}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Exchange" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Exchanges</SelectItem>
                                                {safeExchanges.map((exchange) => (
                                                    <SelectItem key={exchange} value={exchange}>
                                                        {exchange}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Tabs defaultValue={exchangeType} onValueChange={handleExchangeTypeChange} className="w-full">
                                            <TabsList className="grid w-full grid-cols-3">
                                                <TabsTrigger value="all">All</TabsTrigger>
                                                <TabsTrigger value="listing">Listings</TabsTrigger>
                                                <TabsTrigger value="delisting">Delistings</TabsTrigger>
                                            </TabsList>
                                        </Tabs>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Filters Sidebar */}
                    {mobileFiltersOpen && (
                        <div className="bg-background/80 fixed inset-0 z-50 backdrop-blur-sm lg:hidden">
                            <div className="bg-background fixed inset-y-0 left-0 w-full max-w-xs p-6 shadow-lg">
                                <div className="mb-6 flex items-center justify-between">
                                    <h2 className="text-lg font-semibold">Filters</h2>
                                    <Button variant="ghost" size="icon" onClick={toggleMobileFilters}>
                                        <XIcon className="h-5 w-5" />
                                    </Button>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium">Listing Type</label>
                                        <div className="space-y-2">
                                            <FilterButton active={exchangeType === 'all'} onClick={() => handleExchangeTypeChange('all')}>
                                                All Listings
                                            </FilterButton>
                                            <FilterButton active={exchangeType === 'listing'} onClick={() => handleExchangeTypeChange('listing')}>
                                                Exchange Listings
                                            </FilterButton>
                                            <FilterButton active={exchangeType === 'delisting'} onClick={() => handleExchangeTypeChange('delisting')}>
                                                Exchange Delistings
                                            </FilterButton>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium">Exchange</label>
                                        <Select value={selectedExchange} onValueChange={handleExchangeChange}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Exchange" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Exchanges</SelectItem>
                                                {safeExchanges.map((exchange) => (
                                                    <SelectItem key={exchange} value={exchange}>
                                                        {exchange}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <Button onClick={toggleMobileFilters} className="w-full">
                                        Apply Filters
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Table */}
                    <div className="bg-card rounded-lg shadow-sm">
                        <DataTable
                            columns={columns}
                            data={safeListings.data}
                            pageCount={Math.ceil(safeListings.total / safeListings.per_page)}
                            currentPage={safeListings.current_page}
                            onRowClick={handleRowClick}
                        />

                        {/* Pagination */}
                        {safeListings.total > safeListings.per_page && (
                            <div className="bg-muted/20 flex items-center justify-between border-t px-4 py-3">
                                <div className="text-muted-foreground text-sm">
                                    Showing <span className="font-medium">{safeListings.data.length}</span> of{' '}
                                    <span className="font-medium">{safeListings.total}</span> listings
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 px-3"
                                        disabled={safeListings.current_page === 1}
                                        onClick={() =>
                                            router.get(
                                                '/crypto-exchange-listings',
                                                {
                                                    page: safeListings.current_page - 1,
                                                    exchange_type: exchangeType !== 'all' ? exchangeType : undefined,
                                                    exchange: selectedExchange !== 'all' ? selectedExchange : undefined,
                                                    search: searchQuery || undefined,
                                                },
                                                { preserveState: true },
                                            )
                                        }
                                    >
                                        <ChevronLeft className="mr-1 h-4 w-4" /> Previous
                                    </Button>
                                    <span className="px-3 text-sm">Page {safeListings.current_page}</span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 px-3"
                                        disabled={safeListings.current_page * safeListings.per_page >= safeListings.total}
                                        onClick={() =>
                                            router.get(
                                                '/crypto-exchange-listings',
                                                {
                                                    page: safeListings.current_page + 1,
                                                    exchange_type: exchangeType !== 'all' ? exchangeType : undefined,
                                                    exchange: selectedExchange !== 'all' ? selectedExchange : undefined,
                                                    search: searchQuery || undefined,
                                                },
                                                { preserveState: true },
                                            )
                                        }
                                    >
                                        Next <ChevronRight className="ml-1 h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

function ListingTypeBadge({ type }: { type: CryptoExchangeListing['listing_type'] }) {
    if (type === 'listing') {
        return <Badge className="rounded-full bg-green-500 px-3 py-0.5 text-white hover:bg-green-600">Listing</Badge>;
    } else {
        return <Badge className="rounded-full bg-red-500 px-3 py-0.5 text-white hover:bg-red-600">Delisting</Badge>;
    }
}

function FilterButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
    return (
        <button
            onClick={onClick}
            className={`w-full rounded-md px-3 py-2 text-left transition-colors ${
                active ? 'bg-primary text-primary-foreground font-medium' : 'hover:bg-muted text-foreground'
            }`}
        >
            {children}
        </button>
    );
}
