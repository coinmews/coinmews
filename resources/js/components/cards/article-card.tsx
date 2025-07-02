import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Article } from '@/types/articleTypes';
import { Link } from '@inertiajs/react';
import { BookOpenIcon, CalendarIcon, GlobeIcon, UserIcon } from 'lucide-react';
import React, { useState } from 'react';
import WebStoryCard from './web-story-card';

const formatViewCount = (count: number): string => {
    const roundToOneDecimal = (num: number) => {
        const withDecimal = parseFloat((Math.round(num * 10) / 10).toFixed(1));
        return withDecimal % 1 === 0 ? Math.round(withDecimal) : withDecimal;
    };

    if (count >= 1000000000) return `${roundToOneDecimal(count / 1000000000)}b`;
    if (count >= 1000000) return `${roundToOneDecimal(count / 1000000)}m`;
    if (count >= 1000) return `${roundToOneDecimal(count / 1000)}k`;
    return count.toString();
};

const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

type ContentType =
    | 'news'
    | 'blog'
    | 'press_release'
    | 'sponsored'
    | 'price_prediction'
    | 'guest_post'
    | 'research_report'
    | 'web3_bulletin'
    | 'web_story'
    | 'short_news';

const getContentTypeColor = (type: ContentType): string => {
    const colors: Record<ContentType, { bg: string; text: string }> = {
        news: { bg: 'bg-primary', text: 'text-primary-foreground' },
        short_news: { bg: 'bg-primary/90', text: 'text-primary-foreground' },
        blog: { bg: 'bg-primary', text: 'text-primary-foreground' },
        press_release: { bg: 'bg-primary', text: 'text-primary-foreground' },
        sponsored: { bg: 'bg-primary/80', text: 'text-primary-foreground' },
        price_prediction: { bg: 'bg-primary', text: 'text-primary-foreground' },
        guest_post: { bg: 'bg-primary/90', text: 'text-primary-foreground' },
        research_report: { bg: 'bg-primary', text: 'text-primary-foreground' },
        web3_bulletin: { bg: 'bg-primary', text: 'text-primary-foreground' },
        web_story: { bg: 'bg-primary', text: 'text-primary-foreground' },
    };
    return `${colors[type]?.bg || 'bg-primary'} ${colors[type]?.text || 'text-primary-foreground'}`;
};

type ArticleCardProps = {
    article: Article;
    darkMode?: boolean;
};

