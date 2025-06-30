import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Presale } from '@/types/presaleTypes';
import { format } from 'date-fns';
import { Coins, FileText, Globe, ListChecks, Target, Timer } from 'lucide-react';

interface PresaleContentProps {
    presale: Presale;
}

export function PresaleContent({ presale }: PresaleContentProps) {
    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Main Content */}
            <div className="space-y-6 lg:col-span-2">
                {/* Description */}
                <Card>
                    <CardHeader>
                        <CardTitle>About This Project</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="prose dark:prose-invert max-w-none">{presale.description}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
                {/* Token Details */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Coins className="h-5 w-5" />
                            Token Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <dl className="space-y-4">
                            <DetailItem label="Token Symbol" value={presale.token_symbol} />
                            <DetailItem label="Stage" value={presale.stage} />
                            {presale.launchpad && <DetailItem label="Launchpad" value={presale.launchpad} />}
                            {presale.contract_address && (
                                <DetailItem label="Contract Address" value={presale.contract_address} className="break-all" />
                            )}
                            {presale.total_supply && <DetailItem label="Total Supply" value={Number(presale.total_supply).toLocaleString()} />}
                            {presale.tokens_for_sale && (
                                <DetailItem label="Tokens for Sale" value={Number(presale.tokens_for_sale).toLocaleString()} />
                            )}
                            {presale.percentage_of_supply && (
                                <DetailItem label="% of Supply" value={`${Number(presale.percentage_of_supply).toFixed(2)}%`} />
                            )}
                        </dl>
                    </CardContent>
                </Card>

                {/* Sale Details */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Target className="h-5 w-5" />
                            Sale Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <dl className="space-y-4">
                            <DetailItem label="Price" value={`${Number(presale.token_price).toLocaleString()} ${presale.token_price_currency}`} />
                            {presale.exchange_rate && <DetailItem label="Exchange Rate" value={presale.exchange_rate} />}
                            {presale.soft_cap && (
                                <DetailItem label="Soft Cap" value={`${Number(presale.soft_cap).toLocaleString()} ${presale.token_price_currency}`} />
                            )}
                            {presale.hard_cap && (
                                <DetailItem label="Hard Cap" value={`${Number(presale.hard_cap).toLocaleString()} ${presale.token_price_currency}`} />
                            )}
                            {presale.fundraising_goal && (
                                <DetailItem label="Fundraising Goal" value={`$${Number(presale.fundraising_goal).toLocaleString()}`} />
                            )}
                        </dl>
                    </CardContent>
                </Card>

                {/* Important Dates */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Timer className="h-5 w-5" />
                            Important Dates
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <dl className="space-y-4">
                            <DetailItem label="Start Date" value={format(new Date(presale.start_date), 'PPP')} />
                            <DetailItem label="End Date" value={format(new Date(presale.end_date), 'PPP')} />
                            <DetailItem label="Duration" value={presale.duration} />
                            <DetailItem label="Remaining Time" value={presale.remaining_time} />
                        </dl>
                    </CardContent>
                </Card>

                {/* External Resources */}
                {(presale.website_url || presale.whitepaper_url) && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ListChecks className="h-5 w-5" />
                                Resources
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <dl className="space-y-4">
                                {presale.website_url && (
                                    <div>
                                        <dt className="text-muted-foreground flex items-center gap-2 text-sm">
                                            <Globe className="h-4 w-4" />
                                            Website
                                        </dt>
                                        <dd>
                                            <a
                                                href={presale.website_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-primary hover:underline"
                                            >
                                                {presale.website_url}
                                            </a>
                                        </dd>
                                    </div>
                                )}
                                {presale.whitepaper_url && (
                                    <div>
                                        <dt className="text-muted-foreground flex items-center gap-2 text-sm">
                                            <FileText className="h-4 w-4" />
                                            Whitepaper
                                        </dt>
                                        <dd>
                                            <a
                                                href={presale.whitepaper_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-primary hover:underline"
                                            >
                                                View Whitepaper
                                            </a>
                                        </dd>
                                    </div>
                                )}
                            </dl>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}

interface DetailItemProps {
    label: string;
    value: string | React.ReactNode;
    className?: string;
}

function DetailItem({ label, value, className = '' }: DetailItemProps) {
    return (
        <div className={className}>
            <dt className="text-muted-foreground text-sm">{label}</dt>
            <dd className="font-medium">
                {typeof value === 'string' ? value : <code className="bg-muted rounded p-1 text-xs break-all">{value}</code>}
            </dd>
        </div>
    );
}
