import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Bookmark, Clock } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Saved Content',
        href: '/saved',
    },
];

const mockSavedContent = [
    {
        id: 1,
        title: 'Understanding Bitcoin Mining',
        type: 'Article',
        savedAt: '2024-03-28',
        category: 'Bitcoin',
    },
    {
        id: 2,
        title: 'DeFi Lending Protocols Guide',
        type: 'Guide',
        savedAt: '2024-03-27',
        category: 'DeFi',
    },
    {
        id: 3,
        title: 'NFT Market Trends 2024',
        type: 'Research',
        savedAt: '2024-03-26',
        category: 'NFTs',
    },
];

export default function SavedContent() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head>
                <title>Saved Items | CoinMews</title>
                <meta name="description" content="Access your saved crypto articles, news, and resources on CoinMews. Quickly revisit your favorite content." />
                <meta name="keywords" content="saved crypto articles, saved news, CoinMews" />
                <link rel="canonical" href={window.location.origin + '/saved'} />
                <meta property="og:title" content="Saved Items | CoinMews" />
                <meta property="og:description" content="Access your saved crypto articles, news, and resources on CoinMews. Quickly revisit your favorite content." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={window.location.origin + '/saved'} />
                <meta property="og:image" content="/favicon.png" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Saved Items | CoinMews" />
                <meta name="twitter:description" content="Access your saved crypto articles, news, and resources on CoinMews. Quickly revisit your favorite content." />
                <meta name="twitter:image" content="/favicon.png" />
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'CollectionPage',
                    'name': 'Saved Items',
                    'description': 'Access your saved crypto articles, news, and resources.',
                    'url': window.location.origin + '/saved',
                    'breadcrumb': {
                        '@type': 'BreadcrumbList',
                        'itemListElement': [
                            { '@type': 'ListItem', position: 1, name: 'Home', item: window.location.origin },
                            { '@type': 'ListItem', position: 2, name: 'Saved', item: window.location.origin + '/saved' }
                        ]
                    }
                }) }} />
            </Head>

            <div className="space-y-6 px-4 py-6">
                <div>
                    <h1 className="text-4xl font-bold">Saved Items</h1>
                    <p className="text-muted-foreground">Access your saved articles and content</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {mockSavedContent.map((content) => (
                        <Card key={content.id}>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg">{content.title}</CardTitle>
                                    <Button variant="ghost" size="icon">
                                        <Bookmark className="h-4 w-4" />
                                    </Button>
                                </div>
                                <CardDescription>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs">{content.type}</span>
                                        <span className="text-muted-foreground">•</span>
                                        <span className="text-xs">{content.category}</span>
                                    </div>
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <div className="text-muted-foreground flex items-center gap-2 text-sm">
                                        <Clock className="h-4 w-4" />
                                        <span>Saved {content.savedAt}</span>
                                    </div>
                                    <Button variant="ghost" size="sm">
                                        Read
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
