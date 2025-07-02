import Footer from '@/components/sections/footer';
import Header from '@/components/sections/header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Presale } from '@/types/presaleTypes';
import { Head, router, usePage } from '@inertiajs/react';
import { ChevronsUpDown, Search } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface Filters {
    search?: string;
    status?: string;
    stage?: string;
}

interface PresaleIndexPageProps {
    presales: {
        data: Presale[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    stages: string[];
    stats: {
        total: number;
        ongoing: number;
        upcoming: number;
        ended: number;
    };
    filters: Filters;
    sort: {
        field: string;
        direction: string;
    };
}

export default function Index({ presales, stages, stats, filters, sort }: PresaleIndexPageProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [stage, setStage] = useState(filters.stage || '');
    const [isLoading, setIsLoading] = useState(false);
    const {
        props: { errors },
    } = usePage();

    const handleSearch = (value: string) => {
        setSearch(value);
        setIsLoading(true);
        router.get(
            route('presales.index'),
            {
                ...filters,
                search: value,
                page: 1,
            },
            {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    setIsLoading(false);
                },
                onError: () => {
                    setIsLoading(false);
                    toast.error('Failed to apply search filter');
                },
            },
        );
    };

    const handleFilter = (type: keyof Filters, value: string) => {
        const newFilters = { ...filters };
        if (value === 'all') {
            delete newFilters[type];
        } else {
            newFilters[type] = value;
        }

        setIsLoading(true);
        router.get(
            route('presales.index'),
            {
                ...newFilters,
                page: 1,
            },
            {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    setIsLoading(false);
                    switch (type) {
                        case 'status':
                            setStatus(value);
                            break;
                        case 'stage':
                            setStage(value);
                            break;
                    }
                },
                onError: () => {
                    setIsLoading(false);
                    toast.error('Failed to apply filter');
                },
            },
        );
    };

