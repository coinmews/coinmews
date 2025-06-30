import { Badge } from '@/components/ui/badge';
import { Article } from '@/types/articleTypes';
import { Link } from '@inertiajs/react';
import { formatDistanceToNow } from 'date-fns';
import { BarChart3, BookOpen, Building2, Clock, FileText, Image, Loader2, MapPin, Megaphone, Newspaper, Target, User, Users } from 'lucide-react';
import { useState } from 'react';
import ShareDialog from '../share-dialog';

interface ArticleHeaderProps {
    article: Article;
}

export function ArticleHeader({ article }: ArticleHeaderProps) {
    const [isImageLoading, setIsImageLoading] = useState(true);
    const [imageError, setImageError] = useState(false);

    const getContentTypeIcon = (type: string) => {
        switch (type) {
            case 'news':
                return <Newspaper className="h-4 w-4" />;
            case 'blog':
                return <BookOpen className="h-4 w-4" />;
            case 'guest_post':
                return <Users className="h-4 w-4" />;
            case 'price_prediction':
                return <Target className="h-4 w-4" />;
            case 'research_report':
                return <BarChart3 className="h-4 w-4" />;
            case 'press_release':
                return <Megaphone className="h-4 w-4" />;
            case 'web3_bulletin':
                return <FileText className="h-4 w-4" />;
            case 'web_story':
                return <Image className="h-4 w-4" />;
            case 'short_news':
                return <Newspaper className="h-4 w-4" />;
            case 'sponsored':
                return <Building2 className="h-4 w-4" />;
            default:
                return <FileText className="h-4 w-4" />;
        }
    };

    return (
        <header className="space-y-4" role="banner" aria-label="Article header">
            {article.banner_url && (
                <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                    {isImageLoading && (
                        <div className="bg-muted absolute inset-0 flex items-center justify-center">
                            <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
                        </div>
                    )}
                    {imageError ? (
                        <div className="bg-muted flex h-full items-center justify-center">
                            <p className="text-muted-foreground">Failed to load image</p>
                        </div>
                    ) : (
                        <img
                            src={article.banner_url}
                            srcSet={`
                                ${article.banner_url}?w=400 400w,
                                ${article.banner_url}?w=800 800w,
                                ${article.banner_url}?w=1200 1200w,
                                ${article.banner_url}?w=1600 1600w
                            `}
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 1200px"
                            alt={article.title}
                            className="h-full w-full object-cover"
                            onLoad={() => setIsImageLoading(false)}
                            onError={() => {
                                setIsImageLoading(false);
                                setImageError(true);
                            }}
                            loading="eager"
                            decoding="async"
                        />
                    )}
                </div>
            )}

            <div className="flex flex-wrap gap-2">
                {article.status === 'draft' && (
                    <Badge variant="outline" aria-label="Article status">
                        Draft
                    </Badge>
                )}
                {article.is_breaking_news && (
                    <Badge variant="destructive" aria-label="Breaking news">
                        Breaking News
                    </Badge>
                )}
                {article.is_featured && (
                    <Badge variant="secondary" aria-label="Featured article">
                        Featured
                    </Badge>
                )}
                {article.is_trending && (
                    <Badge variant="secondary" aria-label="Trending article">
                        Trending
                    </Badge>
                )}
                {article.is_time_sensitive && (
                    <Badge variant="secondary" aria-label="Time sensitive article">
                        Time Sensitive
                    </Badge>
                )}
                {article.category && (
                    <Badge variant="outline" aria-label="Category">
                        <span className="flex items-center gap-1 capitalize">
                            {getContentTypeIcon(article.category.name)}
                            {article.category.name}
                        </span>
                    </Badge>
                )}
                <Badge variant="outline" aria-label="Content type">
                    <span className="flex items-center gap-1 capitalize">
                        {getContentTypeIcon(article.content_type)}
                        {article.content_type.replace('_', ' ')}
                    </span>
                </Badge>
                <div className="flex items-end gap-2 self-end">
                    <ShareDialog url={window.location.href} title={article.title} description={article.excerpt || ''} />
                </div>
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl" id="article-title">
                {article.title}
            </h1>

            <div className="text-muted-foreground flex flex-wrap items-center gap-4 text-sm">
                <span className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="sr-only">Author</span>
                    <Link href={`/authors/${article.author.username}`} className="hover:text-foreground">
                        {article.author.name}
                    </Link>
                </span>
                <span className="flex items-center gap-2 capitalize">
                    <Clock className="h-4 w-4" />
                    <span className="sr-only">Published</span>
                    {formatDistanceToNow(new Date(article.published_at || ''), { addSuffix: true })}
                </span>
                {article.reading_time && (
                    <span className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span className="sr-only">Reading time</span>
                        {article.reading_time} min read
                    </span>
                )}
                {article.location && (
                    <span className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span className="sr-only">Location</span>
                        {article.location}
                    </span>
                )}
                <span className="flex items-center gap-2">
                    <span className="sr-only">Views</span>
                    {article.view_count} views
                </span>
            </div>

            {/* Content Type Specific Information */}
            {article.content_type === 'price_prediction' && article.price_target_low && article.price_target_high && (
                <div className="mt-4 rounded-lg border p-4" role="region" aria-label="Price targets">
                    <div className="flex items-center gap-2 text-sm font-medium">
                        <Target className="h-4 w-4" />
                        Price Targets
                    </div>
                    <div className="mt-2 grid gap-4 sm:grid-cols-2">
                        <div>
                            <div className="text-muted-foreground text-sm">Low Target</div>
                            <div className="text-2xl font-bold">${article.price_target_low}</div>
                        </div>
                        <div>
                            <div className="text-muted-foreground text-sm">High Target</div>
                            <div className="text-2xl font-bold">${article.price_target_high}</div>
                        </div>
                    </div>
                    {article.time_horizon && (
                        <div className="mt-2 text-sm">
                            <span className="text-muted-foreground">Time Horizon:</span> {article.time_horizon}
                        </div>
                    )}
                </div>
            )}

            {article.content_type === 'press_release' && article.company_name && (
                <div className="mt-4 rounded-lg border p-4" role="region" aria-label="Company information">
                    <div className="flex items-center gap-2 text-sm font-medium">
                        <Building2 className="h-4 w-4" />
                        Company Information
                    </div>
                    <div className="mt-2">
                        <div className="text-lg font-semibold">{article.company_name}</div>
                        {article.contact_email && (
                            <div className="mt-1 text-sm">
                                <span className="text-muted-foreground">Email:</span> {article.contact_email}
                            </div>
                        )}
                        {article.contact_phone && (
                            <div className="mt-1 text-sm">
                                <span className="text-muted-foreground">Phone:</span> {article.contact_phone}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {article.content_type === 'web_story' && (
                <div className="mt-4 rounded-lg border p-4" role="region" aria-label="Story information">
                    <div className="flex items-center gap-2 text-sm font-medium">
                        <Image className="h-4 w-4" />
                        Story Information
                    </div>
                    <div className="mt-2 grid gap-4 sm:grid-cols-2">
                        <div>
                            <div className="text-muted-foreground text-sm">Format</div>
                            <div className="font-medium">{article.is_vertical ? 'Vertical' : 'Horizontal'}</div>
                        </div>
                        <div>
                            <div className="text-muted-foreground text-sm">Slides</div>
                            <div className="font-medium">{article.slides_count}</div>
                        </div>
                        {article.story_duration && (
                            <div>
                                <div className="text-muted-foreground text-sm">Duration</div>
                                <div className="font-medium">{article.story_duration} seconds</div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}
