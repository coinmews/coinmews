import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { BarChart3Icon, CoinsIcon, TrendingDownIcon, TrendingUpIcon } from 'lucide-react';
import React from 'react';

interface MarketOverviewProps {
    data?: {
        total_market_cap: { usd: number };
        market_cap_change_percentage_24h_usd: number;
        active_cryptocurrencies: number;
        markets: number;
    };
}

const formatMarketCap = (value: number): string => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    return `$${value.toLocaleString()}`;
};

const MarketOverview: React.FC<MarketOverviewProps> = ({ data }) => {
    // Add console.log for debugging
    console.log('MarketOverview data:', data);

    if (!data) {
        return (
            <div className="space-y-4">
                <h2 className="text-2xl font-semibold">Market Overview</h2>
                <div className="py-4 text-center">Loading market data...</div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Market Overview</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-card rounded-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Market Cap</CardTitle>
                        <CoinsIcon className="text-muted-foreground h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatMarketCap(data.total_market_cap.usd)}</div>
                    </CardContent>
                </Card>

                <Card className="bg-card rounded-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">24h Change</CardTitle>
                        {data.market_cap_change_percentage_24h_usd >= 0 ? (
                            <TrendingUpIcon className="h-4 w-4 text-green-500" />
                        ) : (
                            <TrendingDownIcon className="h-4 w-4 text-red-500" />
                        )}
                    </CardHeader>
                    <CardContent>
                        <div className={cn('text-2xl font-bold', data.market_cap_change_percentage_24h_usd >= 0 ? 'text-green-500' : 'text-red-500')}>
                            {data.market_cap_change_percentage_24h_usd >= 0 ? '+' : ''}
                            {data.market_cap_change_percentage_24h_usd.toFixed(2)}%
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-card rounded-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Cryptocurrencies</CardTitle>
                        <CoinsIcon className="text-muted-foreground h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.active_cryptocurrencies.toLocaleString()}</div>
                    </CardContent>
                </Card>

                <Card className="bg-card rounded-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Markets</CardTitle>
                        <BarChart3Icon className="text-muted-foreground h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.markets.toLocaleString()}</div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default MarketOverview;
