import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Article } from '@/types/articleTypes';
import { CalendarIcon, ChevronDownIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import ArticleCard from '../cards/article-card';

interface FilterByScopeSectionProps {
    featuredArticles?: Article[];
    breakingNews?: Article[];
    trendingArticles?: Article[];
    timeSensitiveArticles?: Article[];
    topArticles?: Article[];
    latestReactedArticles?: Article[];
}

type ScopeType = 'featured' | 'breaking' | 'trending' | 'time_sensitive' | 'top_viewed' | 'latest_reacted';

interface ScopeConfig {
    id: ScopeType;
    label: string;
    getArticles: (props: FilterByScopeSectionProps) => Article[];
}

const SCOPES: ScopeConfig[] = [
    {
        id: 'breaking',
        label: 'Breaking News',
        getArticles: (props) => props.breakingNews || [],
    },
    {
        id: 'trending',
        label: 'Trending',
        getArticles: (props) => props.trendingArticles || [],
    },
    {
        id: 'time_sensitive',
        label: 'Time Sensitive',
        getArticles: (props) => props.timeSensitiveArticles || [],
    },
    {
        id: 'top_viewed',
        label: 'Top Viewed',
        getArticles: (props) => props.topArticles || [],
    },
    {
        id: 'latest_reacted',
        label: 'Latest Reacted',
        getArticles: (props) => props.latestReactedArticles || [],
    },
];

const formatViewCount = (count: number): string => {
    const roundToOneDecimal = (num: number) => {
        const withDecimal = parseFloat((Math.round(num * 10) / 10).toFixed(1));
        return withDecimal % 1 === 0 ? Math.round(withDecimal) : withDecimal;
    };

    if (count >= 1000000000) {
        return `${roundToOneDecimal(count / 1000000000)}b`;
    }
    if (count >= 1000000) {
        return `${roundToOneDecimal(count / 1000000)}m`;
    }
    if (count >= 1000) {
        return `${roundToOneDecimal(count / 1000)}k`;
    }
    return count.toString();
};

const formatTimeAgo = (date: string) => {
    const now = new Date();
    const articleDate = new Date(date);
    const diffInMinutes = Math.floor((now.getTime() - articleDate.getTime()) / (1000 * 60));

    if (diffInMinutes < 60) {
        return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 1440) {
        const hours = Math.floor(diffInMinutes / 60);
        return `${hours} hours ago`;
    } else {
        const days = Math.floor(diffInMinutes / 1440);
        return `${days} days ago`;
    }
};

const ArticleCardCompact = ({ article }: { article: Article }) => {
    return (
        <a
            href={`/articles/${article.slug}`}
            className="group flex cursor-pointer items-start space-x-4 rounded-lg p-2 transition-colors last:border-b-0 hover:bg-neutral-100 hover:dark:bg-neutral-800"
        >
            <div className="relative aspect-auto max-w-24 flex-shrink-0 overflow-hidden rounded-md">
                <img
                    src={article.banner_url || '/default-banner.png'}
                    alt={article.title}
                    className="h-full w-full object-cover transition-all duration-300 group-hover:scale-105"
                />
                {/* Scope Indicators */}
                <div className="absolute top-2 right-2 flex -space-x-1">
                    {article.is_breaking_news && (
                        <span className="relative z-20 flex h-1.5 w-1.5">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-red-500"></span>
                        </span>
                    )}
                    {article.is_trending && (
                        <span className="relative z-10 flex h-1.5 w-1.5">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-yellow-400 opacity-75"></span>
                            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-yellow-500"></span>
                        </span>
                    )}
                    {article.is_time_sensitive && (
                        <span className="relative flex h-1.5 w-1.5">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/75 opacity-75"></span>
                            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary"></span>
                        </span>
                    )}
                </div>
            </div>
            <div className="flex flex-1 flex-col space-y-1">
                <h3 className="line-clamp-2 text-sm leading-snug font-semibold text-neutral-900 transition-all duration-300 group-hover:text-neutral-700 dark:text-white dark:group-hover:text-neutral-300">
                    {article.title}
                </h3>
                <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-400">
                    <span className="flex items-center gap-1">
                        <CalendarIcon className="h-3 w-3" />
                        <span>{formatTimeAgo(article.created_at)}</span>
                    </span>

                    {/* <span>•</span>
                    <span className="flex items-center gap-1">
                        <EyeIcon className="h-3 w-3" />
                        <span>{formatViewCount(article.view_count)}</span>
                    </span> */}

                    {/* <span>•</span>
                    <span className="flex items-center gap-1">
                        <MessageCircleIcon className="h-3 w-3" />
                        <span>{article.comments.length}</span>
                    </span> */}
                </div>
            </div>
        </a>
    );
};

const ArticleCardSkeleton = () => (
    <div className="flex items-start space-x-4 border-b border-neutral-700 p-2 last:border-b-0">
        <Skeleton className="h-20 w-28 rounded-md bg-neutral-800" />
        <div className="flex flex-1 flex-col space-y-2">
            <Skeleton className="h-4 w-full bg-neutral-800" />
            <Skeleton className="h-4 w-3/4 bg-neutral-800" />
            <Skeleton className="h-3 w-24 bg-neutral-800" />
        </div>
    </div>
);

const FilterByScopeSection: React.FC<FilterByScopeSectionProps> = (props) => {
    const [selectedScope, setSelectedScope] = useState<ScopeType>('breaking');
    const [displayedArticles, setDisplayedArticles] = useState<Article[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Get article count for each scope
    const getScopeCount = (scopeId: ScopeType) => {
        const scope = SCOPES.find((s) => s.id === scopeId);
        if (!scope) return 0;
        return scope.getArticles(props).length;
    };

    // Update displayed articles when scope changes
    useEffect(() => {
        setIsLoading(true);
        setTimeout(() => {
            const scope = SCOPES.find((s) => s.id === selectedScope);
            const articles = scope ? scope.getArticles(props) : [];
            setDisplayedArticles(articles);
            setIsLoading(false);
        }, 300);
    }, [selectedScope, props]);

    // Log props to see if featured articles are present
    console.log('Filter section props:', {
        featuredArticles: props.featuredArticles?.length || 0,
        breakingNews: props.breakingNews?.length || 0,
        trendingArticles: props.trendingArticles?.length || 0,
    });

    const hasAnyArticles = SCOPES.some((scope) => scope.getArticles(props).length > 0);

    if (!hasAnyArticles) {
        return <div className="py-8 text-center text-neutral-900 dark:text-white">No articles available.</div>;
    }

    // Featured articles (from props.featuredArticles)
    const featuredArticles = props.featuredArticles || [];
    const mainFeaturedArticle = featuredArticles[0];

    const visibleScopes = SCOPES.slice(0, 2);
    const moreScopes = SCOPES.slice(2);

    return (
        <div className="flex flex-col gap-6 py-6 lg:flex-row">
            {/* Trending News Column (Left) */}
            <div className="max-h-[300px] w-full overflow-scroll rounded-lg bg-neutral-100 p-2 shadow-md ring ring-neutral-200/50 sm:max-h-[600px] lg:w-1/4 dark:bg-neutral-900 dark:ring-neutral-950/10">
                {/* Scope Navigation Bar */}
                <div className="border-b border-neutral-200 dark:border-neutral-800">
                    <div className="scrollbar-hide flex items-center space-x-1 overflow-x-auto pb-2 whitespace-nowrap">
                        {visibleScopes.map((scope) => (
                            <Button
                                key={scope.id}
                                variant="ghost"
                                onClick={() => setSelectedScope(scope.id)}
                                className={cn(
                                    'px-4 py-2 text-sm font-medium transition-all',
                                    selectedScope === scope.id
                                        ? 'bg-neutral-200 text-neutral-900 dark:bg-neutral-800 dark:text-white'
                                        : 'text-neutral-500 hover:bg-neutral-200 hover:text-neutral-900 dark:text-neutral-400 hover:dark:bg-neutral-800 hover:dark:text-white',
                                )}
                            >
                                {scope.label} ({getScopeCount(scope.id)})
                            </Button>
                        ))}
                        {moreScopes.length > 0 && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="flex items-center gap-1 text-sm font-medium text-neutral-500 hover:bg-neutral-200 hover:text-neutral-900 dark:text-neutral-400 hover:dark:bg-neutral-800 hover:dark:text-white"
                                    >
                                        More
                                        <ChevronDownIcon className="ui-open:rotate-180 h-4 w-4 transition-transform duration-200" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="end"
                                    className="w-48 border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900"
                                >
                                    {moreScopes.map((scope) => (
                                        <DropdownMenuItem
                                            key={scope.id}
                                            onClick={() => setSelectedScope(scope.id)}
                                            className={cn(
                                                'text-sm font-medium',
                                                selectedScope === scope.id
                                                    ? 'bg-neutral-200 text-neutral-900 dark:bg-neutral-800 dark:text-white'
                                                    : 'text-neutral-500 hover:bg-neutral-200 hover:text-neutral-900 dark:text-neutral-400 hover:dark:bg-neutral-800 hover:dark:text-white',
                                            )}
                                        >
                                            {scope.label} ({getScopeCount(scope.id)})
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>
                </div>

                {/* Articles Grid - Changed to single column */}
                <div className="space-y-2">
                    {isLoading ? (
                        Array(4)
                            .fill(0)
                            .map((_, i) => <ArticleCardSkeleton key={i} />)
                    ) : displayedArticles.length === 0 ? (
                        <div className="py-8 text-center text-neutral-900 dark:text-white">No articles found for this scope.</div>
                    ) : (
                        displayedArticles.map((article) => <ArticleCardCompact key={article.id} article={article} />)
                    )}
                </div>
            </div>

            {/* Featured Articles Column (Middle) */}
            <div className="flex w-full flex-col space-y-6 lg:flex-1">
                {/* Main Featured Article - Horizontal Layout */}
                {mainFeaturedArticle ? (
                    <div className="group relative cursor-pointer overflow-hidden rounded-lg bg-white shadow ring-1 ring-neutral-950/10 dark:border-neutral-800 dark:bg-neutral-900">
                        <a href={`/articles/${mainFeaturedArticle.slug}`} className="flex flex-col md:flex-row">
                            {/* Image Section (Left) */}
                            <div className="relative aspect-video overflow-hidden md:h-auto md:w-2/5">
                                <img
                                    src={mainFeaturedArticle.banner_url || '/default-banner.png'}
                                    alt={mainFeaturedArticle.title}
                                    className="aspect-video h-full w-full object-cover transition-all duration-150 ease-in-out group-hover:scale-105"
                                />
                                {/* Status Indicators */}
                                <div className="absolute top-3 right-3 flex -space-x-1">
                                    {mainFeaturedArticle.is_breaking_news && (
                                        <span className="relative z-30 flex h-2 w-2">
                                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                                            <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
                                        </span>
                                    )}
                                    {mainFeaturedArticle.is_trending && (
                                        <span className="relative z-20 flex h-2 w-2">
                                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-yellow-400 opacity-75"></span>
                                            <span className="relative inline-flex h-2 w-2 rounded-full bg-yellow-500"></span>
                                        </span>
                                    )}
                                    {mainFeaturedArticle.is_time_sensitive && (
                                        <span className="relative z-10 flex h-2 w-2">
                                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/75 opacity-75"></span>
                                            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Content Section (Right) */}
                            <div className="flex flex-col justify-between p-6 md:w-3/5">
                                <div className="space-y-4">
                                    <h2 className="line-clamp-2 text-xl font-bold text-neutral-900 transition-colors group-hover:text-neutral-700 md:text-2xl dark:text-neutral-100 dark:group-hover:text-neutral-300">
                                        {mainFeaturedArticle.title}
                                    </h2>
                                    <p className="line-clamp-2 text-sm text-neutral-600 dark:text-neutral-400">{mainFeaturedArticle.excerpt}</p>
                                </div>

                                <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400">
                                    <span className="flex items-center gap-1">
                                        <CalendarIcon className="h-3 w-3" />
                                        <span>{formatTimeAgo(mainFeaturedArticle.created_at)}</span>
                                    </span>
                                    {/* <span className="flex items-center gap-1">
                                        <EyeIcon className="h-3 w-3" />
                                        <span>{formatViewCount(mainFeaturedArticle.view_count)}</span>
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <MessageCircleIcon className="h-3 w-3" />
                                        <span>{mainFeaturedArticle.comments.length}</span>
                                    </span> */}
                                </div>
                            </div>
                        </a>
                    </div>
                ) : (
                    <div className="flex h-64 items-center justify-center rounded-lg bg-white p-6 ring ring-neutral-200 dark:border-neutral-800 dark:bg-neutral-900">
                        <p className="text-center text-neutral-500 dark:text-neutral-400">No featured article available</p>
                    </div>
                )}

                {/* Sub Featured Articles - Using normal ArticleCard component */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {featuredArticles.length > 1 ? (
                        featuredArticles.slice(1, 3).map((article) => (
                            <div key={article.id}>
                                <ArticleCard article={article} />
                            </div>
                        ))
                    ) : (
                        <>
                            <div className="flex h-40 items-center justify-center rounded-lg bg-neutral-100 p-4 dark:bg-neutral-900">
                                <p className="text-center text-neutral-500 dark:text-neutral-400">No sub-featured article available</p>
                            </div>
                            <div className="flex h-40 items-center justify-center rounded-lg bg-neutral-100 p-4 dark:bg-neutral-900">
                                <p className="text-center text-neutral-500 dark:text-neutral-400">No sub-featured article available</p>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Ad Banner - Responsive for different devices */}
            <div className="w-full lg:w-auto">
                <div className="sticky top-4">
                    {/* Desktop Ad - Wide Skyscraper 160x600 - Only visible on large screens */}
                    <div className="hidden justify-center lg:flex">
                        <div className="h-[600px] w-[160px] overflow-hidden rounded-lg">
                            <img src="/ad-sidebar-token.png" alt="Advertisement" className="h-full w-full object-contain" />
                        </div>
                    </div>

                    {/* Tablet Ad - Leaderboard 728x90 - Visible on medium screens */}
                    <div className="hidden justify-center md:flex lg:hidden">
                        <div className="h-[90px] w-[728px] overflow-hidden rounded-lg">
                            <img src="/ad-tablet-image.png" alt="Advertisement" className="h-full w-full object-contain" />
                        </div>
                    </div>

                    {/* Mobile Ad - Medium Rectangle 300x250 - Visible on small screens */}
                    <div className="flex justify-center md:hidden">
                        <div className="aspect-square h-96 w-96 overflow-hidden rounded-lg">
                            <img src="/ad-mobile-image.png" alt="Advertisement" className="h-full w-full object-contain" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilterByScopeSection;
