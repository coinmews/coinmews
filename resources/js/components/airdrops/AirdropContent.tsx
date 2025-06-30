import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Airdrop } from '@/types/airdropTypes';
import { AlertCircle, CheckCircle2, Coins, Info } from 'lucide-react';
import React from 'react';

interface AirdropContentProps {
    airdrop: Airdrop;
}

export function AirdropContent({ airdrop }: AirdropContentProps) {
    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Main Content */}
            <div className="space-y-6 lg:col-span-2">
                {/* Description */}
                <Card>
                    <CardHeader>
                        <CardTitle>About This Airdrop</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="prose dark:prose-invert max-w-none">{airdrop.description}</div>
                    </CardContent>
                </Card>

                {/* Requirements */}
                {airdrop.requirements && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Requirements</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3">
                                {Object.entries(airdrop.requirements).map(([key, value]) => (
                                    <li key={key} className="flex items-start gap-2">
                                        <CheckCircle2 className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                                        <span>
                                            <strong>{key}:</strong> {value}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                )}

                {/* Verification Rules */}
                {airdrop.verification_rules && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Verification Rules</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3">
                                {Object.entries(airdrop.verification_rules).map(([key, value]) => (
                                    <li key={key} className="flex items-start gap-2">
                                        <Info className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                                        <span>
                                            <strong>{key}:</strong> {value}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                )}
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
                        <dl className="grid gap-4 sm:grid-cols-2">
                            <DetailItem label="Token Name" value={airdrop.token_name} />
                            <DetailItem label="Token Symbol" value={airdrop.token_symbol} />
                            <DetailItem label="Network" value={airdrop.token_network} />
                            {airdrop.token_contract_address && (
                                <DetailItem label="Contract Address" value={airdrop.token_contract_address} className="sm:col-span-2" />
                            )}
                            {airdrop.total_supply && (
                                <DetailItem label="Total Supply" value={`${airdrop.total_supply.toLocaleString()} ${airdrop.token_symbol}`} />
                            )}
                            {airdrop.airdrop_amount && (
                                <DetailItem label="Airdrop Amount" value={`${airdrop.airdrop_amount.toLocaleString()} ${airdrop.token_symbol}`} />
                            )}
                        </dl>
                    </CardContent>
                </Card>

                {/* Distribution Details */}
                <Card>
                    <CardHeader>
                        <CardTitle>Distribution Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <DetailItem label="Total Supply" value={airdrop.total_supply?.toLocaleString() ?? 'TBA'} />
                        <DetailItem label="Airdrop Amount" value={airdrop.airdrop_amount?.toLocaleString() ?? 'TBA'} />
                        <DetailItem label="Participant Limit" value={airdrop.participant_limit?.toLocaleString() ?? 'Unlimited'} />
                        <DetailItem label="Remaining Spots" value={airdrop.remaining_spots?.toLocaleString() ?? 'Unlimited'} />
                    </CardContent>
                </Card>

                {/* Important Dates */}
                <Card>
                    <CardHeader>
                        <CardTitle>Important Dates</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <DetailItem label="Start Date" value={new Date(airdrop.start_date).toLocaleDateString()} />
                        {airdrop.end_date && <DetailItem label="End Date" value={new Date(airdrop.end_date).toLocaleDateString()} />}
                        <DetailItem label="Duration" value={airdrop.duration} />
                    </CardContent>
                </Card>

                {/* Warning for Potential Status */}
                {airdrop.status === 'potential' && (
                    <Card className="bg-warning/10 border-warning">
                        <CardContent className="pt-6">
                            <div className="text-warning flex items-start gap-2">
                                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                                <p className="text-sm">
                                    This airdrop is currently marked as potential. Details may change before the official announcement.
                                </p>
                            </div>
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
