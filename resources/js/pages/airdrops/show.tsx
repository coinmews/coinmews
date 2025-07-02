import Footer from '@/components/sections/footer';
import Header from '@/components/sections/header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AirdropShowPageProps } from '@/types/airdropTypes';
import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import { Calendar, ChevronRight, Copy, ExternalLink, Share2, ThumbsUp, Twitter } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function Show({ airdrop, similarAirdrops, structuredData, meta }: AirdropShowPageProps) {
    const [upvotes, setUpvotes] = useState(airdrop.upvotes_count);
    const [hasUpvoted, setHasUpvoted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleUpvote = async () => {
        if (hasUpvoted || isLoading) return;

        setIsLoading(true);
        try {
            const response = await axios.post(`/api/airdrops/${airdrop.id}/upvote`);
            setUpvotes(response.data.upvotes_count);
            setHasUpvoted(true);
            toast.success('Airdrop upvoted successfully!');
        } catch (error: any) {
            console.error('Error upvoting airdrop', error);
            if (error.response?.status === 401) {
                toast.error('You need to be logged in to upvote');
            } else {
                toast.error('Failed to upvote. Please try again later.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date
            .toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            })
            .replace(/\//g, '-');
    };

    // Calculate percentage of supply
    const percentOfSupply =
        airdrop.percent_of_supply ||
        (airdrop.total_supply && airdrop.airdrop_qty ? ((Number(airdrop.airdrop_qty) / Number(airdrop.total_supply)) * 100).toFixed(6) : null);

    const copyAirdropLink = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
    };

    return (
        <>
            <Head>
                <title>{meta.title}</title>
                <meta name="description" content={meta.description} />
                <meta name="keywords" content={meta.keywords} />
                <link rel="canonical" href={meta.canonical} />

                {/* Open Graph */}
                <meta property="og:title" content={meta.og.title} />
                <meta property="og:description" content={meta.og.description} />
                <meta property="og:image" content={meta.og.image ?? ''} />
                <meta property="og:type" content={meta.og.type} />
                <meta property="og:url" content={meta.og.url} />

                {/* Twitter */}
                <meta name="twitter:card" content={meta.twitter.card} />
                <meta name="twitter:title" content={meta.twitter.title} />
                <meta name="twitter:description" content={meta.twitter.description} />
                <meta name="twitter:image" content={meta.twitter.image ?? ''} />

                {/* Structured Data */}
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
            </Head>

            <Header />

            <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
                <div className="space-y-6">
                    {/* Header Card */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div className="flex flex-col items-start gap-4 md:flex-row md:items-center">
                                <img
                                    src={airdrop.logo_url || '/images/placeholder-logo.png'}
                                    alt={airdrop.name}
                                    className="border-muted h-20 w-20 rounded-full border-2"
                                    loading="lazy"
                                />
                                <div>
                                    <CardTitle className="text-3xl">
                                        {airdrop.name} ({airdrop.token_symbol}) Token Airdrop
                                    </CardTitle>
                                    <div className="text-muted-foreground mt-2 flex items-center">
                                        <Calendar className="mr-2 h-4 w-4" />
                                        {formatDate(airdrop.start_date)} – {airdrop.end_date ? formatDate(airdrop.end_date) : 'Ongoing'}
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button variant="outline" size="icon" onClick={copyAirdropLink}>
                                                <Copy className="h-4 w-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Copy link</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button variant="outline" size="icon" onClick={handleUpvote} disabled={hasUpvoted || isLoading}>
                                                <ThumbsUp className={`h-4 w-4 ${hasUpvoted ? 'fill-primary' : ''}`} />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Upvote ({upvotes})</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                <Badge variant="outline" className="ml-2 px-3">
                                    {airdrop.status.charAt(0).toUpperCase() + airdrop.status.slice(1)}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {/* Admin Actions */}
                            <div className="mt-4 mb-6 flex flex-wrap gap-2">
                                <Button variant="outline" size="sm">
                                    Add/Edit Airdrop
                                </Button>
                                <Button variant="outline" size="sm">
                                    Edit {airdrop.name}
                                </Button>
                                <Button variant="outline" size="sm">
                                    Advertise Airdrop
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Details Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Airdrop Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border">
                                <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
                                    <div className="flex justify-between border-b p-3">
                                        <span className="font-medium">Airdrop Platform</span>
                                        <span>{airdrop.blockchain || 'On Website'}</span>
                                    </div>

                                    <div className="flex justify-between border-b p-3">
                                        <span className="font-medium">Airdrop Value (USD)</span>
                                        <span>
                                            {airdrop.usd_value
                                                ? Number(airdrop.usd_value).toLocaleString()
                                                : airdrop.airdrop_qty
                                                  ? '~' + (Number(airdrop.airdrop_qty) * 0.01).toLocaleString()
                                                  : 'TBA'}
                                        </span>
                                    </div>

                                    <div className="flex justify-between border-b p-3">
                                        <span className="font-medium">Participate Now</span>
                                        <Link href="#participate" className="text-primary flex items-center hover:underline">
                                            <ExternalLink className="mr-1 h-4 w-4" />
                                        </Link>
                                    </div>

                                    <div className="flex justify-between border-b p-3">
                                        <span className="font-medium">Number Of Winners</span>
                                        <span className="flex items-center">
                                            <span className="mr-1 text-amber-500">🏆</span>
                                            {airdrop.winners_count?.toLocaleString() || 'TBA'}
                                        </span>
                                    </div>

                                    <div className="flex justify-between border-b p-3">
                                        <span className="font-medium">Total Token Supply</span>
                                        <span>{airdrop.total_supply ? Number(airdrop.total_supply).toLocaleString() : 'TBA'}</span>
                                    </div>

                                    <div className="flex justify-between border-b p-3">
                                        <span className="font-medium">Winner Announcement</span>
                                        <span>TBA</span>
                                    </div>

                                    <div className="flex justify-between border-b p-3">
                                        <span className="font-medium">Total Airdrop Qty</span>
                                        <span>{airdrop.airdrop_qty ? Number(airdrop.airdrop_qty).toLocaleString() : 'TBA'}</span>
                                    </div>

                                    <div className="flex justify-between border-b p-3">
                                        <span className="font-medium">Airdrop % of Supply</span>
                                        <span>{percentOfSupply || 'TBA'}</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Participation Card */}
                    <Card id="participate">
                        <CardHeader>
                            <CardTitle>
                                Participate in {airdrop.name} ({airdrop.token_symbol}) Airdrop - Step by Step Guide
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                <div className="space-y-4 md:col-span-2">
                                    <ol className="list-decimal space-y-4 pl-6">
                                        <li className="font-medium">
                                            Follow{' '}
                                            <Link href="#" className="text-primary hover:underline">
                                                {airdrop.name} Twitter
                                            </Link>
                                        </li>
                                        <li className="font-medium">
                                            Join{' '}
                                            <Link href="#" className="text-primary hover:underline">
                                                {airdrop.name} Telegram Group
                                            </Link>
                                        </li>
                                        {airdrop.tasks_count > 0 && <li className="font-medium">Complete {airdrop.tasks_count} simple tasks</li>}
                                    </ol>
                                </div>
                                <div>
                                    <h3 className="mb-2 font-semibold">Connect Here</h3>
                                    <div className="flex flex-row gap-2 md:flex-col">
                                        <Link href="#" className="hover:bg-muted flex items-center gap-2 rounded-md border p-2">
                                            <Twitter className="h-5 w-5" />
                                            <span>Twitter</span>
                                        </Link>
                                        <Link href="#" className="hover:bg-muted flex items-center gap-2 rounded-md border p-2">
                                            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm.424 19.876c-.5.016-1.003-.022-1.5-.114l.055-1.58c.048-.7.083-1.173.083-1.374 0-.424-.143-.636-.429-.636-.214 0-.428.126-.643.378.179.378.268.8.268 1.272 0 .298-.065.87-.197 1.718l-.179 1.143a12.22 12.22 0 01-1.26-.762l.263-1.583c.126-.784.189-1.311.189-1.58 0-.369-.133-.554-.399-.554-.238 0-.505.167-.801.5.036.261.054.547.054.857 0 .312-.071.9-.214 1.762l-.161.998a8.133 8.133 0 01-1.2-1.096l.305-1.352c.19-.844.286-1.482.286-1.911 0-.238-.024-.416-.071-.536a5.7 5.7 0 011.393-.79c.214-.083.392-.125.536-.125.547 0 .821.393.821 1.179 0 .202-.036.512-.107.928.226-.237.47-.47.733-.7.273-.237.518-.355.736-.355.416 0 .736.175.96.526.214.35.321.826.321 1.429 0 .762-.143 1.746-.428 2.952.904.321 1.641.472 2.214.453v-2.666c-.012-2.666.953-4.77 2.892-6.313a10.65 10.65 0 00-3.696-.662c-2.75 0-5.124.922-7.123 2.767-1.977 1.845-2.965 4.075-2.965 6.69 0 2.678 1 4.976 3 6.893 2 1.893 4.44 2.84 7.318 2.84 2.357 0 4.434-.675 6.23-2.023 1.798-1.35 3.01-3.206 3.64-5.571-.571.321-1.375.482-2.41.482h-.537v-2.678a3.047 3.047 0 01-.161-.572c0-.19.053-.285.16-.285.083 0 .245.094.483.284v-1.911c-.952-.643-1.606-.964-1.964-.964-.38 0-.582.284-.607.857a5.476 5.476 0 00-.804-.557c-.297-.155-.583-.232-.858-.232-.821 0-1.482.418-1.982 1.255-.5.833-.75 1.88-.75 3.142v.572c.012.214.03.399.054.554z" />
                                            </svg>
                                            <span>Telegram</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* About Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                About {airdrop.name} ({airdrop.token_symbol}) Crypto Airdrop
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                {airdrop.name}: Airdrop Crypto Token on {airdrop.blockchain} Blockchain
                            </p>
                            <div className="prose max-w-none pt-4" dangerouslySetInnerHTML={{ __html: airdrop.description }} />
                        </CardContent>
                    </Card>

                    {/* Project Details Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {airdrop.name} ({airdrop.token_symbol}) Project Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="space-y-4">
                                    <div>
                                        <p className="mb-2 font-medium">Project Category</p>
                                        <Badge variant="secondary">{airdrop.type || 'Artificial Intelligence'}</Badge>
                                    </div>

                                    <div>
                                        <p className="mb-2 font-medium">Blockchain</p>
                                        <Badge variant="outline">{airdrop.blockchain || 'Unknown'}</Badge>
                                        <Button variant="ghost" size="sm" className="ml-2">
                                            <ChevronRight className="mr-1 h-4 w-4" /> View All
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <p className="mb-2 font-medium">Documents & Links</p>
                                        <div className="flex flex-wrap gap-2">
                                            <Button variant="outline" size="sm" className="gap-2">
                                                <ExternalLink className="h-4 w-4" /> Website
                                            </Button>
                                            <Button variant="outline" size="sm" className="gap-2">
                                                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
                                                    <path d="M14 3v5h5M16 13H8M16 17H8M10 9H8" />
                                                </svg>
                                                Whitepaper
                                            </Button>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="mb-2 font-medium">Social Media</p>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="icon">
                                                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                                </svg>
                                            </Button>
                                            <Button variant="outline" size="icon">
                                                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm.424 19.876c-.5.016-1.003-.022-1.5-.114l.055-1.58c.048-.7.083-1.173.083-1.374 0-.424-.143-.636-.429-.636-.214 0-.428.126-.643.378.179.378.268.8.268 1.272 0 .298-.065.87-.197 1.718l-.179 1.143a12.22 12.22 0 01-1.26-.762l.263-1.583c.126-.784.189-1.311.189-1.58 0-.369-.133-.554-.399-.554-.238 0-.505.167-.801.5.036.261.054.547.054.857 0 .312-.071.9-.214 1.762l-.161.998a8.133 8.133 0 01-1.2-1.096l.305-1.352c.19-.844.286-1.482.286-1.911 0-.238-.024-.416-.071-.536a5.7 5.7 0 011.393-.79c.214-.083.392-.125.536-.125.547 0 .821.393.821 1.179 0 .202-.036.512-.107.928.226-.237.47-.47.733-.7.273-.237.518-.355.736-.355.416 0 .736.175.96.526.214.35.321.826.321 1.429 0 .762-.143 1.746-.428 2.952.904.321 1.641.472 2.214.453v-2.666c-.012-2.666.953-4.77 2.892-6.313a10.65 10.65 0 00-3.696-.662c-2.75 0-5.124.922-7.123 2.767-1.977 1.845-2.965 4.075-2.965 6.69 0 2.678 1 4.976 3 6.893 2 1.893 4.44 2.84 7.318 2.84 2.357 0 4.434-.675 6.23-2.023 1.798-1.35 3.01-3.206 3.64-5.571-.571.321-1.375.482-2.41.482h-.537v-2.678a3.047 3.047 0 01-.161-.572c0-.19.053-.285.16-.285.083 0 .245.094.483.284v-1.911c-.952-.643-1.606-.964-1.964-.964-.38 0-.582.284-.607.857a5.476 5.476 0 00-.804-.557c-.297-.155-.583-.232-.858-.232-.821 0-1.482.418-1.982 1.255-.5.833-.75 1.88-.75 3.142v.572c.012.214.03.399.054.554z" />
                                                </svg>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Floating mobile action buttons */}
                <div className="fixed right-6 bottom-6 z-10 flex space-x-2">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="outline" size="icon" className="rounded-full shadow-md" onClick={copyAirdropLink}>
                                    <Share2 className="h-5 w-5" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Share</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <Button
                        onClick={handleUpvote}
                        disabled={hasUpvoted || isLoading}
                        className="rounded-full shadow-md"
                        variant={hasUpvoted ? 'secondary' : 'default'}
                    >
                        <ThumbsUp className={`mr-2 h-5 w-5 ${hasUpvoted ? 'fill-current' : ''}`} />
                        <span>{isLoading ? 'Upvoting...' : `Upvote (${upvotes})`}</span>
                    </Button>
                </div>
            </main>

            <Footer />
        </>
    );
}
