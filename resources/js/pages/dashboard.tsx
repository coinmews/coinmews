import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { format } from 'date-fns';
import { ArrowUpRight, Calendar, Eye, FileText, Plus } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface SubmissionData {
    id: number;
    name: string;
    type: string;
    status: string;
    created_at: string;
    url: string;
}

interface DashboardProps {
    stats: {
        totalSubmissions: number;
        totalPublished: number;
        totalPending: number;
        submissionsChange: number;
        publishedChange: number;
        pendingChange: number;
    };
    recentSubmissions: SubmissionData[];
}

export default function Dashboard({ stats, recentSubmissions }: DashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="flex flex-1 flex-col gap-4 px-4 py-6 md:gap-8">
                {/* Welcome banner */}
                <div className="bg-primary text-primary-foreground relative overflow-hidden rounded-lg p-6">
                    <div className="relative z-10">
                        <h1 className="text-2xl font-bold tracking-tight">Welcome back!</h1>
                        <p className="text-primary-foreground/90 mt-2 max-w-md">
                            Track your submissions, manage your profile, and explore the latest content from your dashboard.
                        </p>
                        <Button asChild variant="secondary" className="mt-4">
                            <Link href={route('submissions.create')}>
                                <Plus className="mr-2 h-4 w-4" />
                                Create New Submission
                            </Link>
                        </Button>
                    </div>
                    <div className="absolute top-0 right-0 translate-x-1/3 -translate-y-1/4 transform">
                        <svg width="350" height="350" viewBox="0 0 350 350" xmlns="http://www.w3.org/2000/svg" className="opacity-20">
                            <circle cx="175" cy="175" r="175" fill="white" />
                        </svg>
                    </div>
                </div>

                {/* Dashboard overview */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
                            <FileText className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalSubmissions}</div>
                            <p className="text-muted-foreground text-xs">
                                {stats.submissionsChange > 0 ? '+' : ''}
                                {stats.submissionsChange} from last month
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Content</CardTitle>
                            <Calendar className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalPublished}</div>
                            <p className="text-muted-foreground text-xs">Currently active submissions</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                            <Eye className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalPending}</div>
                            <p className="text-muted-foreground text-xs">Submissions awaiting approval</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Submissions */}
                <Card className="col-span-3">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Recent Submissions</CardTitle>
                            <CardDescription>Your most recent content submissions</CardDescription>
                        </div>
                        <Button asChild variant="ghost" size="sm">
                            <Link href={route('submissions.index')}>
                                View All
                                <ArrowUpRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {recentSubmissions.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                                <Calendar className="text-muted-foreground/80 h-12 w-12" />
                                <h3 className="mt-4 text-lg font-semibold">No submissions yet</h3>
                                <p className="text-muted-foreground mt-2 text-sm">Create your first submission to get started</p>
                                <Button asChild className="mt-4">
                                    <Link href={route('submissions.create')}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        New Submission
                                    </Link>
                                </Button>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Submitted</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {recentSubmissions.map((submission) => (
                                        <TableRow key={`${submission.type}-${submission.id}`}>
                                            <TableCell className="font-medium">{submission.name}</TableCell>
                                            <TableCell className="capitalize">{submission.type}</TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        submission.status === 'approved' || submission.status === 'published'
                                                            ? 'default'
                                                            : submission.status === 'pending' || submission.status === 'upcoming'
                                                              ? 'secondary'
                                                              : 'destructive'
                                                    }
                                                >
                                                    {submission.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{submission.created_at ? format(new Date(submission.created_at), 'PPP') : 'N/A'}</TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm" asChild>
                                                    <Link href={submission.url}>View</Link>
                                                </Button>
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