    const handleSort = (field: string) => {
        const direction = sort.field === field && sort.direction === 'asc' ? 'desc' : 'asc';
        router.get(
            route('presales.index'),
            {
                ...filters,
                sort: field,
                direction,
                page: 1, // Reset to first page when sorting
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const columns = [
        {
            accessorKey: 'name',
            header: 'Name',
            enableSorting: true,
            cell: ({ row }: { row: { original: Presale } }) => {
                const presale = row.original;
                return (
                    <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={presale.logo_url} alt={presale.name} />
                            <AvatarFallback>{presale.token_symbol.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="font-medium">{presale.name}</div>
                            <div className="text-muted-foreground text-sm">{presale.token_symbol}</div>
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: 'stage',
            header: 'Stage',
            enableSorting: true,
            cell: ({ row }: { row: { original: Presale } }) => {
                const presale = row.original;
                return <Badge variant="outline">{presale.stage}</Badge>;
            },
        },
        {
            accessorKey: 'launchpad',
            header: 'Launchpad',
            enableSorting: true,
            cell: ({ row }: { row: { original: Presale } }) => {
                const presale = row.original;
                return presale.launchpad || '--';
            },
        },
        {
            accessorKey: 'status',
            header: 'Status',
            enableSorting: true,
            cell: ({ row }: { row: { original: Presale } }) => {
                const presale = row.original;
                return <StatusBadge status={presale.status} />;
            },
        },
        {
            accessorKey: 'token_price',
            header: 'Price',
            enableSorting: true,
            cell: ({ row }: { row: { original: Presale } }) => {
                const presale = row.original;
                return `${Number(presale.token_price).toLocaleString()} ${presale.token_price_currency}`;
            },
        },
        {
            accessorKey: 'upvotes_count',
            header: 'Upvotes',
            enableSorting: true,
            cell: ({ row }: { row: { original: Presale } }) => {
                const presale = row.original;
                return presale.upvotes_count.toLocaleString();
            },
        },
        {
            accessorKey: 'tokens_for_sale',
            header: 'Tokens for Sale',
            enableSorting: true,
            cell: ({ row }: { row: { original: Presale } }) => {
                const presale = row.original;
                return presale.tokens_for_sale ? Number(presale.tokens_for_sale).toLocaleString() : '--';
            },
        },
        {
            accessorKey: 'fundraising_goal',
            header: 'Fundraising Goal',
            enableSorting: true,
            cell: ({ row }: { row: { original: Presale } }) => {
                const presale = row.original;
                return presale.fundraising_goal ? `$${Number(presale.fundraising_goal).toLocaleString()}` : '--';
            },
        },
        {
            accessorKey: 'start_date',
            header: 'Start Date',
            enableSorting: true,
            cell: ({ row }: { row: { original: Presale } }) => {
                const presale = row.original;
                return new Date(presale.start_date).toLocaleDateString();
            },
        },
        {
            accessorKey: 'end_date',
            header: 'End Date',
            enableSorting: true,
            cell: ({ row }: { row: { original: Presale } }) => {
                const presale = row.original;
                return new Date(presale.end_date).toLocaleDateString();
            },
        },
        {
            accessorKey: 'remaining_time',
            header: 'Remaining',
            enableSorting: false,
            cell: ({ row }: { row: { original: Presale } }) => {
                const presale = row.original;
                return presale.remaining_time;
            },
        },
    ];

    return (
        <>
            <Head>
                <title>Presales | CoinMews</title>
                <meta name="description" content="Find the latest crypto presales, token launches, and early investment opportunities on CoinMews." />
                <meta name="keywords" content="crypto presales, token launches, early investment, CoinMews" />
                <link rel="canonical" href={window.location.origin + '/presales'} />
                <meta property="og:title" content="Presales | CoinMews" />
                <meta property="og:description" content="Find the latest crypto presales, token launches, and early investment opportunities on CoinMews." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={window.location.origin + '/presales'} />
                <meta property="og:image" content="/favicon.png" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Presales | CoinMews" />
                <meta name="twitter:description" content="Find the latest crypto presales, token launches, and early investment opportunities on CoinMews." />
                <meta name="twitter:image" content="/favicon.png" />
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'CollectionPage',
                    'name': 'Presales',
                    'description': 'Find the latest crypto presales and token launches.',
                    'url': window.location.origin + '/presales',
                    'breadcrumb': {
                        '@type': 'BreadcrumbList',
                        'itemListElement': [
                            { '@type': 'ListItem', position: 1, name: 'Home', item: window.location.origin },
                            { '@type': 'ListItem', position: 2, name: 'Presales', item: window.location.origin + '/presales' }
                        ]
                    }
                }) }} />
            </Head>
            <Header />
            <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
                <div className="mb-6">
                    <h1 className="text-4xl font-bold">Crypto Presales</h1>
                    <p className="text-muted-foreground">Discover and participate in upcoming token presales</p>
                </div>

                {/* Stats */}
                <div className="mb-6 grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Presales</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Ongoing Presales</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.ongoing}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Upcoming Presales</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.upcoming}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Ended Presales</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.ended}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-1 items-center gap-2">
                        <Input placeholder="Search presales..." className="max-w-sm" value={search} onChange={(e) => handleSearch(e.target.value)} />
                        <Button variant="outline" size="icon">
                            <Search className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="flex items-center gap-2">
                        <Select value={stage} onValueChange={(value) => handleFilter('stage', value)}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Stage" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Stages</SelectItem>
                                {stages.map((stageItem) => (
                                    <SelectItem key={stageItem} value={stageItem}>
                                        {stageItem}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={status} onValueChange={(value) => handleFilter('status', value)}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="ongoing">Ongoing</SelectItem>
                                <SelectItem value="upcoming">Upcoming</SelectItem>
                                <SelectItem value="ended">Ended</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Data Table */}
                <div className="rounded-md border">
                    <DataTable
                        columns={columns.map((column) => ({
                            ...column,
                            header: (
                                <div className="flex items-center space-x-2">
                                    <span>{column.header}</span>
                                    {column.enableSorting && (
                                        <Button
                                            variant="ghost"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleSort(column.accessorKey);
                                            }}
                                            className="hover:bg-muted h-8 w-8 p-0"
                                        >
                                            <ChevronsUpDown className="text-muted-foreground h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            ),
                            cell: ({ row }: { row: { original: Presale } }) => (
                                <div onClick={() => router.visit(route('presales.show', { slug: row.original.slug }))} className="cursor-pointer">
                                    {column.cell({ row })}
                                </div>
                            ),
                        }))}
                        data={presales.data}
                        pageCount={presales.last_page}
                        currentPage={presales.current_page}
                    />
                </div>

                {/* Pagination */}
                <div className="mt-4 flex items-center justify-between px-2">
                    <div className="text-muted-foreground flex-1 text-sm">
                        {presales.total} {presales.total === 1 ? 'Result' : 'Results'}
                    </div>
                    <div className="flex items-center space-x-6 lg:space-x-8">
                        <div className="flex items-center space-x-2">
                            <p className="text-sm font-medium">
                                Page {presales.current_page} of {presales.last_page}
                            </p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    router.get(
                                        route('presales.index'),
                                        {
                                            ...filters,
                                            page: presales.current_page - 1,
                                        },
                                        {
                                            preserveState: true,
                                            preserveScroll: true,
                                        },
                                    );
                                }}
                                disabled={presales.current_page === 1}
                            >
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    router.get(
                                        route('presales.index'),
                                        {
                                            ...filters,
                                            page: presales.current_page + 1,
                                        },
                                        {
                                            preserveState: true,
                                            preserveScroll: true,
                                        },
                                    );
                                }}
                                disabled={presales.current_page === presales.last_page}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

function StatusBadge({ status }: { status: Presale['status'] }) {
    const variants: Record<Presale['status'], { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
        ongoing: { variant: 'default', label: 'Ongoing' },
        upcoming: { variant: 'secondary', label: 'Upcoming' },
        ended: { variant: 'outline', label: 'Ended' },
    };

    const { variant, label } = variants[status];
    return <Badge variant={variant}>{label}</Badge>;
}
