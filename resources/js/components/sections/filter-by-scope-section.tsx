import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Article } from '@/types/articleTypes';
import { CalendarIcon, ChevronDownIcon, UserIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';

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
        id: 'featured',
        label: 'Featured',
        getArticles: (props) => props.featuredArticles || [],
    },
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

const ArticleCard = ({ article }: { article: Article }) => {
    return (
        <a
            href={`/articles/${article.slug}`}
            className="group hover:bg-muted/50 flex cursor-pointer items-start space-x-4 rounded-lg p-2 transition-colors"
        >
            <div className="relative h-20 w-28 flex-shrink-0 overflow-hidden rounded-md">
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
                <h3 className="group-hover:text-muted-foreground line-clamp-2 text-base leading-snug font-semibold transition-all duration-300">
                    {article.title}
                </h3>
                <div className="text-muted-foreground/70 flex flex-wrap items-center gap-2 text-xs">
                    {article.author && (
                        <span className="flex items-center gap-1">
                            <UserIcon className="h-3 w-3" />
                            <span>{article.author.name}</span>
                        </span>
                    )}
                    <span>•</span>
                    <span className="flex items-center gap-1">
                        <CalendarIcon className="h-3 w-3" />
                        <span>{new Date(article.created_at).toLocaleDateString()}</span>
                    </span>
                    {/* {article.view_count > 0 && (
                        <>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                                <EyeIcon className="h-3 w-3" />
                                <span>{formatViewCount(article.view_count)}</span>
                            </span>
                        </>
                    )}
                    {article.comments?.length > 0 && (
                        <>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                                <MessageCircleIcon className="h-3 w-3" />
                                <span>{article.comments.length}</span>
                            </span>
                        </>
                    )} */}
                </div>
                {/* Scope Tags */}
                <div className="flex flex-wrap gap-1">
                    {article.is_featured && (
                        <span className="bg-muted text-muted-foreground inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium">
                            Featured
                        </span>
                    )}
                    {article.is_breaking_news && (
                        <span className="bg-muted text-muted-foreground inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium">
                            Breaking
                        </span>
                    )}
                    {article.is_trending && (
                        <span className="bg-muted text-muted-foreground inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium">
                            Trending
                        </span>
                    )}
                </div>
            </div>
        </a>
    );
};

const ArticleCardSkeleton = () => (
    <div className="flex items-start space-x-4 p-2">
        <Skeleton className="h-20 w-28 rounded-md" />
        <div className="flex flex-1 flex-col space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-24" />
        </div>
    </div>
);

const FilterByScopeSection: React.FC<FilterByScopeSectionProps> = (props) => {
    const [selectedScope, setSelectedScope] = useState<ScopeType>('featured');
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

    const hasAnyArticles = SCOPES.some((scope) => scope.getArticles(props).length > 0);

    if (!hasAnyArticles) {
        return <div className="text-muted-foreground py-6 text-center">No articles available.</div>;
    }

    const visibleScopes = SCOPES.slice(0, 4);
    const moreScopes = SCOPES.slice(4);

    return (
        <div className="flex flex-col gap-4 lg:flex-row">
            {/* Main Content Column (70%) */}
            <div className="flex-1">
                {/* Scope Navigation Bar */}
                <div className="mb-3 border-b pb-2">
                    <div className="scrollbar-hide flex items-center space-x-1 overflow-x-auto whitespace-nowrap">
                        <div className="bg-primary text-primary-foreground mr-3 rounded-md px-3 py-1.5 text-sm font-semibold">DON'T MISS</div>
                        {visibleScopes.map((scope) => (
                            <Button
                                key={scope.id}
                                variant="ghost"
                                onClick={() => setSelectedScope(scope.id)}
                                className={cn(
                                    'px-3 py-1.5 text-sm font-medium transition-all',
                                    selectedScope === scope.id ? 'bg-muted text-foreground' : 'text-muted-foreground hover:bg-muted/50',
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
                                        className="text-muted-foreground hover:bg-muted/50 hover:text-foreground flex items-center gap-1 text-sm font-medium"
                                    >
                                        More
                                        <ChevronDownIcon className="ui-open:rotate-180 h-4 w-4 transition-transform duration-200" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                    {moreScopes.map((scope) => (
                                        <DropdownMenuItem
                                            key={scope.id}
                                            onClick={() => setSelectedScope(scope.id)}
                                            className={cn('text-sm font-medium', selectedScope === scope.id && 'bg-muted text-foreground')}
                                        >
                                            {scope.label} ({getScopeCount(scope.id)})
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>
                </div>

                {/* Articles Grid */}
                <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
                    {isLoading ? (
                        Array(6)
                            .fill(0)
                            .map((_, i) => <ArticleCardSkeleton key={i} />)
                    ) : displayedArticles.length === 0 ? (
                        <div className="text-muted-foreground col-span-2 py-6 text-center">No articles found for this scope.</div>
                    ) : (
                        displayedArticles.map((article) => <ArticleCard key={article.id} article={article} />)
                    )}
                </div>
            </div>

            {/* Sidebar (30%) */}
            <div className="lg:w-auto">
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
