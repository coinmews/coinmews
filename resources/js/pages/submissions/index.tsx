import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dropdown, DropdownContent, DropdownItem, DropdownLabel, DropdownSeparator, DropdownTrigger } from '@/components/ui/dropdown';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { format } from 'date-fns';
import { CalendarIcon, ChevronDownIcon, Clock, EyeIcon, MoreHorizontal, Plus, TrashIcon } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Submissions',
        href: '/submissions',
    },
];

interface Submission {
    id: number;
    name: string;
    type: string;
    status: string;
    created_at: string;
    model_type?: string;
    model_id?: number;
    slug?: string;
}

interface SubmissionsProps {
    submissions: Submission[];
}

export default function Submissions({ submissions }: SubmissionsProps) {
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const [typeFilter, setTypeFilter] = useState<string | null>(null);

    // Extract unique submission types
    const types = Array.from(new Set(submissions.map((submission) => submission.type)));

    // Apply filters
    const filteredSubmissions = submissions.filter((submission) => {
        if (statusFilter && submission.status !== statusFilter) return false;
        if (typeFilter && submission.type !== typeFilter) return false;
        return true;
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head>
                <title>Submissions | CoinMews</title>
                <meta name="description" content="View and manage your submitted articles, news, and content on CoinMews. Track the status of your crypto submissions." />
                <meta name="keywords" content="crypto submissions, submitted articles, CoinMews" />
                <link rel="canonical" href={window.location.origin + '/submissions'} />
                <meta property="og:title" content="Submissions | CoinMews" />
                <meta property="og:description" content="View and manage your submitted articles, news, and content on CoinMews. Track the status of your crypto submissions." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={window.location.origin + '/submissions'} />
                <meta property="og:image" content="/favicon.png" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Submissions | CoinMews" />
                <meta name="twitter:description" content="View and manage your submitted articles, news, and content on CoinMews. Track the status of your crypto submissions." />
                <meta name="twitter:image" content="/favicon.png" />
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'CollectionPage',
                    'name': 'Submissions',
                    'description': 'View and manage your submitted articles, news, and content.',
                    'url': window.location.origin + '/submissions',
                    'breadcrumb': {
                        '@type': 'BreadcrumbList',
                        'itemListElement': [
                            { '@type': 'ListItem', position: 1, name: 'Home', item: window.location.origin },
                            { '@type': 'ListItem', position: 2, name: 'Submissions', item: window.location.origin + '/submissions' }
                        ]
                    }
                }) }} />
            </Head>

            <div className="space-y-6 px-4 py-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold">Submissions</h1>
                        <p className="text-muted-foreground">Manage and track your content submissions</p>
                    </div>
                    <Button asChild>
                        <Link href={route('submissions.create')}>
                            <Plus className="mr-2 h-4 w-4" />
                            New Submission
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader className="border-b">
                        <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
                            <div>
                                <CardTitle>Recent Submissions</CardTitle>
                                <CardDescription>Track the status of your recent content submissions</CardDescription>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {/* Type filter */}
                                <Dropdown>
                                    <DropdownTrigger asChild>
                                        <Button variant="outline" size="sm">
                                            {typeFilter ? `Type: ${typeFilter}` : 'All Types'}
                                            <ChevronDownIcon className="ml-2 h-4 w-4" />
                                        </Button>
                                    </DropdownTrigger>
                                    <DropdownContent>
                                        <DropdownItem onClick={() => setTypeFilter(null)}>All Types</DropdownItem>
                                        {types.map((type) => (
                                            <DropdownItem key={type} onClick={() => setTypeFilter(type)}>
                                                {type}
                                            </DropdownItem>
                                        ))}
                                    </DropdownContent>
                                </Dropdown>

                                {/* Status filter */}
                                <Dropdown>
                                    <DropdownTrigger asChild>
                                        <Button variant="outline" size="sm">
                                            {statusFilter ? `Status: ${statusFilter}` : 'All Statuses'}
                                            <ChevronDownIcon className="ml-2 h-4 w-4" />
                                        </Button>
                                    </DropdownTrigger>
                                    <DropdownContent>
                                        <DropdownItem onClick={() => setStatusFilter(null)}>All Statuses</DropdownItem>
                                        <DropdownItem onClick={() => setStatusFilter('pending')}>Pending</DropdownItem>
                                        <DropdownItem onClick={() => setStatusFilter('upcoming')}>Upcoming</DropdownItem>
                                        <DropdownItem onClick={() => setStatusFilter('approved')}>Approved</DropdownItem>
                                        <DropdownItem onClick={() => setStatusFilter('rejected')}>Rejected</DropdownItem>
                                    </DropdownContent>
                                </Dropdown>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="px-0 py-0">
                        {submissions.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <CalendarIcon className="text-muted-foreground/60 h-16 w-16" />
                                <h3 className="mt-4 text-lg font-semibold">No submissions yet</h3>
                                <p className="text-muted-foreground mt-2 text-sm">Create your first submission to get started</p>
                                <Button asChild className="mt-6">
                                    <Link href={route('submissions.create')}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        New Submission
                                    </Link>
                                </Button>
                            </div>
                        ) : filteredSubmissions.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <Clock className="text-muted-foreground/60 h-16 w-16" />
                                <h3 className="mt-4 text-lg font-semibold">No matching submissions</h3>
                                <p className="text-muted-foreground mt-2 text-sm">Try adjusting your filters to see more results</p>
                                <Button
                                    variant="outline"
                                    className="mt-6"
                                    onClick={() => {
                                        setStatusFilter(null);
                                        setTypeFilter(null);
                                    }}
                                >
                                    Clear Filters
                                </Button>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-14">ID</TableHead>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Submitted</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredSubmissions.map((submission) => (
                                        <TableRow key={`${submission.model_type || 'submission'}-${submission.id}`}>
                                            <TableCell className="font-mono text-xs">{submission.id}</TableCell>
                                            <TableCell className="font-medium">{submission.name}</TableCell>
                                            <TableCell>
                                                <TypeBadge type={submission.type} />
                                            </TableCell>
                                            <TableCell>
                                                <StatusBadge status={submission.status} />
                                            </TableCell>
                                            <TableCell>{submission.created_at ? format(new Date(submission.created_at), 'PPP') : 'N/A'}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end space-x-1">
                                                    <Button variant="ghost" size="icon" asChild title="View" className="hover:bg-primary/10">
                                                        <Link href={getViewLink(submission)}>
                                                            <EyeIcon className="text-primary h-4 w-4" />
                                                            <span className="sr-only">View</span>
                                                        </Link>
                                                    </Button>

                                                    <Dropdown>
                                                        <DropdownTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="hover:bg-muted">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                                <span className="sr-only">More options</span>
                                                            </Button>
                                                        </DropdownTrigger>
                                                        <DropdownContent align="end">
                                                            <DropdownLabel>Actions</DropdownLabel>
                                                            <DropdownItem asChild>
                                                                <Link href={getViewLink(submission)}>
                                                                    <EyeIcon className="mr-2 h-4 w-4" />
                                                                    View Details
                                                                </Link>
                                                            </DropdownItem>

                                                            <DropdownSeparator />

                                                            <DropdownItem className="text-destructive focus:text-destructive" asChild>
                                                                <Link
                                                                    href={getDeleteLink(submission)}
                                                                    method="delete"
                                                                    as="button"
                                                                    onSuccess={() => window.location.reload()}
                                                                >
                                                                    <TrashIcon className="mr-2 h-4 w-4" />
                                                                    Delete Submission
                                                                </Link>
                                                            </DropdownItem>
                                                        </DropdownContent>
                                                    </Dropdown>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

