import Footer from '@/components/sections/footer';
import Header from '@/components/sections/header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Airdrop, AirdropFilters, AirdropStats } from '@/types/airdropTypes';
import { Head, Link, router } from '@inertiajs/react';
import axios from 'axios';
import { ChevronLeft, ChevronRight, Search, ThumbsUp } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface AirdropIndexPageProps {
    airdrops: {
        data: Airdrop[];
        current_page: number;
        per_page: number;
        total: number;
    };
    filters: AirdropFilters;
    stats: AirdropStats;
    blockchains: string[];
}

interface RowData {
    original: Airdrop;
}

export default function Index({ airdrops, filters, stats, blockchains }: AirdropIndexPageProps) {
    const [activeTab, setActiveTab] = useState<string>(filters.status || 'all');
    const [searchQuery, setSearchQuery] = useState<string>(filters.search || '');
    const [upvotedAirdrops, setUpvotedAirdrops] = useState<{ [key: number]: boolean }>({});
    const [upvoteCounts, setUpvoteCounts] = useState<{ [key: number]: number }>({});

    // Initialize upvote counts from data
    useState(() => {
        const counts: { [key: number]: number } = {};
        airdrops.data.forEach((airdrop) => {
            counts[airdrop.id] = airdrop.upvotes_count;
        });
        setUpvoteCounts(counts);
    });

    const handleRowClick = (airdrop: Airdrop) => {
        // Use Inertia router instead of direct window location
        router.visit(`/airdrops/${airdrop.slug}`);
    };

    const handleUpvote = async (e: React.MouseEvent, airdropId: number) => {
        // Stop event propagation to prevent row click
        e.stopPropagation();

        if (upvotedAirdrops[airdropId]) {
            return;
        }

        try {
            const response = await axios.post(`/api/airdrops/${airdropId}/upvote`);

            // Update local state
            setUpvotedAirdrops((prev) => ({ ...prev, [airdropId]: true }));
            setUpvoteCounts((prev) => ({ ...prev, [airdropId]: response.data.upvotes_count }));

            toast.success('Airdrop upvoted successfully!');
        } catch (error) {
            console.error('Error upvoting airdrop', error);
            toast.error('You need to be logged in to upvote');
        }
    };

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        router.get('/airdrops', { status: tab }, { preserveState: true });
    };

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            router.get('/airdrops', { search: searchQuery, status: activeTab }, { preserveState: true });
        }
    };

    const columns = [
        {
            accessorKey: 'name',
            header: 'Name',
            cell: ({ row }: { row: RowData }) => {
                const airdrop = row.original;
                return (
                    <div className="flex items-center gap-2">
                        <Avatar className="h-10 w-10 rounded-full border">
                            <AvatarImage src={airdrop.logo_url ?? undefined} alt={airdrop.name} />
                            <AvatarFallback className="bg-primary/10 text-primary font-bold">{airdrop.token_symbol.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="font-medium">{airdrop.name}</div>
                            <div className="text-muted-foreground text-xs">({airdrop.token_symbol})</div>
                        </div>
                        {airdrop.is_featured && <Badge className="ml-1 border border-red-200 bg-red-100 font-semibold text-red-800">Featured</Badge>}
                    </div>
                );
            },
            enableSorting: true,
        },
        {
            accessorKey: 'type',
            header: 'Type',
            cell: ({ row }: { row: RowData }) => <div className="text-center font-medium">Token</div>,
            enableSorting: true,
        },
        {
            accessorKey: 'upvotes_count',
            header: 'Upvotes',
            cell: ({ row }: { row: RowData }) => {
                const airdrop = row.original;
                const isUpvoted = upvotedAirdrops[airdrop.id];
                const count = upvoteCounts[airdrop.id] || airdrop.upvotes_count;

                return (
                    <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                        <button
                            className={`flex items-center rounded-full bg-red-50 px-3 py-1 font-medium text-red-700 transition-colors ${
                                isUpvoted ? 'bg-red-100' : 'hover:bg-red-100'
                            }`}
                            onClick={(e) => handleUpvote(e, airdrop.id)}
                            disabled={isUpvoted}
                        >
                            <ThumbsUp className={`mr-1.5 h-4 w-4 ${isUpvoted ? 'fill-red-600 text-red-600' : 'text-red-500'}`} />
                            {count}
                        </button>
                    </div>
                );
            },
            enableSorting: true,
        },
        {
            accessorKey: 'winners_count',
            header: 'Winners',
            cell: ({ row }: { row: RowData }) => {
                const airdrop = row.original;
                return <div className="text-center font-medium">{airdrop.winners_count?.toLocaleString() || 'TBA'}</div>;
            },
            enableSorting: true,
        },
        {
            accessorKey: 'airdrop_qty',
            header: 'Qty',
            cell: ({ row }: { row: RowData }) => {
                const airdrop = row.original;
                return <div className="text-center font-medium">{airdrop.airdrop_qty ? Number(airdrop.airdrop_qty).toLocaleString() : 'TBA'}</div>;
            },
            enableSorting: true,
        },
        {
            accessorKey: 'time_remaining',
            header: 'Ends In',
            cell: ({ row }: { row: RowData }) => {
                const airdrop = row.original;
                return (
                    <div className="text-center">
                        {airdrop.status === 'ongoing' ? (
                            <Badge className="bg-green-100 font-medium text-green-800">{airdrop.time_remaining}</Badge>
                        ) : airdrop.status === 'ended' ? (
                            <Badge className="bg-red-100 font-medium text-red-800">Ended</Badge>
                        ) : (
                            <div className="font-medium">{airdrop.time_remaining}</div>
                        )}
                    </div>
                );
            },
            enableSorting: true,
        },
        {
            accessorKey: 'tasks_count',
            header: 'No. of Task',
            cell: ({ row }: { row: RowData }) => {
                const airdrop = row.original;
                return <div className="text-center font-medium">{airdrop.tasks_count || 0}</div>;
            },
            enableSorting: true,
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }: { row: RowData }) => (
                <div className="flex justify-center">
                    <StatusBadge status={row.original.status} />
                </div>
            ),
            enableSorting: true,
        },
    ];

    return (
        <>
            <Head>
                <title>Airdrops | CoinMews</title>
                <meta
                    name="description"
                    content="Discover the latest cryptocurrency airdrops, track their requirements, and never miss an opportunity."
                />
            </Head>
            <Header />

            <div className="mx-auto max-w-7xl px-4 py-4 lg:px-8">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold tracking-tight">Crypto Ongoing Airdrop</h1>
                    <p className="text-muted-foreground">
                        Find the newest coin airdrops. Stay informed about the best airdrops and claim free tokens.
                    </p>
                </div>

                {/* Banner Ad */}
                <div className="relative mb-6 overflow-hidden rounded-lg">
                    <Link href="https://example.com" className="group block w-full">
                        <img
                            src="https://dummyimage.com/1200x300/dbdbdb/000000.png"
                            alt="Crypto Bonus"
                            className="h-32 w-full bg-black object-cover opacity-90 md:h-40"
                        />
                    </Link>
                </div>

                {/* Tab Navigation */}
                <div className="mb-4 flex space-x-2 overflow-x-auto pb-2">
                    <TabButton active={activeTab === 'all'} onClick={() => handleTabChange('all')}>
                        All Airdrops
                    </TabButton>
                    <TabButton active={activeTab === 'ongoing'} onClick={() => handleTabChange('ongoing')}>
                        Ongoing Airdrop
                    </TabButton>
                    <TabButton active={activeTab === 'upcoming'} onClick={() => handleTabChange('upcoming')}>
                        Upcoming Airdrop
                    </TabButton>
                    <TabButton active={activeTab === 'potential'} onClick={() => handleTabChange('potential')}>
                        Potential Airdrop
                    </TabButton>
                </div>

                {/* Search and Filters */}
                <div className="mb-4 flex flex-wrap gap-2">
                    <div className="relative min-w-[200px] flex-1">
                        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                        <Input
                            placeholder="Search By Keyword..."
                            className="pl-9"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleSearch}
                        />
                    </div>
                    <Select>
                        <SelectTrigger>
                            <SelectValue placeholder="Airdrop Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="token">Token</SelectItem>
                            <SelectItem value="nft">NFT</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select>
                        <SelectTrigger>
                            <SelectValue placeholder="Select Platform" />
                        </SelectTrigger>
                        <SelectContent>
                            {blockchains.map((blockchain) => (
                                <SelectItem key={blockchain} value={blockchain}>
                                    {blockchain}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Table */}
                <div>
                    <DataTable
                        columns={columns}
                        data={airdrops.data}
                        pageCount={Math.ceil(airdrops.total / airdrops.per_page)}
                        currentPage={airdrops.current_page}
                        onRowClick={handleRowClick}
                    />

                    {/* Pagination */}
                    {airdrops.total > airdrops.per_page && (
                        <div className="bg-muted/20 flex items-center justify-between border-t px-4 py-2">
                            <div className="text-muted-foreground text-sm">
                                Showing <span className="font-medium">{airdrops.data.length}</span> of{' '}
                                <span className="font-medium">{airdrops.total}</span> airdrops
                            </div>
                            <div className="flex items-center space-x-1">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    disabled={airdrops.current_page === 1}
                                    onClick={() =>
                                        router.get(
                                            '/airdrops',
                                            {
                                                page: airdrops.current_page - 1,
                                                status: activeTab !== 'all' ? activeTab : undefined,
                                                search: searchQuery || undefined,
                                            },
                                            { preserveState: true },
                                        )
                                    }
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <span className="px-3 text-sm">Page {airdrops.current_page}</span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    disabled={airdrops.current_page * airdrops.per_page >= airdrops.total}
                                    onClick={() =>
                                        router.get(
                                            '/airdrops',
                                            {
                                                page: airdrops.current_page + 1,
                                                status: activeTab !== 'all' ? activeTab : undefined,
                                                search: searchQuery || undefined,
                                            },
                                            { preserveState: true },
                                        )
                                    }
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
}

function StatusBadge({ status }: { status: Airdrop['status'] }) {
    if (status === 'ongoing') {
        return <Badge className="rounded-full bg-green-500 px-3 py-0.5 text-white hover:bg-green-600">Ongoing</Badge>;
    } else if (status === 'ended') {
        return <Badge className="rounded-full bg-red-500 px-3 py-0.5 text-white hover:bg-red-600">Ended</Badge>;
    } else if (status === 'upcoming') {
        return <Badge className="rounded-full bg-primary px-3 py-0.5 text-primary-foreground hover:bg-primary/90">Upcoming</Badge>;
    } else {
        return (
            <Badge variant="outline" className="rounded-full px-3 py-0.5">
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
        );
    }
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
    return (
        <button
            onClick={onClick}
            className={`rounded-full px-4 py-2 font-medium whitespace-nowrap transition-colors ${
                active ? 'bg-yellow-500 text-black' : 'bg-secondary/80 text-muted-foreground hover:bg-secondary'
            }`}
        >
            {children}
        </button>
    );
}
