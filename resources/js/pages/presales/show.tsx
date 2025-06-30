import Footer from '@/components/sections/footer';
import Header from '@/components/sections/header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { PresaleShowPageProps } from '@/types/presaleTypes';
import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import { Calendar, Copy, ExternalLink, Share2, ThumbsUp } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function Show({ presale, similarPresales, structuredData, meta }: PresaleShowPageProps) {
    const [upvotes, setUpvotes] = useState(presale.upvotes_count);
    const [hasUpvoted, setHasUpvoted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleUpvote = async () => {
        if (hasUpvoted || isLoading) return;

        setIsLoading(true);
        try {
            const response = await axios.post(`/api/presales/${presale.id}/upvote`);
            setUpvotes(response.data.upvotes_count);
            setHasUpvoted(true);
            toast.success('Presale upvoted successfully!');
        } catch (error: any) {
            console.error('Error upvoting presale', error);
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

    const copyPresaleLink = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
    };

    // Calculate fundraising progress percentage
    const fundraisingProgress =
        presale.hard_cap && presale.fundraising_goal
            ? Math.min(Math.round((Number(presale.fundraising_goal) / Number(presale.hard_cap)) * 100), 100)
            : 0;

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
                <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
            </Head>

            <Header />

            <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
                <div className="space-y-6">
                    {/* Header Card */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div className="flex flex-col items-start gap-4 md:flex-row md:items-center">
                                <img
                                    src={presale.logo_url || '/images/placeholder-logo.png'}
                                    alt={presale.name}
                                    className="border-muted h-20 w-20 rounded-full border-2"
                                />
                                <div>
                                    <CardTitle className="text-3xl">
                                        {presale.name} ({presale.token_symbol}) Presale
                                    </CardTitle>
                                    <div className="text-muted-foreground mt-2 flex items-center">
                                        <Calendar className="mr-2 h-4 w-4" />
                                        {formatDate(presale.start_date)} – {presale.end_date ? formatDate(presale.end_date) : 'Ongoing'}
                                        <span className="ml-2">
                                            <Badge variant="outline" className="ml-2">
                                                {presale.status.charAt(0).toUpperCase() + presale.status.slice(1)}
                                            </Badge>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button variant="outline" size="icon" onClick={copyPresaleLink}>
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
                                <Badge variant="secondary" className="ml-2 px-3">
                                    {presale.stage}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {/* Admin Actions */}
                            <div className="mt-4 mb-6 flex flex-wrap gap-2">
                                <Button variant="outline" size="sm">
                                    Edit Presale
                                </Button>
                                <Button variant="outline" size="sm">
                                    Promote Presale
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Fundraising Progress Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Fundraising Progress</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <div>
                                    <div className="mb-2 flex justify-between text-sm">
                                        <span>
                                            Raised: {presale.fundraising_goal ? presale.fundraising_goal.toLocaleString() : '0'}{' '}
                                            {presale.token_price_currency}
                                        </span>
                                        <span>
                                            Goal: {presale.hard_cap ? Number(presale.hard_cap).toLocaleString() : 'TBA'}{' '}
                                            {presale.token_price_currency}
                                        </span>
                                    </div>
                                    <Progress value={fundraisingProgress} className="h-3" />
                                    <div className="text-muted-foreground mt-1 text-right text-sm">{fundraisingProgress}% Complete</div>
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                                    <div className="rounded-lg border p-4">
                                        <div className="text-muted-foreground text-sm">Token Price</div>
                                        <div className="text-xl font-bold">
                                            {presale.token_price
                                                ? `${Number(presale.token_price).toFixed(8)} ${presale.token_price_currency}`
                                                : 'TBA'}
                                        </div>
                                    </div>
                                    <div className="rounded-lg border p-4">
                                        <div className="text-muted-foreground text-sm">Soft Cap</div>
                                        <div className="text-xl font-bold">
                                            {presale.soft_cap ? Number(presale.soft_cap).toLocaleString() : 'TBA'} {presale.token_price_currency}
                                        </div>
                                    </div>
                                    <div className="rounded-lg border p-4">
                                        <div className="text-muted-foreground text-sm">Time Remaining</div>
                                        <div className="text-xl font-bold">{presale.remaining_time}</div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Presale Details Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Presale Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 gap-4 rounded-md border p-4 md:grid-cols-2">
                                <div className="flex justify-between border-b p-3">
                                    <span className="font-medium">Presale Platform</span>
                                    <span>{presale.launchpad || 'Custom'}</span>
                                </div>

                                <div className="flex justify-between border-b p-3">
                                    <span className="font-medium">Token Contract</span>
                                    <span className="max-w-[200px] truncate">
                                        {presale.contract_address ? (
                                            <Link
                                                href={`https://etherscan.io/address/${presale.contract_address}`}
                                                target="_blank"
                                                className="text-primary flex items-center hover:underline"
                                            >
                                                <span className="truncate">{presale.contract_address}</span>
                                                <ExternalLink className="ml-1 h-3 w-3" />
                                            </Link>
                                        ) : (
                                            'TBA'
                                        )}
                                    </span>
                                </div>

                                <div className="flex justify-between border-b p-3">
                                    <span className="font-medium">Exchange Rate</span>
                                    <span>{presale.exchange_rate || '1:1'}</span>
                                </div>

                                <div className="flex justify-between border-b p-3">
                                    <span className="font-medium">Personal Cap</span>
                                    <span>
                                        {presale.personal_cap ? Number(presale.personal_cap).toLocaleString() : 'No Limit'}{' '}
                                        {presale.token_price_currency}
                                    </span>
                                </div>

                                <div className="flex justify-between border-b p-3">
                                    <span className="font-medium">Total Supply</span>
                                    <span>{presale.total_supply ? Number(presale.total_supply).toLocaleString() : 'TBA'}</span>
                                </div>

                                <div className="flex justify-between border-b p-3">
                                    <span className="font-medium">Tokens For Sale</span>
                                    <span>{presale.tokens_for_sale ? Number(presale.tokens_for_sale).toLocaleString() : 'TBA'}</span>
                                </div>

                                <div className="flex justify-between border-b p-3">
                                    <span className="font-medium">% of Total Supply</span>
                                    <span>{presale.percentage_of_supply ? presale.percentage_of_supply + '%' : 'TBA'}</span>
                                </div>

                                <div className="flex justify-between border-b p-3">
                                    <span className="font-medium">Presale Duration</span>
                                    <span>{presale.duration || 'TBA'}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Project Overview */}
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                About {presale.name} ({presale.token_symbol})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: presale.description }} />

                            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="space-y-4">
                                    <div>
                                        <p className="mb-2 font-medium">Project Category</p>
                                        <Badge variant="secondary">{presale.project_category || 'Cryptocurrency'}</Badge>
                                    </div>

                                    <div>
                                        <p className="mb-2 font-medium">Launchpad</p>
                                        <Badge variant="outline">{presale.launchpad || 'Custom'}</Badge>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <p className="mb-2 font-medium">Documents & Links</p>
                                        <div className="flex flex-wrap gap-2">
                                            {presale.website_url && (
                                                <Button variant="outline" size="sm" className="gap-2" asChild>
                                                    <Link href={presale.website_url} target="_blank">
                                                        <ExternalLink className="h-4 w-4" /> Website
                                                    </Link>
                                                </Button>
                                            )}
                                            {presale.whitepaper_url && (
                                                <Button variant="outline" size="sm" className="gap-2" asChild>
                                                    <Link href={presale.whitepaper_url} target="_blank">
                                                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                                                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
                                                            <path d="M14 3v5h5M16 13H8M16 17H8M10 9H8" />
                                                        </svg>
                                                        Whitepaper
                                                    </Link>
                                                </Button>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <p className="mb-2 font-medium">Social Media</p>
                                        <div className="flex gap-2">
                                            {presale.social_media_links && presale.social_media_links.twitter && (
                                                <Button variant="outline" size="icon" asChild>
                                                    <Link href={presale.social_media_links.twitter} target="_blank">
                                                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                                                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                                        </svg>
                                                    </Link>
                                                </Button>
                                            )}
                                            {presale.social_media_links && presale.social_media_links.telegram && (
                                                <Button variant="outline" size="icon" asChild>
                                                    <Link href={presale.social_media_links.telegram} target="_blank">
                                                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                                                            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm.424 19.876c-.5.016-1.003-.022-1.5-.114l.055-1.58c.048-.7.083-1.173.083-1.374 0-.424-.143-.636-.429-.636-.214 0-.428.126-.643.378.179.378.268.8.268 1.272 0 .298-.065.87-.197 1.718l-.179 1.143a12.22 12.22 0 01-1.26-.762l.263-1.583c.126-.784.189-1.311.189-1.58 0-.369-.133-.554-.399-.554-.238 0-.505.167-.801.5-.036.261.054.547.054.857 0 .312-.071.9-.214 1.762l-.161.998a8.133 8.133 0 01-1.2-1.096l.305-1.352c.19-.844.286-1.482.286-1.911 0-.238-.024-.416-.071-.536a5.7 5.7 0 011.393-.79c.214-.083.392-.125.536-.125.547 0 .821.393.821 1.179 0 .202-.036.512-.107.928.226-.237.47-.47.733-.7.273-.237.518-.355.736-.355.416 0 .736.175.96.526.214.35.321.826.321 1.429 0 .762-.143 1.746-.428 2.952.904.321 1.641.472 2.214.453v-2.666c-.012-2.666.953-4.77 2.892-6.313a10.65 10.65 0 00-3.696-.662c-2.75 0-5.124.922-7.123 2.767-1.977 1.845-2.965 4.075-2.965 6.69 0 2.678 1 4.976 3 6.893 2 1.893 4.44 2.84 7.318 2.84 2.357 0 4.434-.675 6.23-2.023 1.798-1.35 3.01-3.206 3.64-5.571-.571.321-1.375.482-2.41.482h-.537v-2.678a3.047 3.047 0 01-.161-.572c0-.19.053-.285.16-.285.083 0 .245.094.483.284v-1.911c-.952-.643-1.606-.964-1.964-.964-.38 0-.582.284-.607.857a5.476 5.476 0 00-.804-.557c-.297-.155-.583-.232-.858-.232-.821 0-1.482.418-1.982 1.255-.5.833-.75 1.88-.75 3.142v.572c.012.214.03.399.054.554z" />
                                                        </svg>
                                                    </Link>
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* How to Participate */}
                    <Card id="participate">
                        <CardHeader>
                            <CardTitle>How to Participate in {presale.name} Presale</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ol className="list-decimal space-y-4 pl-6">
                                <li className="font-medium">Connect your wallet to the presale platform</li>
                                <li className="font-medium">Make sure you have sufficient funds ({presale.token_price_currency})</li>
                                <li className="font-medium">
                                    Enter the amount you wish to invest (min:{' '}
                                    {presale.personal_cap ? Number(presale.personal_cap).toLocaleString() : 'No Limit'} {presale.token_price_currency}
                                    )
                                </li>
                                <li className="font-medium">Confirm the transaction in your wallet</li>
                                <li className="font-medium">Tokens will be available for claim after the presale ends</li>
                            </ol>

                            <div className="mt-6">
                                <Button disabled={presale.status !== 'ongoing'} className="w-full">
                                    {presale.status === 'upcoming'
                                        ? 'Presale Coming Soon'
                                        : presale.status === 'ongoing'
                                          ? 'Participate in Presale'
                                          : 'Presale Ended'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Floating mobile action buttons */}
                <div className="fixed right-6 bottom-6 z-10 flex space-x-2">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="outline" size="icon" className="rounded-full shadow-md" onClick={copyPresaleLink}>
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