// Helper component for displaying status badges with appropriate colors
function StatusBadge({ status }: { status: string }) {
    switch (status.toLowerCase()) {
        case 'approved':
        case 'published':
            return (
                <Badge variant="default" className="bg-green-600">
                    {status}
                </Badge>
            );
        case 'pending':
        case 'reviewing':
            return (
                <Badge variant="secondary" className="bg-primary text-primary-foreground">
                    {status}
                </Badge>
            );
        case 'upcoming':
            return (
                <Badge variant="secondary" className="bg-primary text-primary-foreground">
                    {status}
                </Badge>
            );
        case 'rejected':
            return <Badge variant="destructive">{status}</Badge>;
        case 'ended':
        case 'completed':
            return (
                <Badge variant="outline" className="text-muted-foreground">
                    {status}
                </Badge>
            );
        default:
            return <Badge variant="secondary">{status}</Badge>;
    }
}

// Helper component for displaying type badges
function TypeBadge({ type }: { type: string }) {
    // Format the type nicely
    const formattedType = type.charAt(0).toUpperCase() + type.slice(1).replace(/_/g, ' ');

    switch (type.toLowerCase()) {
        case 'presale':
            return (
                <Badge variant="outline" className="border-purple-500 text-purple-700">
                    {formattedType}
                </Badge>
            );
        case 'airdrop':
            return (
                <Badge variant="outline" className="border-primary text-primary">
                    {formattedType}
                </Badge>
            );
        case 'event':
            return (
                <Badge variant="outline" className="border-green-500 text-green-700">
                    {formattedType}
                </Badge>
            );
        case 'press_release':
        case 'guest_post':
        case 'article':
            return (
                <Badge variant="outline" className="border-amber-500 text-amber-700">
                    {formattedType}
                </Badge>
            );
        case 'sponsored_content':
            return (
                <Badge variant="outline" className="border-pink-500 text-pink-700">
                    {formattedType}
                </Badge>
            );
        default:
            return (
                <Badge variant="outline" className="border-primary text-primary">
                    {formattedType}
                </Badge>
            );
    }
}

function getViewLink(submission: Submission): string {
    // For non-approved submissions, use the submissions show route
    if (submission.status !== 'approved') {
        return route('submissions.show', submission.id);
    }

    // For approved submissions, use their specific routes based on type
    switch (submission.type.toLowerCase()) {
        case 'airdrop':
            return route('airdrops.show', { slug: submission.model_id });
        case 'event':
            return route('events.show', { slug: submission.model_id });
        case 'article':
        case 'blog':
        case 'news':
        case 'guest_post':
        case 'sponsored_content':
        case 'press_release':
            return route('articles.show', { slug: submission.model_id });
        case 'presale':
            return route('presales.show', { slug: submission.model_id });
        case 'cryptocurrency_video':
            return route('cryptocurrency-videos.show', { slug: submission.model_id });
        case 'cryptocurrency_meme':
            return route('cryptocurrency-memes.show', { slug: submission.model_id });
        case 'crypto_exchange_listing':
            return route('crypto-exchange-listings.show', { slug: submission.model_id });
        default:
            // Fallback to submissions show route for unknown types
            return route('submissions.show', submission.id);
    }
}

function getDeleteLink(submission: Submission): string {
    return route('submissions.destroy', submission.id);
}