const ArticleCard: React.FC<ArticleCardProps> = ({ article, darkMode = false }) => {
    // Render WebStoryCard for web stories
    if (article.content_type === 'web_story') {
        return <WebStoryCard article={article} />;
    }

    const [imageErrors, setImageErrors] = useState<{ [key: number]: boolean }>({});

    const handleImageError = (articleId: number) => {
        setImageErrors((prev) => ({ ...prev, [articleId]: true }));
    };

    const isPublished = (article: Article) => {
        if (article.status !== 'published' && article.status !== 'featured') return false;
        if (!article.published_at) return false;
        return new Date(article.published_at) <= new Date();
    };

    // Use explicit darkMode prop OR system dark theme setting
    const shouldUseDarkMode = darkMode;

    return (
        <Link href={`/articles/${article.slug}`}>
            <Card
                className={cn(
                    'group relative cursor-pointer overflow-hidden rounded-lg p-0',
                    article.deleted_at && 'opacity-60',
                    shouldUseDarkMode ? 'border-neutral-700 bg-neutral-800' : 'bg-white',
                )}
            >
                <div className="relative aspect-video overflow-hidden rounded-lg p-2">
                    <img
                        src={article.banner_url || article.banner_image || '/default-banner.png'}
                        alt={article.title}
                        className="aspect-video h-full w-full rounded-lg object-cover"
                        onError={() => handleImageError(article.id)}
                        loading="lazy"
                    />
                    {/* Status Indicators */}
                    <div className="absolute top-3 right-3 flex -space-x-1">
                        {article.is_breaking_news && (
                            <span className="relative z-30 flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
                            </span>
                        )}
                        {article.is_trending && (
                            <span className="relative z-20 flex h-2 w-2">
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

                    {/* Category and Type Badges */}
                    <div className="absolute bottom-3 left-3 flex flex-wrap gap-2">
                        <Badge variant="secondary" className="bg-primary/80 text-primary-foreground text-xs uppercase">
                            {article.category?.name}
                        </Badge>
                        <Badge variant="secondary" className={`text-xs uppercase ${getContentTypeColor(article.content_type as ContentType)}`}>
                            {article.content_type.replace('_', ' ')}
                        </Badge>
                        {article.status === 'featured' && (
                            <Badge variant="secondary" className="bg-primary/80 text-primary-foreground text-xs uppercase">
                                Featured
                            </Badge>
                        )}
                        {article.is_breaking_news && (
                            <Badge variant="secondary" className="bg-primary/80 text-primary-foreground text-xs uppercase">
                                Breaking
                            </Badge>
                        )}
                        {article.is_trending && (
                            <Badge variant="secondary" className="bg-primary/80 text-primary-foreground text-xs uppercase">
                                Trending
                            </Badge>
                        )}
                        {article.is_time_sensitive && (
                            <Badge variant="secondary" className="bg-primary/80 text-primary-foreground text-xs uppercase">
                                Time Sensitive
                            </Badge>
                        )}
                    </div>

                    {/* Draft Indicator */}
                    {article.status === 'draft' && (
                        <div className="bg-background/50 absolute inset-0 flex items-center justify-center">
                            <span className="bg-primary text-primary-foreground rounded-full px-3 py-1 text-xs font-medium">Draft</span>
                        </div>
                    )}
                </div>

                <CardContent className="space-y-4 p-4">
                    {/* Title and Excerpt */}
                    <div className="space-y-2">
                        <CardTitle
                            className={cn(
                                'line-clamp-1 text-xl font-semibold text-balance transition-colors',
                                shouldUseDarkMode ? 'text-white group-hover:text-gray-300' : 'group-hover:text-muted-foreground',
                            )}
                        >
                            {article.title}
                        </CardTitle>
                        <CardDescription className={cn('line-clamp-1 text-sm', shouldUseDarkMode ? 'text-gray-400' : 'text-muted-foreground')}>
                            {article.excerpt}
                        </CardDescription>
                    </div>

                    {/* Essential Metadata */}
                    <div className={cn('grid grid-cols-3 gap-2 text-xs', shouldUseDarkMode ? 'text-gray-400' : 'text-muted-foreground')}>
                        {article.author && (
                            <span className="flex items-center gap-1">
                                <UserIcon className="h-3 w-3" />
                                <span>{article.author.name}</span>
                            </span>
                        )}
                        <span className="flex items-center gap-1">
                            <CalendarIcon className="h-3 w-3" />
                            {isPublished(article) ? (
                                <span>{formatDate(article.published_at!)}</span>
                            ) : (
                                <span>Draft created {formatDate(article.created_at)}</span>
                            )}
                        </span>
                        {article.source && (
                            <span className="flex items-center gap-1">
                                <GlobeIcon className="h-3 w-3" />
                                <span>{article.source}</span>
                            </span>
                        )}

                        {article.reading_time && (
                            <span className="flex items-center gap-1">
                                <BookOpenIcon className="h-3 w-3" />
                                <span>{article.reading_time} min read</span>
                            </span>
                        )}
                    </div>

                    {/* Stats Row */}
                    {/* <div
                        className={cn(
                            'flex items-center justify-between border-t pt-3 text-xs',
                            shouldUseDarkMode ? 'border-neutral-700 text-gray-400' : 'text-muted-foreground',
                        )}
                    >
                        <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1">
                                <EyeIcon className="h-3 w-3" />
                                <span>{formatViewCount(article.view_count)}</span>
                            </span>

                            <span className="flex items-center gap-1">
                                <MessageCircleIcon className="h-3 w-3" />
                                <span>{article.comments?.length || 0}</span>
                            </span>
                        </div>
                    </div> */}
                </CardContent>
            </Card>
        </Link>
    );
};

export default ArticleCard;
