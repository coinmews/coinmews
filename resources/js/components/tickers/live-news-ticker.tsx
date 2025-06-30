import { Badge } from '@/components/ui/badge';
import { Article } from '@/types/articleTypes';
import { Link } from '@inertiajs/react';
import { AlertCircleIcon, ClockIcon, TrendingUpIcon } from 'lucide-react';
import React from 'react';

interface LiveNewsTickerProps {
    news: Article[];
}

const LiveNewsTicker: React.FC<LiveNewsTickerProps> = ({ news }) => {
    if (!news || news.length === 0) {
        return (
            <div className="bg-card border-b">
                <div className="mx-auto max-w-7xl px-4 lg:px-6">
                    <div className="flex h-10 items-center justify-center">
                        <Badge variant="secondary" className="bg-primary text-primary-foreground">
                            Loading news updates...
                        </Badge>
                    </div>
                </div>
            </div>
        );
    }

    const newsContent = news.map((item) => (
        <Link
            key={item.id}
            href={`/articles/${item.slug}`}
            className="hover:text-primary flex items-center space-x-2 px-4 text-sm whitespace-nowrap transition-colors"
        >
            <div className="flex items-center space-x-2">
                {item.is_breaking_news && <AlertCircleIcon className="h-4 w-4 text-red-500" />}
                {item.is_trending && <TrendingUpIcon className="h-4 w-4 text-yellow-500" />}
                {item.is_time_sensitive && <ClockIcon className="h-4 w-4 text-primary" />}
                <span>{item.title}</span>
            </div>
        </Link>
    ));

    return (
        <div className="bg-card z-50 border-b">
            <div className="mx-auto max-w-7xl px-4 lg:px-6">
                <div className="flex h-10 items-center">
                    <Badge
                        variant="secondary"
                        className="bg-primary text-primary-foreground px-4 py-1 text-sm font-semibold uppercase rounded-full shadow-sm mr-4 select-none"
                    >
                        LIVE UPDATES
                    </Badge>
                    <div className="marquee-wrapper">
                        <div className="marquee-content">
                            {newsContent}
                            {newsContent} {/* Duplicate content for seamless loop */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LiveNewsTicker;
