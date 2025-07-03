import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Article, Category } from '@/types/articleTypes';
import { CalendarIcon, ChevronDownIcon, UserIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface CategoryByArticlesSectionProps {
    categories: Category[];
    articles?: Article[];
}

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

const formatDateSafe = (dateString?: string | null) => {
    if (!dateString) return 'Date unavailable';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Date unavailable';
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const ArticleCard = ({ article }: { article: Article }) => {
    return (
        <a
            href={`/articles/${article.slug}`}
            className="group flex cursor-pointer items-start space-x-4 rounded-lg p-2 transition-colors hover:bg-muted/50"
        >
            <div className="relative h-20 w-28 flex-shrink-0 overflow-hidden rounded-md">
                <img
                    src={article.banner_url || '/default-banner.png'}
                    alt={article.title}
                    className="h-full w-full object-cover transition-all duration-300 group-hover:scale-105"
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/default-banner.png';
                    }}
                />
                {/* Scope Indicators */}
                <div className="absolute top-2 right-2 flex -space-x-1">
                    {article.is_breaking_news && (
                        <span className="relative z-20 flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
                        </span>
                    )}
                    {article.is_trending && (
                        <span className="relative z-10 flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-yellow-400 opacity-75"></span>
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-yellow-500"></span>
                        </span>
                    )}
                    {article.is_time_sensitive && (
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/75 opacity-75"></span>
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
                        </span>
                    )}
                </div>
            </div>
            <div className="flex flex-1 flex-col space-y-1">
                <h3 className="line-clamp-2 text-base leading-snug font-semibold text-foreground transition-all duration-300 group-hover:text-primary">
                    {article.title}
                </h3>
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    {article.author && (
                        <span className="flex items-center gap-1">
                            <UserIcon className="h-3 w-3" />
                            <span>{article.author.name}</span>
                        </span>
                    )}
                    <span>•</span>
                    <span className="flex items-center gap-1">
                        <CalendarIcon className="h-3 w-3" />
                        <span>{formatDateSafe(article.published_at || article.created_at)}</span>
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
                        <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                            Featured
                        </span>
                    )}
                    {article.is_breaking_news && (
                        <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                            Breaking
                        </span>
                    )}
                    {article.is_trending && (
                        <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                            Trending
                        </span>
                    )}
                </div>
            </div>
        </a>
    );
};

const ArticleCardSkeleton = () => (
    <div className="flex items-start space-x-4 rounded-lg bg-muted/30 p-2">
        <Skeleton className="h-20 w-28 rounded-md" />
        <div className="flex flex-1 flex-col space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-24" />
        </div>
    </div>
);

const CategoryByArticlesSection: React.FC<CategoryByArticlesSectionProps> = ({ categories = [], articles = [] }) => {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [displayedArticles, setDisplayedArticles] = useState<Article[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Get article count for each category
    const getCategoryCount = (categoryId: string) => {
        if (categoryId === 'all') return articles.length;
        return articles.filter((article) => article.category?.id.toString() === categoryId).length;
    };

    // Update displayed articles when category changes
    useEffect(() => {
        setIsLoading(true);
        // Simulate loading for better UX
        setTimeout(() => {
            const filtered =
                selectedCategory === 'all' ? articles : articles.filter((article) => article.category?.id.toString() === selectedCategory);
            setDisplayedArticles(filtered);
            setIsLoading(false);
        }, 300);
    }, [selectedCategory, articles]);

    if (!articles.length) {
        return <div className="py-6 text-center text-foreground">No articles available.</div>;
    }

    const visibleCategories = categories.slice(0, 5);
    const moreCategories = categories.slice(5);

    return (
        <div className="flex flex-col gap-4 lg:flex-row">
            {/* Main Content Column (70%) */}
            <div className="order-2 flex-1">
                {/* Category Navigation Bar */}
                <div className="mb-3 border-b border-border pb-2">
                    <div className="scrollbar-hide flex items-center space-x-1 overflow-x-auto whitespace-nowrap">
                        <div className="bg-primary text-primary-foreground mr-3 rounded-md px-3 py-1.5 text-sm font-semibold">By categories</div>
                        <Button
                            variant="ghost"
                            onClick={() => setSelectedCategory('all')}
                            className={cn(
                                'px-3 py-1.5 text-sm font-medium transition-all',
                                selectedCategory === 'all' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground',
                            )}
                        >
                            All ({getCategoryCount('all')})
                        </Button>
                        {visibleCategories.map((category) => (
                            <Button
                                key={category.id}
                                variant="ghost"
                                onClick={() => setSelectedCategory(category.id.toString())}
                                className={cn(
                                    'px-3 py-1.5 text-sm font-medium transition-all',
                                    selectedCategory === category.id.toString()
                                        ? 'bg-muted text-foreground'
                                        : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground',
                                )}
                            >
                                {category.name} ({getCategoryCount(category.id.toString())})
                            </Button>
                        ))}
                        {moreCategories.length > 0 && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                                    >
                                        More
                                        <ChevronDownIcon className="ui-open:rotate-180 h-4 w-4 transition-transform duration-200" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                    {moreCategories.map((category) => (
                                        <DropdownMenuItem
                                            key={category.id}
                                            onClick={() => setSelectedCategory(category.id.toString())}
                                            className={cn(
                                                'text-sm font-medium',
                                                selectedCategory === category.id.toString()
                                                    ? 'bg-muted text-foreground'
                                                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground',
                                            )}
                                        >
                                            {category.name} ({getCategoryCount(category.id.toString())})
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
                        <div className="col-span-2 py-6 text-center text-foreground">No articles found in this category.</div>
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

export default CategoryByArticlesSection;
