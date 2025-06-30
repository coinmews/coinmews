import { SubmissionForm } from '@/components/submissions/SubmissionForm';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Submissions',
        href: '/submissions',
    },
    {
        title: 'Create',
        href: '/submissions/create',
    },
];

export default function CreateSubmission() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Submission" />

            <div className="mx-auto max-w-7xl space-y-8 px-4 py-8">
                <div className="from-primary/20 rounded-lg bg-gradient-to-r to-transparent p-6 shadow-sm">
                    <h1 className="text-primary text-3xl font-bold tracking-tight">Submit Your Content</h1>
                    <p className="text-muted-foreground mt-2 max-w-2xl">
                        Share your content with our community. We accept various types of submissions including presales, airdrops, events, press
                        releases, guest posts, and sponsored content.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    <div className="space-y-4 md:col-span-1">
                        <div className="bg-card rounded-lg p-4 shadow-sm">
                            <h3 className="mb-2 text-lg font-semibold">Submission Guidelines</h3>
                            <ul className="text-muted-foreground space-y-2 text-sm">
                                <li className="flex items-start">
                                    <span className="text-primary mr-2">•</span>
                                    <span>All submissions undergo review before publishing</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-primary mr-2">•</span>
                                    <span>Provide accurate and complete information</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-primary mr-2">•</span>
                                    <span>Upload high-quality images for better visibility</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-primary mr-2">•</span>
                                    <span>Include all relevant dates and details</span>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-accent/20 rounded-lg p-4 shadow-sm">
                            <h3 className="mb-2 text-lg font-semibold">Need Help?</h3>
                            <p className="text-muted-foreground text-sm">
                                If you need assistance with your submission, please contact our support team at
                                <a href="mailto:support@CoinMews.com" className="text-primary ml-1 hover:underline">
                                    support@CoinMews.com
                                </a>
                            </p>
                        </div>
                    </div>

                    <div className="md:col-span-3">
                        <div className="bg-card border-border/50 rounded-lg border p-6 shadow">
                            <h2 className="mb-4 border-b pb-2 text-xl font-semibold">Submission Form</h2>
                            <SubmissionForm />
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
